// ======================= toml 문법 검사 =======================
/// TOML 1.0 문법 검사 (문법 오류만. Cargo 규칙의 모르는 키·필수 항목은 검사하지 않음).
/// 진단: { line, col, length(코드 포인트, 줄 끝까지로 자름), severity: "error", code: "T001"…, args, msg, help }
/// 문장 하나에서 오류가 나면 그 줄 끝까지 건너뛰고 다음 문장부터 계속 검사한다.
function tomlCheck(text) {
  const cs = Array.from(text), n = cs.length;
  const starts = [0];                                  // 줄 시작 위치 (코드 포인트 번호)
  for (let k = 0; k < n; k++) if (cs[k] === "\n") starts.push(k + 1);
  const lineOf = p => { let a = 0, b = starts.length - 1; while (a < b) { const m = (a + b + 1) >> 1; if (starts[m] <= p) a = m; else b = m - 1; } return a; };
  const diags = [];
  let i = 0;
  const fail = (at, len, code, ...args) => { throw { at, len, code, args }; };
  const isWs = c => c === " " || c === "\t";
  const skipWs = () => { while (i < n && isWs(cs[i])) i++; };
  const skipComment = () => {
    if (cs[i] !== "#") return;
    while (i < n && cs[i] !== "\n") i++;
  };
  // 공백·줄바꿈·주석 모두 건너뜀 (배열 안, 문장 사이)
  const skipAll = () => { for (;;) { skipWs(); if (cs[i] === "\r") { i++; continue; } if (cs[i] === "\n") { i++; continue; } if (cs[i] === "#") { skipComment(); continue; } break; } };

  const BARE = /[A-Za-z0-9_-]/;
  // 키 하나: 따옴표 없는 키, "기본 문자열", '글자 그대로 문자열' → 이름
  const keyPart = () => {
    const c = cs[i];
    if (c === '"') return basicString(false);
    if (c === "'") return literalString(false);
    const s = i;
    while (i < n && BARE.test(cs[i])) i++;
    if (i === s) fail(s, 1, "T002");
    return cs.slice(s, i).join("");
  };
  // a.b."c" → [이름…]
  let keyEnd = 0;   // 마지막으로 읽은 키의 끝 (뒤 공백 제외)
  const dottedKey = () => {
    const parts = [];
    for (;;) {
      skipWs();
      parts.push(keyPart());
      keyEnd = i;
      skipWs();
      if (cs[i] === ".") { i++; continue; }
      return parts;
    }
  };
  const ESC = new Set(["b", "t", "n", "f", "r", '"', "\\"]);
  // "…" 또는 """…""" (multi=true). 시작 따옴표 위치에서 호출
  function basicString(multi) {
    const s = i;
    i += multi ? 3 : 1;
    let out = "";
    for (;;) {
      if (i >= n) fail(s, 1, "T001");
      const c = cs[i];
      if (!multi && c === "\n") fail(s, 1, "T001");
      if (c === '"') {
        if (!multi) { i++; return out; }
        if (cs[i + 1] === '"' && cs[i + 2] === '"') {
          i += 3;
          while (cs[i] === '"' && i < n) { out += '"'; i++; }   // """ 뒤 따옴표 최대 2개
          return out;
        }
        out += c; i++; continue;
      }
      if (c === "\\") {
        const e = cs[i + 1];
        if (ESC.has(e)) { out += e; i += 2; continue; }
        if (e === "u" || e === "U") {
          const len = e === "u" ? 4 : 8, hex = cs.slice(i + 2, i + 2 + len).join("");
          if (!new RegExp("^[0-9a-fA-F]{" + len + "}$").test(hex) || parseInt(hex, 16) > 0x10ffff || (parseInt(hex, 16) >= 0xd800 && parseInt(hex, 16) <= 0xdfff)) fail(i, 2 + (hex.match(/^[0-9a-fA-F]*/)[0].length), "T007", "\\" + e + hex);
          out += hex; i += 2 + len; continue;
        }
        if (multi && (isWs(e) || e === "\n" || e === "\r")) {   // 줄 끝 \ : 다음 글자 앞 공백·줄바꿈 무시
          let k = i + 1;
          while (k < n && (isWs(cs[k]) || cs[k] === "\r")) k++;
          if (cs[k] === "\n") { i = k; while (i < n && (isWs(cs[i]) || cs[i] === "\n" || cs[i] === "\r")) i++; continue; }
        }
        fail(i, 2, "T007", "\\" + (e === undefined || e === "\n" ? "" : e));
      }
      out += c; i++;
    }
  }
  function literalString(multi) {
    const s = i;
    i += multi ? 3 : 1;
    let out = "";
    for (;;) {
      if (i >= n) fail(s, 1, "T001");
      const c = cs[i];
      if (!multi && c === "\n") fail(s, 1, "T001");
      if (c === "'") {
        if (!multi) { i++; return out; }
        if (cs[i + 1] === "'" && cs[i + 2] === "'") { i += 3; while (cs[i] === "'") i++; return out; }
      }
      out += c; i++;
    }
  }
  const INT = /^[+-]?(?:0|[1-9](?:_?\d)*)$/, HEX = /^0x[0-9a-fA-F](?:_?[0-9a-fA-F])*$/, OCT = /^0o[0-7](?:_?[0-7])*$/, BIN = /^0b[01](?:_?[01])*$/;
  const FLOAT = /^[+-]?(?:0|[1-9](?:_?\d)*)(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?$/, SPECIAL = /^[+-]?(?:inf|nan)$/;
  const DATE = /^\d{4}-\d{2}-\d{2}$/, DATETIME = /^\d{4}-\d{2}-\d{2}[Tt ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})?$/, TIME = /^\d{2}:\d{2}:\d{2}(?:\.\d+)?$/;
  // 값 하나. 반환: "string" | "array" | "table" | "scalar"
  function value() {
    const s = i, c = cs[i];
    if (c === undefined || c === "\n" || c === "\r" || c === "#") fail(i, 1, "T005", "");
    if (c === '"') { if (cs[i + 1] === '"' && cs[i + 2] === '"') basicString(true); else basicString(false); return "string"; }
    if (c === "'") { if (cs[i + 1] === "'" && cs[i + 2] === "'") literalString(true); else literalString(false); return "string"; }
    if (c === "[") return array();
    if (c === "{") return inlineTable();
    while (i < n && !/[\s,\]}#]/.test(cs[i])) i++;
    let tok = cs.slice(s, i).join("");
    if (!tok) fail(s, 1, "T005", cs[s]);
    if (DATE.test(tok) && isWs(cs[i]) && /\d/.test(cs[i + 1] || "")) {   // 1979-05-27 07:32:00
      const t0 = i; i++;
      while (i < n && !/[\s,\]}#]/.test(cs[i])) i++;
      tok += " " + cs.slice(t0 + 1, i).join("");
    }
    if (tok === "true" || tok === "false" || INT.test(tok) || HEX.test(tok) || OCT.test(tok) || BIN.test(tok) || FLOAT.test(tok) || SPECIAL.test(tok) || DATE.test(tok) || DATETIME.test(tok) || TIME.test(tok)) return "scalar";
    fail(s, i - s, "T005", tok);
  }
  function array() {
    const s = i;
    i++;
    for (;;) {
      skipAll();
      if (i >= n) fail(s, 1, "T010");
      if (cs[i] === "]") { i++; return "array"; }
      value();
      skipAll();
      if (cs[i] === ",") { i++; continue; }
      if (cs[i] === "]") { i++; return "array"; }
      if (i >= n) fail(s, 1, "T010");
      fail(i, 1, "T010");
    }
  }
  function inlineTable() {
    const s = i;
    i++;
    const seen = new Set();
    skipAll();
    if (cs[i] === "}") { i++; return "table"; }
    for (;;) {
      skipAll();
      const ks = i, key = dottedKey();
      const id = key.join("\u0000");
      if (seen.has(id)) fail(ks, i - ks, "T008", key.join("."));
      seen.add(id);
      skipWs();
      if (cs[i] !== "=") fail(i, 1, "T003");
      i++; skipWs();
      value();
      skipAll();
      if (cs[i] === ",") { i++; skipAll(); if (cs[i] === "}") { i++; return "table"; } continue; }
      if (cs[i] === "}") { i++; return "table"; }
      if (i >= n) fail(s, 1, "T010");
      fail(i, 1, "T010");
    }
  }

  // 이미 정한 것들: 값(키), 머리로 만든 표, 배열 표, 점 키로 암시된 표
  const values = new Set(), tables = new Set(), arrays = new Set(), implicit = new Set();
  const id = path => path.join("\u0000");
  const prefixes = path => path.map((_, k) => id(path.slice(0, k + 1)));
  let table = [];                                       // 지금 표의 경로
  const endOfStatement = () => {
    skipWs();
    if (cs[i] === "\r") i++;
    if (cs[i] === "#") skipComment();
    if (i < n && cs[i] !== "\n") {
      const s = i;
      while (i < n && cs[i] !== "\n") i++;
      fail(s, i - s, "T006");
    }
  };
  function header() {
    const s = i, isArr = cs[i + 1] === "[";
    i += isArr ? 2 : 1;
    skipWs();
    if (cs[i] === "]") fail(s, i + 1 - s, "T004", "empty");
    const ks = i, path = dottedKey();
    if (cs[i] !== "]" || (isArr && cs[i + 1] !== "]")) fail(s, Math.max(i - s, 1), "T004", "open");
    i += isArr ? 2 : 1;
    endOfStatement();
    const key = id(path), all = prefixes(path);
    for (const p of all.slice(0, -1)) if (values.has(p)) fail(ks, i - ks, "T009", path.join("."));
    if (values.has(key)) fail(ks, i - ks, "T009", path.join("."));
    if (isArr) {
      if (tables.has(key) || implicit.has(key)) fail(ks, i - ks, "T009", path.join("."));
      for (const set of [values, tables, arrays, implicit]) for (const v of [...set]) if (v.startsWith(key + "\u0000")) set.delete(v);   // 새 항목이라 아래 내용 처음부터
      arrays.add(key);
    } else {
      if (tables.has(key) || arrays.has(key)) fail(ks, i - ks, "T009", path.join("."));
      tables.add(key);
    }
    for (const p of all.slice(0, -1)) if (!arrays.has(p)) implicit.add(p);
    table = path;
  }
  function keyValue() {
    const ks = i, key = dottedKey();
    const ke = keyEnd;
    skipWs();
    if (cs[i] !== "=") fail(i < n && cs[i] !== "\n" ? i : Math.max(ks, i), 1, "T003");
    i++; skipWs();
    const full = table.concat(key), fid = id(full);
    const kind = value();
    if (values.has(fid) || tables.has(fid) || arrays.has(fid) || implicit.has(fid)) { endOfStatement(); fail(ks, ke - ks, "T008", key.join(".")); }
    for (const p of prefixes(full).slice(0, -1)) if (values.has(p)) { endOfStatement(); fail(ks, ke - ks, "T008", key.join(".")); }
    values.add(fid);
    for (const p of prefixes(full).slice(table.length, -1)) implicit.add(p);
    endOfStatement();
    return kind;
  }

  while (i < n) {
    skipAll();
    if (i >= n) break;
    const stmt = i;
    try {
      if (cs[i] === "[") header();
      else keyValue();
    } catch (e) {
      if (!e || e.code === undefined) throw e;
      const at = Math.min(e.at, n), ln = lineOf(at), end = (starts[ln + 1] ?? n + 1) - 1;
      const len = Math.max(Math.min(e.len, end - at), 0);
      diags.push({ line: ln + 1, col: at - starts[ln] + 1, length: len, severity: "error", code: e.code, args: e.args, msg: "", help: "" });
      // 그 줄 끝(여러 줄 값이면 시작 줄 다음)부터 계속
      i = Math.max(i, at);
      while (i < n && cs[i] !== "\n") i++;
    }
    if (i === stmt) i++;                                // 멈춤 방지
  }
  return diags;
}

/// 진단의 설명 글: 화면 언어 표(UI)에서 가져온다 (영어는 d.msg·d.help, 화면 언어가 영어가 아니면 d.show)
function tomlText(d, L) {
  const a = d.args || [];
  const key = "toml" + d.code + (d.code === "T004" ? a[0] : d.code === "T005" ? (a[0] === "" ? "empty" : /^[A-Za-z_][\w.-]*$/.test(a[0]) ? "word" : "") : "");
  const f = k => String((UI[L] || UI.en)[k] ?? UI.en[k]).replace(/\{(\d)\}/g, (_, i) => a[+i] ?? "");
  return { msg: f(key), help: f(key + "h") };
}
const isTomlFile = path => /\.toml$/i.test(path) || /(^|\/)cargo\.lock$/i.test(path);   // ini·cfg는 TOML이 아니라서 검사 안 함

