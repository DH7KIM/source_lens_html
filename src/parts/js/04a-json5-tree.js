// ---------- JSON5 트리 읽기 (계층 보기용, 줄 위치를 기록) ----------
// JSON5 문법을 읽되, 값 대신 노드 트리를 만든다. 읽기만 하고 고치지는 않는다.
// 노드: { type, key, line, kids | text }
//   type: object | array | string | number | boolean | null
//   key : 객체 멤버는 이름(문자열), 배열 원소는 번호(숫자), 뿌리는 null
//   id  : 노드 번호 (읽은 순서, 0부터)
//   line: 소스의 줄 번호 (객체 멤버는 키가 있는 줄)
//   col : 그 줄에서 시작 칸 (0부터, UTF-16 단위). 객체 멤버는 키 시작
//   ec  : 그 줄에서 끝 칸 (포함 안 함). 항목이 여러 줄에 걸치면 -1 (그 줄 끝까지)
//   kids: object·array의 자식 노드 목록 (같은 키가 둘이어도 그대로 둠)
//   text: 값의 모양 글 (문자열은 따옴표를 붙인 글, 그 밖에는 소스에 적힌 그대로)
// 뿌리 노드에는 count(전체 노드 수)가 있다. 주석은 건너뛴다.
// 틀리면 Error: e.message(영어), e.line(줄 번호), e.code(J001…), e.pos(소스 안 위치, UTF-16), e.len(길이, UTF-16), e.args
// 컨테이너 안에서 틀리면 e.node = 오류 직전까지 읽은 부분 트리(뿌리, count 포함). 오류가 난 가장 안쪽 컨테이너에는 err = e (값 뒤 글자 J010은 뿌리에 err + errAfter)
// opt(JSON Lines의 한 줄을 읽을 때): line0 = 그 줄 앞의 줄 수(줄 번호에 더함), id0 = 노드 번호를 시작할 값, strict = 엄격한 JSON(J013~J019)
function json5Tree(src, opt) {
  const line0 = (opt && opt.line0) || 0;
  const jsonc = !!(opt && opt.jsonc);   // JSONC: strict와 같이 켜면 주석만 허용하고 나머지는 엄격한 JSON (끝 쉼표는 J020)
  const strict = !!(opt && opt.strict);   // 엄격한 JSON: JSON5 전용 문법(주석·끝 쉼표·작은따옴표·따옴표 없는 키·JSON5 숫자·JSON5 이스케이프)을 오류로 알림
  const starts = [0];
  for (let k = 0; k < src.length; k++) if (src[k] === "\n") starts.push(k + 1);
  const lineAt = p => {   // 위치 → 줄 번호 (이진 탐색)
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (starts[m] <= p) lo = m; else hi = m - 1; }
    return lo + 1 + line0;
  };
  let i = 0, count = (opt && opt.id0) || 0;
  const fail = (code, msg, pos, len, ...args) => { const e = new Error(msg); e.line = lineAt(pos); e.code = code; e.pos = pos; e.len = len; e.args = args; throw e; };
  const fin = (n, a, b) => {   // 시작 a·끝 b(포함 안 함) 위치 → 줄, 칸, 끝 칸
    n.line = lineAt(a); n.col = a - starts[n.line - 1 - line0];
    n.ec = lineAt(Math.max(a, b - 1)) === n.line ? b - starts[n.line - 1 - line0] : -1;
    n.end = b;
    return n;
  };
  // 컨테이너가 오류를 만나면: 읽은 항목까지로 자기를 닫고 e.node에 붙여 위로 넘김 (child = 안쪽 컨테이너가 넘긴 부분 노드, ks = 그 항목의 키 시작)
  const partial = (e, node, at, child, ks) => {
    if (e && e.code !== undefined) {
      if (child) { if (ks >= 0) fin(child, ks, e.pos); node.kids.push(child); }
      else node.err = e;
      fin(node, at, e.pos);
      e.node = node;
    }
    return e;
  };
  const ws = () => {
    for (;;) {
      const c = src[i];
      if (c !== undefined && /\s/.test(c)) i++;
      else if (c === "/" && src[i + 1] === "/") { if (strict && !jsonc) fail("J013", "comments are not allowed in JSON", i, 2); while (i < src.length && src[i] !== "\n") i++; }
      else if (c === "/" && src[i + 1] === "*") { if (strict && !jsonc) fail("J013", "comments are not allowed in JSON", i, 2); const e = src.indexOf("*/", i + 2); if (e < 0) fail("J001", "unclosed comment", i, 2); i = e + 2; }
      else return;
    }
  };
  const hex = n => {
    const h = src.slice(i, i + n);
    if (h.length < n || !/^[\da-fA-F]+$/.test(h)) fail("J002", "invalid hex escape", i - 2, 2 + h.length);
    i += n; return String.fromCharCode(parseInt(h, 16));
  };
  const str = () => {
    const s0 = i, q = src[i++]; let out = "";
    if (strict && q === "'") fail("J015", "single-quoted strings are not allowed in JSON", s0, 1);
    for (;;) {
      if (i >= src.length) fail("J003", "unclosed string", s0, 1);
      const c = src[i++];
      if (c === q) return out;
      if (c === "\n") { i--; fail("J003", "unclosed string", s0, 1); }
      if (strict && c < " " && c !== "\r") fail("J019", "control character in a string", i - 1, 1);
      if (c !== "\\") { out += c; continue; }
      const e = src[i++];
      if (strict && e !== undefined && !'"\\/bfnrtu'.includes(e)) fail("J018", "escape not allowed in JSON", i - 2, 2, "\\" + e);
      if (e === "n") out += "\n"; else if (e === "t") out += "\t"; else if (e === "r") out += "\r";
      else if (e === "b") out += "\b"; else if (e === "f") out += "\f"; else if (e === "v") out += "\v";
      else if (e === "0" && !/\d/.test(src[i] || "")) out += "\0";
      else if (e === "x") out += hex(2);
      else if (e === "u") out += hex(4);
      else if (e === "\r") { if (src[i] === "\n") i++; }
      else if (e === "\n" || e === "\u2028" || e === "\u2029") { /* 줄 잇기 */ }
      else if (e === undefined) fail("J003", "unclosed string", s0, 1);
      else out += e;
    }
  };
  const key = () => {
    const c = src[i];
    if (c === '"' || c === "'") return str();
    const m = /[A-Za-z_$][\w$]*/y; m.lastIndex = i;
    const r = m.exec(src);
    if (!r) fail("J004", "expected a key", i, 1);
    if (strict) fail("J016", "unquoted keys are not allowed in JSON", i, r[0].length);
    i += r[0].length; return r[0];
  };
  const num = /[+-]?(?:Infinity|NaN|0[xX][\da-fA-F]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)(?![\w$])/y;
  const numStrict = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?![\w$.])/y;   // 엄격한 JSON 숫자
  const value = (k, depth) => {
    ws();
    if (depth > 200) fail("J011", "nested too deeply", i, 1);
    const at = i, c = src[i];
    const id = count++;
    if (c === "{") {
      i++; const kids = []; let ks = -1, comma = -1;
      try {
        for (;;) {
          ws();
          if (src[i] === "}") { if (strict && comma >= 0) fail(jsonc ? "J020" : "J014", jsonc ? "trailing comma is not allowed in JSONC" : "trailing comma is not allowed in JSON", comma, 1); i++; break; }
          comma = -1; ks = i; const name = key(); ws();
          if (src[i] !== ":") fail("J005", "':' expected", i, 1);
          i++;
          const n = fin(value(name, depth + 1), ks, i); kids.push(n); ks = -1; ws();
          if (src[i] === ",") { comma = i; i++; }
          else if (src[i] !== "}") fail("J006", "',' or '}' expected", i, 1);
        }
      } catch (e) { throw partial(e, { type: "object", key: k, id, kids }, at, e && e.node, ks); }
      return fin({ type: "object", key: k, id, kids }, at, i);
    }
    if (c === "[") {
      i++; const kids = []; let comma = -1;
      try {
        for (;;) {
          ws();
          if (src[i] === "]") { if (strict && comma >= 0) fail(jsonc ? "J020" : "J014", jsonc ? "trailing comma is not allowed in JSONC" : "trailing comma is not allowed in JSON", comma, 1); i++; break; }
          comma = -1;
          kids.push(value(kids.length, depth + 1)); ws();
          if (src[i] === ",") { comma = i; i++; }
          else if (src[i] !== "]") fail("J007", "',' or ']' expected", i, 1);
        }
      } catch (e) { throw partial(e, { type: "array", key: k, id, kids }, at, e && e.node, -1); }
      return fin({ type: "array", key: k, id, kids }, at, i);
    }
    if (c === '"' || c === "'") return fin({ type: "string", key: k, id, text: JSON.stringify(str()) }, at, i);
    for (const [w, ty] of [["true", "boolean"], ["false", "boolean"], ["null", "null"]])
      if (src.startsWith(w, i) && !/[\w$]/.test(src[i + w.length] || "")) { i += w.length; return fin({ type: ty, key: k, id, text: w }, at, i); }
    num.lastIndex = i;
    const m = num.exec(src);
    if (!m) { if (c === undefined) fail("J008", "expected a value", i, 1); const cp = String.fromCodePoint(src.codePointAt(i)); fail("J009", "unexpected '" + cp + "'", i, cp.length, cp); }
    if (strict) { numStrict.lastIndex = i; const s = numStrict.exec(src); if (!s || s[0] !== m[0]) fail("J017", "number not allowed in JSON", i, m[0].length, m[0]); }
    i += m[0].length;
    return fin({ type: "number", key: k, id, text: m[0] }, at, i);
  };
  let root;
  try { root = value(null, 0); ws(); }
  catch (e) { if (e && e.node) e.node.count = count; throw e; }
  if (i < src.length) {
    try { fail("J010", "unexpected text after the value", i, 1); }
    catch (e) { root.err = e; root.errAfter = true; root.count = count; e.node = root; throw e; }
  }
  root.count = count;
  return root;
}
