// ---------- .ui 전체 검사기 (UI 형식 1, ui-guideline 문서 0.9) ----------
// tile_font_editor_cpp의 src/uilayout.cppm(Parser)를 그대로 옮긴 것. 문서 0.7까지는 ui-check와 글자 하나까지 같은 결과를 낸다.
// 문서 0.8·0.9(새 이름, 옛 이름 경고 W104)는 뷰어가 먼저 따름 — uilayout.cppm·tests/ui는 아직 0.7.
// 바이트 단위로 검사한다: 글자 하나 = 바이트 하나인 "바이트 글"(0~255)로 바꿔서 C++와 같은 위치·길이를 쓰고,
// 메시지를 만들 때만 UTF-8로 되돌린다. 메시지는 영어 원문 (ui-check와 같음).
const UI_DOC_VERSION = "0.9";
const uiCheck = (() => {
  const MAX_FILE = 1 << 20, MAX_LINE = 4096, MAX_STRING = 1024, MAX_DEPTH = 16, MAX_NODES = 4096, MAX_STORED = 1000;
  const INT_MIN = -2147483648, INT_MAX = 2147483647, POS_MIN = -32768, POS_MAX = 32767;
  const KIND_NAMES = ["", "label", "button", "text_field", "number_field", "menu_button", "checkbox", "canvas", "spacer",
    "group", "row", "column", "menu", "menu_item", "separator", "?"];
  const [ROOT, LABEL, BUTTON, EDIT, NUMBER, DROPDOWN, CHECK, CANVAS, SPACER, GROUP, ROW, COLUMN, MENU, ITEM, SEPARATOR, UNKNOWN] =
    KIND_NAMES.map((_, i) => i);
  const KIND_WORDS = ["label", "button", "text_field", "number_field", "menu_button", "checkbox", "canvas", "spacer",
    "group", "row", "column", "menu", "menu_item", "separator", "defaults"];
  // 옛 이름 (문서 0.8·0.9에서 바뀜, 레거시): 계속 읽고 경고 W104 + 자동 수정. 추천 후보에는 넣지 않음
  const OLD_KINDS = { check: "checkbox", item: "menu_item", edit: "text_field", number: "number_field", dropdown: "menu_button" };
  const OLD_ATTRS = { tip: "tooltip", disabled_tip: "disabled_tooltip", hint: "placeholder", gap: "spacing", check: "checkable" };
  const RESERVED_WORDS = ["include", "style", "true", "false", "if", "else", "use", "ref", ...Object.keys(OLD_KINDS)];
  const RESERVED_CHARS = ".$@%:;[](),+*/\\!?&|<>~^'#";
  const bit = k => 1 << k;
  const SCREEN = bit(LABEL) | bit(BUTTON) | bit(EDIT) | bit(NUMBER) | bit(DROPDOWN) | bit(CHECK) | bit(CANVAS) | bit(GROUP) | bit(ROW) | bit(COLUMN);
  const DEFAULT_KINDS = SCREEN | bit(ITEM);
  const TIP_KINDS = bit(LABEL) | bit(BUTTON) | bit(EDIT) | bit(NUMBER) | bit(DROPDOWN) | bit(CHECK) | bit(CANVAS);
  const INPUT_KINDS = bit(BUTTON) | bit(EDIT) | bit(NUMBER) | bit(DROPDOWN) | bit(CHECK);
  // 값 형식: Pos(-32768~32767), Size(Pos 또는 auto), Int(32비트), PosInt(1 이상), Str, Enum, Ref, Flag, Word
  const SPECS = [
    ["left", "Pos", SCREEN], ["top", "Pos", SCREEN], ["right", "Pos", SCREEN], ["bottom", "Pos", SCREEN],
    ["width", "Size", SCREEN], ["height", "Size", SCREEN], ["right_of", "Ref", SCREEN], ["below", "Ref", SCREEN],
    ["spacing", "Pos", SCREEN], ["hidden", "Flag", SCREEN], ["disabled", "Flag", SCREEN],
    ["text", "Str", bit(LABEL) | bit(BUTTON) | bit(EDIT) | bit(DROPDOWN) | bit(CHECK) | bit(MENU) | bit(ITEM)],
    ["align", "Enum", bit(LABEL) | bit(ROW) | bit(COLUMN)], ["placeholder", "Str", bit(EDIT)], ["max_length", "PosInt", bit(EDIT)],
    ["min", "Int", bit(NUMBER)], ["max", "Int", bit(NUMBER)], ["step", "PosInt", bit(NUMBER)], ["hex", "Flag", bit(NUMBER)],
    ["menu", "Ref", bit(DROPDOWN)], ["checked", "Flag", bit(CHECK) | bit(ITEM)],
    ["padding", "Pos", bit(GROUP) | bit(ROW) | bit(COLUMN)], ["checkable", "Flag", bit(ITEM)], ["radio", "Flag", bit(ITEM)],
    ["tooltip", "Str", TIP_KINDS], ["disabled_tooltip", "Str", TIP_KINDS], ["section", "Word", 0],
  ].map(([key, type, kinds]) => ({ key, type, kinds }));
  const NO_DEFAULT_KEYS = ["left", "top", "right", "bottom", "right_of", "below", "text", "placeholder", "tooltip", "disabled_tooltip", "menu"];
  const POSITION_KEYS = ["left", "top", "right", "bottom", "right_of", "below"];
  /// 속성 찾기: 옛 이름도 새 이름의 속성으로 (메시지에는 파일에 쓴 이름을 그대로 씀)
  const findSpec = key => SPECS.find(s => s.key === (OLD_ATTRS[key] ?? key)) || null;
  const kindFrom = w => { const i = KIND_NAMES.indexOf(OLD_KINDS[w] ?? w); return i >= 1 && i < UNKNOWN ? i : null; };
  const isContainer = k => k === GROUP || k === ROW || k === COLUMN || k === MENU;
  const isScreen = k => (SCREEN & bit(k)) !== 0;
  const autoOk = (k, axis) => [LABEL, BUTTON, DROPDOWN, CHECK, ROW, COLUMN].includes(k) || ((k === EDIT || k === NUMBER) && axis === 1);
  const attrsOf = k => SPECS.filter(s => s.kinds & bit(k)).map(s => s.key).join(", ");

  function initNode(k) {
    const n = { kind: k, name: "", line: 0, col: 0, kindLen: 0, nameCol: 0, nameLen: 0, parent: -1, children: [],
      left: null, top: null, right: null, bottom: null, w: { mode: "none", value: 0 }, h: { mode: "none", value: 0 },
      wLine: false, hLine: false, rightOf: -1, below: -1, hasRightOf: false, hasBelow: false, spacing: 6, padding: 0,
      hidden: false, disabled: false, text: "", placeholder: "", tooltip: null, disabledTooltip: null, maxLength: 256,
      minValue: 0, maxValue: INT_MAX, step: 1, hex: false, menu: -1, checkable: false, radio: false, checked: false,
      checkedCol: 0, checkedLen: 0, align: "left", bad: false };
    const fixed = v => ({ mode: "fixed", value: v }), a = () => ({ mode: "auto", value: 0 });
    switch (k) {
      case LABEL: n.w = a(); n.h = a(); break;
      case BUTTON: n.w = a(); n.h = fixed(28); break;
      case EDIT: n.w = fixed(100); n.h = fixed(28); break;
      case NUMBER: n.w = fixed(80); n.h = fixed(28); break;
      case DROPDOWN: n.w = a(); n.h = fixed(28); break;
      case CHECK: n.w = a(); n.h = fixed(24); break;
      case ROW: n.w = a(); n.h = a(); n.align = "center"; break;
      case COLUMN: n.w = a(); n.h = a(); n.align = "fill"; break;
    }
    return n;
  }

  /// 편집 거리 (Damerau–Levenshtein, 이웃 맞바꾸기만). 바이트 단위, 64바이트가 넘으면 99
  function distance(a, b) {
    if (a.length > 64 || b.length > 64) return 99;
    const w = b.length + 1, d = new Array((a.length + 1) * w);
    for (let i = 0; i <= a.length; i++) d[i * w] = i;
    for (let j = 0; j <= b.length; j++) d[j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      let v = Math.min(d[(i - 1) * w + j] + 1, d[i * w + j - 1] + 1, d[(i - 1) * w + j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[(i - 2) * w + j - 2] + 1);
      d[i * w + j] = v;
    }
    return d[a.length * w + b.length];
  }
  /// 추천: 거리 2 이하, 단어 길이보다 작고, 가장 가까운 후보가 하나뿐일 때만
  function suggest(word, cands) {
    let best = 2, count = 0, r = "";
    for (const c of cands) {
      const x = distance(word, c);
      if (x >= word.length || x > best) continue;
      if (x < best) { best = x; count = 0; }
      if (count === 0 || c !== r) { r = c; count++; }
    }
    return count === 1 ? r : null;
  }

  const isWs = c => c === " " || c === "\t";
  const isDigit = c => c >= "0" && c <= "9";
  const isLower = c => (c >= "a" && c <= "z") || c === "_";
  const isHex = c => isDigit(c) || (c >= "a" && c <= "f") || (c >= "A" && c <= "F");
  const cpLen = c => { const b = c.charCodeAt(0); return b < 0x80 ? 1 : b < 0xE0 ? 2 : b < 0xF0 ? 3 : 4; };
  const cpAt = (s, i) => i >= s.length ? "" : s.substr(i, Math.min(cpLen(s[i]), s.length - i));
  const lower = s => s.replace(/[A-Z]/g, c => c.toLowerCase());
  /// 틀린 UTF-8의 첫 바이트 위치 (없으면 -1)
  function badUtf8(s) {
    let i = 0;
    while (i < s.length) {
      const c = s.charCodeAt(i);
      if (c < 0x80) { i++; continue; }
      let n, v, lo;
      if (c >= 0xC2 && c <= 0xDF) { n = 1; v = c & 0x1F; lo = 0x80; }
      else if (c >= 0xE0 && c <= 0xEF) { n = 2; v = c & 0x0F; lo = 0x800; }
      else if (c >= 0xF0 && c <= 0xF4) { n = 3; v = c & 0x07; lo = 0x10000; }
      else return i;
      for (let k = 1; k <= n; k++) {
        if (i + k >= s.length) return i;
        const d = s.charCodeAt(i + k);
        if ((d & 0xC0) !== 0x80) return i;
        v = (v << 6) | (d & 0x3F);
      }
      if (v < lo || v > 0x10FFFF || (v >= 0xD800 && v <= 0xDFFF)) return i;
      i += n + 1;
    }
    return -1;
  }
  const startsAt = (s, i, p) => s.startsWith(p, i);
  const tok = (type, col, len, key = "") => ({ type, col, len, key, klen: len, vk: "none", num: 0, str: "", vcol: 0, vlen: 0 });
  const NODE_FILE = -2;

  function parse(bytes) {
    const nodes = [], diags = [];
    let errorCount = 0, warningCount = 0;
    const root = initNode(ROOT); root.spacing = 0; nodes.push(root);
    const stack = [], refs = [], names = new Map(), defaults = new Map(), defaultLines = new Map();
    let colmap = [1], seenElement = false, tooMany = false, lineFirst = 0, lineErrors = 0;
    const dummy = {};

    function diag(code, line, col, len, message, args = [], help = "", helpArgs = []) {
      const warn = code[0] === "W";
      if (warn) warningCount++; else errorCount++;
      if (diags.length >= MAX_STORED) return dummy;
      const d = { severity: warn ? "warning" : "error", line, col, length: Math.max(len, 0), code, message, help, args, helpArgs,
        fix: "none", replacement: "", removeSpace: false, node: -1 };
      diags.push(d);
      return d;
    }
    const fix = (d, f, r) => { d.fix = f; d.replacement = r; };
    const remove = (d, f = "confirm") => { d.fix = f; d.replacement = ""; d.removeSpace = true; };
    const col = b => colmap[Math.min(b, colmap.length - 1)];
    const cps = (a, b) => col(b) - col(a);
    function makeColmap(s) {
      colmap = new Array(s.length + 1).fill(1);
      let c = 0;
      for (let i = 0; i < s.length; i++) {
        if ((s.charCodeAt(i) & 0xC0) !== 0x80) c++;
        colmap[i] = Math.max(c, 1);
      }
      colmap[s.length] = c + 1;
    }
    function markLine(c, idx) {
      for (let k = lineFirst; k < diags.length; k++) if (diags[k].col === c && diags[k].severity === "error") diags[k].node = idx;
    }

    function oneLine(s, ln) {
      lineFirst = diags.length;
      lineErrors = errorCount;
      if (s.length > MAX_LINE) { colmap = [1]; diag("E014", ln, 1, 0, "line is longer than {} bytes", [String(MAX_LINE)], "split it into several lines"); return; }
      const b = badUtf8(s);
      if (b >= 0) { colmap = [1]; makeColmap(s.slice(0, b)); diag("E004", ln, col(b), 1, "invalid UTF-8", [], "save the file as UTF-8"); return; }
      makeColmap(s);
      if (ln === 1) {
        if (s.startsWith("#ui")) { header(s, ln); return; }
        let e = 0;
        while (e < s.length && !isWs(s[e])) e++;
        diag("E001", 1, 1, cps(0, e), "the first line must be '#ui 1'", [], "add '#ui 1' as the first line").node = NODE_FILE;
      }
      const st = { bad: false };
      const toks = lex(s, 0, ln, st);
      if (toks.length) lineTokens(toks, ln, st.bad);
    }

    function header(s, ln) {
      let i = 3;
      const endTok = k => k >= s.length || isWs(s[k]) || startsAt(s, k, "//");
      if (!endTok(i)) {
        while (!endTok(i)) i++;
        diag("E001", ln, 1, cps(0, i), "the first line must be '#ui 1'", [], "write '#ui', a space and the format version").node = NODE_FILE;
        return;
      }
      while (i < s.length && isWs(s[i])) i++;
      const vs = i;
      while (!endTok(i)) i++;
      const ver = s.slice(vs, i);
      if (!ver) diag("E001", ln, col(vs), 0, "missing format version after '#ui'", [], "write '#ui 1'").node = NODE_FILE;
      else if (ver !== "1") diag("E001", ln, col(vs), cps(vs, i), "unsupported format version '{}'", [ver], "this program reads format 1 (UI {})", [UI_DOC_VERSION]).node = NODE_FILE;
      const toks = lex(s, i, ln, { bad: false });
      const seen = new Map();
      for (const t of toks) {
        if (t.type === "bad") continue;
        if (t.type === "open" || t.type === "close") { diag("E009", ln, t.col, 1, "'{' and '}' cannot be used on the '#ui' line", [], "remove it"); continue; }
        if (t.key !== "section") {
          if (findSpec(t.key)) remove(diag("E010", ln, t.col, t.len, "'{}' cannot be used on the '#ui' line", [t.key], "the '#ui' line takes: section"));
          else unknownAttr(t, ln, ["section"]);
          continue;
        }
        if (seen.has(t.key)) { remove(diag("E006", ln, t.col, t.len, "'{}' is set twice", [t.key], "first set at column {}", [String(seen.get(t.key))])); continue; }
        seen.set(t.key, t.col);
        if (t.type === "word") diag("E004", ln, t.col, t.klen, "'{}' needs a value", [t.key], "write {}=<name>", [t.key]);
        else if (t.vk !== "word") diag("E004", ln, t.vcol, t.vlen, "'{}' expects a name", [t.key], "write {}=<name>", [t.key]);
      }
    }

    function unknownAttr(t, ln, cands) {
      const s = suggest(t.key, cands);
      if (s) fix(diag("E003", ln, t.col, t.klen, "unknown attribute '{}'", [t.key], "did you mean '{}'?", [s]), "auto", s);
      else diag("E003", ln, t.col, t.klen, "unknown attribute '{}'", [t.key], "this program supports UI {}; '{}' may need a newer version", [UI_DOC_VERSION, t.key]);
    }
    function unknownKind(t, ln) {
      const s = suggest(t.key, KIND_WORDS);
      if (s) fix(diag("E002", ln, t.col, t.klen, "unknown element kind '{}'", [t.key], "did you mean '{}'?", [s]), "auto", s);
      else diag("E002", ln, t.col, t.klen, "unknown element kind '{}'", [t.key], "this program supports UI {}; '{}' may need a newer version", [UI_DOC_VERSION, t.key]);
    }

    /// 옛 이름 경고 (W104, 자동 수정: 새 이름으로)
    function oldName(t, ln, table) {
      const nw = table[t.key];
      if (nw) fix(diag("W104", ln, t.col, t.klen, "'{}' is an old name", [t.key], "use '{}' instead", [nw]), "auto", nw);
    }

    function wordOk(w, off, ln) {
      const wl = cps(off, off + w.length);
      for (let k = 0; k < w.length; k++) {
        const c = w[k];
        if (isLower(c)) continue;
        if (isDigit(c)) {
          if (k === 0) { diag("E013", ln, col(off), wl, "'{}' starts with a digit", [w], "names start with a-z or _"); return false; }
          continue;
        }
        if (c >= "A" && c <= "Z") {
          if ([...w].every(x => isLower(x) || isDigit(x) || (x >= "A" && x <= "Z"))) {
            fix(diag("E013", ln, col(off), wl, "uppercase letter in '{}'", [w], "use lowercase: '{}'", [lower(w)]), "auto", lower(w));
            return false;
          }
          continue;
        }
        const ch = cpAt(w, k), cl = cps(off + k, off + k + ch.length);
        if (RESERVED_CHARS.includes(c)) diag("E013", ln, col(off + k), cl, "reserved character '{}'", [ch], "names use only a-z, 0-9 and _");
        else diag("E013", ln, col(off + k), cl, "character '{}' cannot be used here", [ch], "names use only a-z, 0-9 and _");
        return false;
      }
      return true;
    }

    /// 문자열 읽기: s[p.i] === '"'. 끝나면 p.i는 닫는 따옴표 다음
    function readString(s, p, ln, t) {
      const q = p.i++;
      let ok = true, tooLong = false, longDiag = -1, out = "";
      const done = end => { if (longDiag >= 0) diags[longDiag].length = cps(q, end); };
      for (;;) {
        if (p.i >= s.length) {
          diag("E004", ln, col(q), cps(q, s.length), "unclosed string", [], "close it with '\"' on the same line");
          done(s.length); t.str = out; return false;
        }
        const c = s[p.i];
        if (c === '"') { p.i++; done(p.i); t.str = out; return ok; }
        if (c === "\\" && p.i + 1 < s.length) {
          const e = s[p.i + 1], el = cpLen(e);
          if (e === '"' || e === "\\") out += e;
          else if (e === "n") out += "\n";
          else {
            diag("E004", ln, col(p.i), cps(p.i, Math.min(p.i + 1 + el, s.length)), "unknown escape '\\{}'", [cpAt(s, p.i + 1)], "only \\\", \\\\ and \\n can be used");
            ok = false;
          }
          p.i += 1 + el;
        } else { out += c; p.i++; }
        if (out.length > MAX_STRING && !tooLong) {
          tooLong = true;
          const before = diags.length;
          diag("E014", ln, col(q), 1, "string is longer than {} bytes", [String(MAX_STRING)], "shorten it");
          if (diags.length > before) longDiag = before;
          ok = false;
        }
      }
    }

    function skipToken(s, p) {
      while (p.i < s.length && !isWs(s[p.i]) && !startsAt(s, p.i, "//")) {
        if (s[p.i] === '"') {
          p.i++;
          while (p.i < s.length && s[p.i] !== '"') p.i += s[p.i] === "\\" ? 2 : 1;
        }
        p.i++;
      }
      p.i = Math.min(p.i, s.length);
    }

    function value(v, off, ln, t) {
      const vl = cps(off, off + v.length);
      if (v[0] === "-" || isDigit(v[0])) {
        let val = 0, good = true, big = false, zero = false;
        const neg = v[0] === "-", hex = v.startsWith("0x");
        if (hex) {
          const d = v.slice(2);
          good = d.length > 0 && [...d].every(isHex);
          for (const c of d) {
            if (!good || big) break;
            val = val * 16 + (isDigit(c) ? c.charCodeAt(0) - 48 : (c.charCodeAt(0) | 0x20) - 97 + 10);
            big = val > INT_MAX;
          }
        } else {
          const d = v.slice(neg ? 1 : 0);
          good = d.length > 0 && [...d].every(isDigit);
          zero = good && d.length > 1 && d[0] === "0";
          for (const c of d) {
            if (!good || big) break;
            val = val * 10 + (c.charCodeAt(0) - 48);
            big = val > INT_MAX + 1;
          }
          if (neg) val = -val;
          big = big || val > INT_MAX || val < INT_MIN;
        }
        if (!good) { diag("E004", ln, col(off), vl, "invalid number '{}'", [v], "write a decimal integer like 90 or -4, or hex like 0x1F"); return false; }
        if (zero) {
          let d = v.slice(neg ? 1 : 0);
          while (d.length > 1 && d[0] === "0") d = d.slice(1);
          const r = (neg ? "-" : "") + d;
          fix(diag("E004", ln, col(off), vl, "number '{}' starts with 0", [v], "write it without the leading zeros: {}", [r]), "confirm", r);
          return false;
        }
        if (big) {
          const dg = diag("E004", ln, col(off), vl, "number '{}' is out of range", [v], "integers are -2147483648 to 2147483647 (hex up to 0x7FFFFFFF)");
          const sp = findSpec(t.key);
          if (sp) {
            if (sp.type === "Pos" || sp.type === "Size") fix(dg, "confirm", String(neg ? POS_MIN : POS_MAX));
            else if (sp.type === "PosInt" || sp.type === "Int")
              fix(dg, "confirm", neg ? (sp.type === "PosInt" ? "1" : String(INT_MIN)) : hex ? "0x7FFFFFFF" : String(INT_MAX));
          }
          return false;
        }
        t.vk = "int"; t.num = val;
        return true;
      }
      if (!wordOk(v, off, ln)) return false;
      t.vk = "word"; t.str = v;
      return true;
    }

    function lex(s, i, ln, st) {
      const out = [];
      const atEnd = k => k >= s.length || isWs(s[k]) || startsAt(s, k, "//");
      const skipWs = k => { while (k < s.length && isWs(s[k])) k++; return k; };
      const p = { i };
      for (;;) {
        p.i = skipWs(p.i);
        if (p.i >= s.length || startsAt(s, p.i, "//")) break;
        const s0 = p.i, c = s[p.i];
        if (c === "{" || c === "}") { out.push(tok(c === "{" ? "open" : "close", col(p.i), 1)); p.i++; continue; }
        if (c === '"' || c === "=") {
          skipToken(s, p);
          if (c === '"') diag("E004", ln, col(s0), cps(s0, p.i), "a string needs an attribute name before it", [], "write it as text=\"...\"");
          else diag("E004", ln, col(s0), cps(s0, p.i), "'=' needs an attribute name right before it", [], "write key=value with no spaces around '='");
          out.push(tok("bad", col(s0), cps(s0, p.i)));
          st.bad = true;
          continue;
        }
        while (p.i < s.length && !isWs(s[p.i]) && !"={}\"".includes(s[p.i]) && !startsAt(s, p.i, "//")) p.i++;
        const wend = p.i, word = s.slice(s0, wend);
        let ok = wordOk(word, s0, ln);
        const t = tok("word", col(s0), cps(s0, wend), word);
        // '=' 찾기: 바로 뒤, 또는 공백 뒤 ("left = 50": 공백 오류, 고칠 수 있음)
        let eq = -1, vstart = 0, spaced = false;
        if (p.i < s.length && s[p.i] === "=") eq = p.i;
        else { const j = skipWs(p.i); if (j > p.i && j < s.length && s[j] === "=") eq = j; }
        if (eq >= 0) {
          const k = skipWs(eq + 1);
          const hasValue = !(k >= s.length || startsAt(s, k, "//") || s[k] === "{" || s[k] === "}" || s[k] === "=");
          if (eq !== p.i || k !== eq + 1) {
            if (hasValue) { spaced = true; vstart = k; }
            else if (eq !== p.i) eq = -1;   // "w =" 뒤에 값이 없음: '='는 따로 오류
          }
        }
        if (eq >= 0) {
          t.type = "attr";
          p.i = spaced ? vstart : eq + 1;
          if (atEnd(p.i) || s[p.i] === "{" || s[p.i] === "}") {
            diag("E004", ln, col(s0), cps(s0, p.i), "'{}' needs a value after '='", [t.key], "write key=value with no spaces around '='");
            ok = false;
          } else if (s[p.i] === '"') {
            const vs = p.i;
            t.vcol = col(p.i); t.vk = "str";
            ok = readString(s, p, ln, t) && ok;
            t.vlen = cps(vs, p.i);
          } else {
            const vs = p.i;
            while (!atEnd(p.i) && s[p.i] !== "{" && s[p.i] !== "}" && s[p.i] !== '"') p.i++;
            t.vcol = col(vs); t.vlen = cps(vs, p.i);
            ok = value(s.slice(vs, p.i), vs, ln, t) && ok;
          }
          if (spaced) {
            fix(diag("E004", ln, col(s0), cps(s0, p.i), "spaces around '=' after '{}'", [t.key], "write key=value with no spaces around '='"),
              "auto", word + "=" + s.slice(vstart, p.i));
            ok = false;
          }
          if (!atEnd(p.i) && s[p.i] !== "{" && s[p.i] !== "}") {
            const x = p.i;
            skipToken(s, p);
            diag("E004", ln, col(x), cps(x, p.i), "expected a space after the value of '{}'", [t.key], "put a space between attributes");
            ok = false;
          }
        } else if (p.i < s.length && s[p.i] === '"') {
          const x = p.i;
          skipToken(s, p);
          diag("E004", ln, col(x), cps(x, p.i), "missing '=' between '{}' and the string", [t.key], "write {}=\"...\"", [t.key]);
          ok = false;
        }
        t.len = cps(s0, p.i);
        if (!ok) { t.type = "bad"; st.bad = true; }
        out.push(t);
      }
      return out;
    }

    function pushBlock(node, ln, openCol, kcol, klen) {
      if (stack.length === MAX_DEPTH)
        diag("E014", ln, openCol, 1, "blocks are nested too deeply (max {})", [String(MAX_DEPTH)], "use fewer nested groups").node = node;
      stack.push({ node, line: ln, kcol, klen });
    }

    function lineTokens(toks, ln, bad) {
      if (toks[0].type === "close") {
        if (toks.length > 1) {
          const b = toks[toks.length - 1];
          diag("E009", ln, toks[1].col, b.col + b.len - toks[1].col, "'}' must be alone on its line", [], "move the rest to another line");
        }
        if (!stack.length) diag("E009", ln, toks[0].col, 1, "'}' without a matching '{'", [], "remove it, or end an element line with '{'");
        else stack.pop();
        return;
      }
      const opens = toks[toks.length - 1].type === "open", openCol = toks[toks.length - 1].col;
      if (opens) toks.pop();
      for (const t of toks) {
        if (t.type === "open") { diag("E009", ln, t.col, 1, "'{' must be at the end of the line", [], "put the children on the following lines"); bad = true; }
        else if (t.type === "close") { diag("E009", ln, t.col, 1, "'}' must be alone on its line", [], "move it to its own line"); bad = true; }
      }
      toks = toks.filter(t => t.type !== "open" && t.type !== "close");
      if (!toks.length) { diag("E009", ln, openCol, 1, "'{' must follow an element on the same line", [], "put '{' at the end of the element line"); return; }
      const first = toks[0];
      if (first.type === "word" && first.key === "defaults") { defaultsLine(toks, ln, opens, openCol); return; }
      let kind = null;
      if (first.type === "attr") diag("E002", ln, first.col, first.klen, "expected an element kind, got '{}='", [first.key], "start the line with a kind such as button, label or row");
      else if (first.type === "word") { kind = kindFrom(first.key); if (kind === null) unknownKind(first, ln); else oldName(first, ln, OLD_KINDS); }
      element(kind ?? UNKNOWN, toks, ln, bad || kind === null, opens, openCol);
    }

    function defaultsLine(toks, ln, opens, openCol) {
      const c = toks[0].col, cl = toks[0].len;
      if (opens) { diag("E009", ln, openCol, 1, "'defaults' cannot open a block", [], "write defaults on one line"); stack.push({ node: -1, line: ln, kcol: c, klen: cl }); }
      if (stack.length && !(opens && stack.length === 1)) { diag("E012", ln, c, cl, "'defaults' must be at the top level", [], "move it right after the '#ui' line"); return; }
      if (seenElement) { diag("E012", ln, c, cl, "'defaults' must come before all elements", [], "move it right after the '#ui' line"); return; }
      if (toks.length < 2 || toks[1].type !== "word") {
        if (toks.length < 2) diag("E002", ln, c, cl, "'defaults' needs an element kind", [], "for example: defaults button height=28");
        else if (toks[1].type !== "bad") diag("E002", ln, toks[1].col, toks[1].klen, "'defaults' needs an element kind", [], "for example: defaults button height=28");
        return;
      }
      const kt = toks[1], kind = kindFrom(kt.key);
      if (kind === null) { unknownKind(kt, ln); return; }
      oldName(kt, ln, OLD_KINDS);
      if (!(DEFAULT_KINDS & bit(kind))) {
        diag("E012", ln, kt.col, kt.klen, "'{}' cannot have defaults", [kt.key], "defaults work for: label, button, text_field, number_field, menu_button, checkbox, canvas, group, row, column, menu_item");
        return;
      }
      const scratch = initNode(kind);
      for (let k = 2; k < toks.length; k++) {
        const t = toks[k];
        if (t.type === "bad") continue;
        const sp = findSpec(t.key), ck = sp ? sp.key : t.key;   // ck: 새 이름 (옛 이름과 같은 속성)
        if (NO_DEFAULT_KEYS.includes(ck) && sp && (sp.kinds & bit(kind))) { remove(diag("E010", ln, t.col, t.len, "'{}' cannot be a default", [t.key], "set it on each element")); continue; }
        const key = kind + "\u0000" + ck;
        if (defaultLines.has(key)) {
          remove(diag("E006", ln, t.col, t.len, "'{}' already has a default for '{}'", [t.key, kt.key], "first set at line {}", [String(defaultLines.get(key))]));
          continue;
        }
        if (apply(scratch, ROOT, t, ln, true, false)) {
          oldName(t, ln, OLD_ATTRS);
          defaultLines.set(key, ln);
          if (!defaults.has(kind)) defaults.set(kind, []);
          defaults.get(kind).push(t);
        }
      }
    }

    function element(kind, toks, ln, bad, opens, openCol) {
      const parent = stack.length ? stack[stack.length - 1].node : 0;
      const front = toks[0];
      if (parent < 0) { if (opens) pushBlock(-1, ln, openCol, front.col, front.klen); return; }
      if (nodes.length > MAX_NODES) {
        if (!tooMany) { diag("E014", ln, front.col, front.klen, "too many elements (max {})", [String(MAX_NODES)], "split the layout into smaller files"); tooMany = true; }
        if (opens) pushBlock(-1, ln, openCol, front.col, front.klen);
        return;
      }
      const pk = nodes[parent].kind;
      const n = initNode(kind);
      n.line = ln; n.col = front.col; n.kindLen = front.klen; n.parent = parent; n.bad = bad;
      const idx = nodes.length;
      seenElement = true;
      if (kind === UNKNOWN) markLine(n.col, idx);
      const elemDiag = (code, c, len, msg, args, help, hargs = []) => { diag(code, ln, c, len, msg, args, help, hargs).node = idx; n.bad = true; };
      const parentOk = pk === ROOT || isContainer(pk);
      const kn = KIND_NAMES[kind];
      if (kind !== UNKNOWN && parentOk) {
        let err = null;
        if ((kind === ITEM || kind === SEPARATOR) && pk !== MENU) err = ["'{}' must be inside a 'menu'", "move it into a menu block"];
        else if (kind === MENU && pk !== ROOT && pk !== MENU) err = ["'{}' must be at the top level or inside another 'menu'", "move the menu out of this block; a menu_button opens it"];
        else if ((isScreen(kind) || kind === SPACER) && pk === MENU) err = ["'{}' cannot be inside a 'menu'", "a menu holds menu_item, separator and menu"];
        else if (kind === SPACER && pk !== ROW && pk !== COLUMN) err = ["'{}' must be inside a 'row' or 'column'", "use left/right/top/bottom to leave space in a group"];
        if (err) elemDiag("E012", n.col, n.kindLen, err[0], [kn], err[1]);
      }
      // 이름
      let k = 1;
      const named = kind !== SPACER && kind !== SEPARATOR;
      if (kind === UNKNOWN) {
        if (toks.length > 1 && toks[1].type === "word" && !names.has(toks[1].key)) {
          n.name = toks[1].key; n.nameCol = toks[1].col; n.nameLen = toks[1].klen;
          names.set(n.name, idx);
        }
        k = toks.length;
      } else if (named) {
        if (toks.length > 1 && toks[1].type === "bad") {
          k = 2; n.bad = true; n.nameCol = toks[1].col; n.nameLen = toks[1].klen;
          markLine(n.nameCol, idx);
        } else if (toks.length < 2 || toks[1].type !== "word") {
          elemDiag("E015", n.col, n.kindLen, "'{}' needs a name", [kn], "write: {} <name> ...", [kn]);
        } else {
          const nt = toks[1];
          k = 2; n.nameCol = nt.col; n.nameLen = nt.klen;
          if (KIND_WORDS.includes(nt.key) || RESERVED_WORDS.includes(nt.key)) elemDiag("E013", nt.col, nt.klen, "'{}' is a reserved word", [nt.key], "choose another name");
          else if (names.has(nt.key)) elemDiag("E005", nt.col, nt.klen, "the name '{}' is already used", [nt.key], "first defined at line {}", [String(nodes[names.get(nt.key)].line)]);
          else { n.name = nt.key; names.set(n.name, idx); }
        }
      } else if (toks.length > 1 && toks[1].type === "word" && !findSpec(toks[1].key)) {
        elemDiag("E015", toks[1].col, toks[1].klen, "'{}' does not take a name", [kn], "remove '{}'", [toks[1].key]);
        k = 2;
      }
      // 기본값 줄 → 요소 줄
      if (kind !== UNKNOWN && defaults.has(kind)) for (const t of defaults.get(kind)) apply(n, ROOT, t, ln, false, false);
      const seen = new Map();
      let hasMenu = false;
      for (; k < toks.length; k++) {
        const t = toks[k];
        if (t.type === "bad") continue;
        const ck = findSpec(t.key)?.key ?? t.key;   // 옛 이름과 새 이름은 같은 속성
        if (seen.has(ck)) {
          remove(diag("E006", ln, t.col, t.len, "'{}' is set twice", [t.key], "first set at column {}", [String(seen.get(ck))]));
          n.bad = true;
          continue;
        }
        seen.set(ck, t.col);
        if (!apply(n, pk, t, ln, true, true)) { n.bad = true; continue; }
        oldName(t, ln, OLD_ATTRS);
        if (t.key === "checked") { n.checkedCol = t.col; n.checkedLen = t.len; }
        if (t.key === "right_of" || t.key === "below" || t.key === "menu") {
          refs.push({ node: idx, key: t.key, name: t.str, line: ln, col: t.vcol, len: t.vlen });
          n.hasRightOf ||= t.key === "right_of";
          n.hasBelow ||= t.key === "below";
          hasMenu ||= t.key === "menu";
        }
      }
      if (!n.bad) checkElement(n, idx, pk, hasMenu);
      const noTip = kind !== UNKNOWN && (INPUT_KINDS & bit(kind)) && n.tooltip === null;
      const who = n.name || kn;
      nodes[parent].children.push(idx);
      nodes.push(n);
      if (opens) {
        if (kind !== UNKNOWN && !isContainer(kind))
          diag("E009", ln, openCol, 1, "'{}' cannot have children", [kn], "only group, row, column and menu can open a block with '{'").node = idx;
        pushBlock(idx, ln, openCol, front.col, front.klen);
      }
      if (noTip && errorCount === lineErrors)
        diag("W103", ln, n.col, n.kindLen, "'{}' has no tooltip", [who], "add tooltip=\"...\" to say what it does, or tooltip=\"\" if it needs none");
    }

    /// 속성 하나 적용. report = 오류를 알림, fromLine = 요소 줄에 쓴 것 (기본값 줄이 아님)
    function apply(n, pk, t, ln, report, fromLine) {
      const kn = KIND_NAMES[n.kind], sp = findSpec(t.key);
      const err = (code, c, len, msg, args, help, hargs = []) => report ? diag(code, ln, c, len, msg, args, help, hargs) : null;
      if (!sp) {
        if (report) unknownAttr(t, ln, SPECS.filter(s => s.kinds).map(s => s.key));
        return false;
      }
      if (!(sp.kinds & bit(n.kind))) {
        const list = attrsOf(n.kind);
        const d = list ? err("E010", t.col, t.len, "'{}' cannot be used on '{}'", [t.key, kn], "'{}' takes: {}", [kn, list])
                       : err("E010", t.col, t.len, "'{}' cannot be used on '{}'", [t.key, kn], "'{}' takes no attributes", [kn]);
        if (d) remove(d);
        return false;
      }
      const key = sp.key;   // 새 이름 (t.key는 파일에 쓴 이름: 메시지용)
      if ((pk === ROW || pk === COLUMN) && POSITION_KEYS.includes(key)) {
        const d = err("E011", t.col, t.len, "'{}' cannot be used inside a '{}'", [t.key, KIND_NAMES[pk]], "inside a row or column, only width and height set the size");
        if (d) remove(d);
        return false;
      }
      if (sp.type === "Flag") {
        if (t.type === "attr") {
          const d = err("E004", t.col, t.len, "'{}' takes no value", [t.key], "write just '{}'", [t.key]);
          if (d) {
            if (t.vk === "word" && t.str === "true") fix(d, "auto", t.key);
            else if (t.vk === "word" && t.str === "false") remove(d, "auto");
          }
          return false;
        }
      } else if (t.type !== "attr") {
        err("E004", t.col, t.klen, "'{}' needs a value", [t.key], "write {}=<value>", [t.key]);
        return false;
      }
      const expect = (what, example) => { err("E004", t.vcol, t.vlen, "'{}' expects {}", [t.key, what], "for example: {}={}", [t.key, example]); return false; };
      switch (sp.type) {
        case "Pos": case "Size": {
          if (sp.type === "Size" && t.vk === "word" && t.str === "auto") {
            const axis = key === "width" ? 0 : 1;
            if (!autoOk(n.kind, axis)) { err("E004", t.vcol, t.vlen, "'{}' cannot be auto on '{}'", [t.key, kn], "write a number"); return false; }
            if (axis === 0) { n.w = { mode: "auto", value: 0 }; n.wLine = fromLine; } else { n.h = { mode: "auto", value: 0 }; n.hLine = fromLine; }
            return true;
          }
          if (t.vk !== "int") return expect(sp.type === "Size" ? "an integer or auto" : "an integer", sp.type === "Size" ? "90" : "8");
          if (t.num < POS_MIN || t.num > POS_MAX) {
            const d = err("E004", t.vcol, t.vlen, "'{}' must be between {} and {}", [t.key, String(POS_MIN), String(POS_MAX)], "positions and sizes use 16-bit numbers");
            if (d) fix(d, "confirm", String(t.num < POS_MIN ? POS_MIN : POS_MAX));
            return false;
          }
          const iv = t.num;
          if (report) {
            const sizeish = ["width", "height", "spacing", "padding"].includes(key);
            if (sizeish && iv < 0) diag("W101", ln, t.vcol, t.vlen, "'{}' is negative ({})", [t.key, String(iv)], "use 0 or more");
            else if (iv > 10000 || iv < -10000) diag("W101", ln, t.vcol, t.vlen, "'{}' is very large ({})", [t.key, String(iv)], "the usual range is -10000 to 10000");
          }
          if (key === "width") { n.w = { mode: "fixed", value: iv }; n.wLine = fromLine; }
          else if (key === "height") { n.h = { mode: "fixed", value: iv }; n.hLine = fromLine; }
          else n[key] = iv;   // left top right bottom spacing padding
          return true;
        }
        case "Int": case "PosInt": {
          if (t.vk !== "int") return expect("an integer", "1");
          if (sp.type === "PosInt" && t.num < 1) {
            const d = err("E004", t.vcol, t.vlen, "'{}' must be 1 or more", [t.key], "write {}=1 or more", [t.key]);
            if (d) fix(d, "confirm", "1");
            return false;
          }
          ({ max_length: () => n.maxLength = t.num, min: () => n.minValue = t.num, max: () => n.maxValue = t.num, step: () => n.step = t.num })[key]();
          return true;
        }
        case "Str":
          if (t.vk !== "str") return expect("a string", "\"...\"");
          if (key === "placeholder") n.placeholder = t.str;
          else if (key === "tooltip") n.tooltip = t.str;
          else if (key === "disabled_tooltip") n.disabledTooltip = t.str;
          else n.text = t.str;
          return true;
        case "Enum": {
          const list = n.kind === LABEL ? ["left", "center", "right"] : n.kind === ROW ? ["top", "center", "bottom", "fill"] : ["left", "center", "right", "fill"];
          if (t.vk !== "word" || !list.includes(t.str)) {
            err("E004", t.vcol, t.vlen, "'{}' on '{}' must be one of: {}", [t.key, kn, list.join(", ")], "for example: {}={}", [t.key, list[0]]);
            return false;
          }
          n.align = t.str;
          return true;
        }
        case "Ref": case "Word":
          if (t.vk !== "word") return expect("a name", "name");
          return true;
        case "Flag":
          n[key] = true;   // hidden disabled hex checked checkable radio
          return true;
      }
      return false;
    }

    function checkElement(n, idx, pk, hasMenu) {
      const kn = KIND_NAMES[n.kind], who = n.name || kn;
      const elem = (code, msg, args, help, hargs = []) => { diag(code, n.line, n.col, n.kindLen, msg, args, help, hargs).node = idx; };
      if (n.kind === ITEM) {
        if (n.checkable && n.radio) elem("E016", "'checkable' and 'radio' cannot be used together", [], "use one of them");
        else if (n.checked && !n.checkable && !n.radio)
          remove(diag("E016", n.line, n.checkedCol, n.checkedLen, "'checked' needs 'checkable' or 'radio'", [], "add checkable or radio to the item, or remove checked"));
      }
      if (n.kind === NUMBER && n.minValue > n.maxValue)
        elem("E004", "min ({}) is greater than max ({})", [String(n.minValue), String(n.maxValue)], "make min less than or equal to max");
      if (n.kind === DROPDOWN && !hasMenu) elem("E008", "'menu_button' needs menu=<menu name>", [], "add menu= with the name of a menu");
      if (!isScreen(n.kind)) return;
      if (pk === ROW || pk === COLUMN) {
        const row = pk === ROW, pa = nodes[n.parent].align;
        const mainOk = (row ? n.w : n.h).mode !== "none";
        const crossOk = (row ? n.h : n.w).mode !== "none" || pa === "fill";
        const mainKey = row ? "width" : "height", crossKey = row ? "height" : "width";
        if (!mainOk) elem("E007", "'{}' needs {} inside a '{}'", [who, mainKey, KIND_NAMES[pk]], "write {}=<number>", [mainKey]);
        if (!crossOk) elem("E007", "'{}' needs {} inside a '{}'", [who, crossKey, KIND_NAMES[pk]], "write {}=<number>, or align=fill on the {}", [crossKey, KIND_NAMES[pk]]);
        return;
      }
      const axis = (a, b, ref, sizeLine, hasSize, horizontal) => {
        const cnt = +a + +b + +ref;
        const r = ref && a ? 2 : cnt >= 2 ? (sizeLine ? 2 : 0) : (hasSize ? 0 : 1);
        if (!r) return;
        const help = horizontal ? "use one of: left+width, right+width, left+right, right_of+width, right_of+right, width only"
                                : "use one of: top+height, bottom+height, top+bottom, below+height, below+bottom, height only";
        elem("E007", r === 1 ? "'{}' needs a {} size or position" : "'{}' has too many {} values", [who, horizontal ? "horizontal" : "vertical"], help);
      };
      let hasRightOf = false, hasBelow = false;
      for (const r of refs) if (r.node === idx) { hasRightOf ||= r.key === "right_of"; hasBelow ||= r.key === "below"; }
      axis(n.left !== null, n.right !== null, hasRightOf, n.wLine, n.w.mode !== "none", true);
      axis(n.top !== null, n.bottom !== null, hasBelow, n.hLine, n.h.mode !== "none", false);
    }

    function finish() {
      for (const b of stack) diag("E009", b.line, b.kcol, b.klen, "'{' is never closed", [], "add a '}' line").node = b.node;
      stack.length = 0;
      for (const r of refs) resolve(r);
      for (const n of nodes) {
        if (n.kind !== MENU) continue;
        let first = 0;
        for (const c of n.children) {
          const it = nodes[c];
          if (it.kind === ITEM && it.radio && !it.checkable) {
            if (it.checked) {
              if (first) remove(diag("E016", it.line, it.checkedCol, it.checkedLen, "only one item in a radio group can be checked", [], "the first checked item is at line {}", [String(first)]));
              else first = it.line;
            }
          } else first = 0;
        }
      }
      checkUpperNames();
      diags.sort((a, b) => a.line - b.line || a.col - b.col);
    }

    function checkUpperNames() {
      const nameAt = new Set(nodes.filter(n => n.nameCol > 0).map(n => n.line + ":" + n.nameCol));
      const isNameFix = d => d.code === "E013" && d.fix === "auto" && nameAt.has(d.line + ":" + d.col);
      const count = new Map();
      for (const d of diags) if (isNameFix(d)) count.set(d.replacement, (count.get(d.replacement) || 0) + 1);
      for (const d of diags) if (isNameFix(d) && (names.has(d.replacement) || count.get(d.replacement) > 1)) { d.fix = "none"; d.replacement = ""; }
    }

    function resolve(r) {
      const n = nodes[r.node], menu = r.key === "menu";
      if (!names.has(r.name)) {
        // C++ std::map은 이름순 (바이트 비교) → 추천 후보도 이름순
        const cands = [...names].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0).filter(([, i]) => {
          const k = nodes[i].kind;
          return menu ? k === MENU : isScreen(k) && nodes[i].parent === n.parent && i < r.node;
        }).map(([name]) => name);
        const s = suggest(r.name, cands);
        if (s) fix(diag("E008", r.line, r.col, r.len, "no element named '{}'", [r.name], "did you mean '{}'?", [s]), "auto", s);
        else diag("E008", r.line, r.col, r.len, "no element named '{}'", [r.name], "check the name");
        return;
      }
      const ti = names.get(r.name), t = nodes[ti];
      if (t.kind === UNKNOWN) return;
      if (menu) {
        if (t.kind !== MENU) { diag("E008", r.line, r.col, r.len, "'{}' is not a menu", [r.name], "menu= must name a 'menu'"); return; }
        n.menu = ti;
        return;
      }
      if (!isScreen(t.kind)) { diag("E008", r.line, r.col, r.len, "'{}' is a '{}', not a screen element", [r.name, KIND_NAMES[t.kind]], "{} can only name a screen element", [r.key]); return; }
      if (ti === r.node) { diag("E008", r.line, r.col, r.len, "'{}' refers to itself", [r.name], "name an element that comes before it"); return; }
      if (t.parent !== n.parent) { diag("E008", r.line, r.col, r.len, "'{}' is in a different block", [r.name], "name an element in the same block, or the block itself"); return; }
      if (ti > r.node) { diag("E008", r.line, r.col, r.len, "'{}' comes later (line {})", [r.name, String(t.line)], "an element can only name elements before it"); return; }
      if (r.key === "right_of") n.rightOf = ti; else n.below = ti;
    }

    // ---- 실행 ----
    let text = bytes;
    if (text.length > MAX_FILE) {
      diag("E014", 1, 1, 0, "file is larger than {} bytes", [String(MAX_FILE)], "split the layout into smaller files").node = NODE_FILE;
    } else {
      if (text.startsWith("\xEF\xBB\xBF")) text = text.slice(3);
      let ln = 0, pos = 0;
      while (pos < text.length) {
        let e = text.indexOf("\n", pos);
        if (e < 0) e = text.length;
        let s = text.slice(pos, e);
        pos = e + 1;
        if (s.endsWith("\r")) s = s.slice(0, -1);
        oneLine(s, ++ln);
      }
      if (!ln) diag("E001", 1, 1, 0, "the first line must be '#ui 1'", [], "add '#ui 1' as the first line").node = NODE_FILE;
    }
    finish();
    return { nodes, diags, errorCount, warningCount };
  }

  const fill = (fmt, args) => { let a = 0; return fmt.replace(/\{\}/g, m => a < args.length ? args[a++] : m); };
  /// 바이트 글 → UTF-8 글
  const fromBytes = s => new TextDecoder().decode(Uint8Array.from(s, c => c.charCodeAt(0)));
  /// Uint8Array → 바이트 글
  function toBytes(u8) {
    let s = "";
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return s;
  }

  /// .ui 파일 바이트(Uint8Array) 검사 → { diags: [{severity, line, col, length, code, msg, help}], errorCount, warningCount, nodes }
  function check(u8) {
    const doc = parse(toBytes(u8));
    doc.diags = doc.diags.map(d => ({ ...d, helpFmt: d.help, msg: fromBytes(fill(d.message, d.args)), help: d.help ? fromBytes(fill(d.help, d.helpArgs)) : "" }));
    return doc;
  }
  /// 진단 하나의 번역: { msg, help } (번역 표 table = 원문 → 번역). 번역이 없는 부분은 영어 원문
  function localize(d, table) {
    const one = (fmt, args) => {
      const f = table[fmt], idx = UI_MSG_ARGS[fmt] || [];
      if (!f) return fromBytes(fill(fmt, args));
      return fill(f, args.map((a, i) => { const s = fromBytes(a); return idx.includes(i) && table[s] ? table[s] : s; }));
    };
    return { msg: one(d.message, d.args), help: d.helpFmt ? one(d.helpFmt, d.helpArgs) : "" };
  }
  /// ui-check와 같은 출력 (최대 50개, 나머지는 개수만)
  function format(doc, file) {
    let out = "", shown = 0;
    for (const d of doc.diags) {
      if (shown === 50) break;
      out += `${file}:${d.line}:${d.col}: ${d.severity}[${d.code}]: ${d.msg}\n`;
      if (d.help) out += `    help: ${d.help}\n`;
      shown++;
    }
    const total = doc.errorCount + doc.warningCount;
    if (total > shown) out += `${file}: ${total - shown} more not shown\n`;
    return out;
  }

  // ---- 오류 복구 (uilayout.cppm의 recover(), 대화상자 2의 "무시") ----
  /// 틀린 속성은 이미 빠져 있고(기본값), 틀린 요소는 묶음째 뺀다. 가리키는 요소가 없는 right_of·below는
  /// left=0·top=0으로, menu는 없는 것으로 한다. 복구할 수 없으면(E001, 파일 크기, 저장 못 한 오류) null.
  /// 원래 doc은 바꾸지 않고 새 문서를 돌려준다 (색칠·진단에 쓰는 원래 결과가 그대로 남도록).
  function recover(doc) {
    if (doc.errorCount === 0) return doc;
    if (doc.errorCount + doc.warningCount > doc.diags.length) return null;
    const nodes = doc.nodes.map(n => ({ ...n, children: n.children.slice() }));
    const drop = new Uint8Array(nodes.length);
    for (const d of doc.diags) {
      if (d.severity !== "error") continue;
      if (d.node === NODE_FILE) return null;
      if (d.node > 0 && d.node < drop.length) drop[d.node] = 1;
    }
    // 묶음째: 부모는 항상 자식보다 앞에 있음
    for (let i = 1; i < nodes.length; i++) { const p = nodes[i].parent; if (p > 0 && drop[p]) drop[i] = 1; }
    const gone = i => i >= 0 && drop[i] === 1;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.dropped = drop[i] === 1;
      n.children = n.children.filter(c => !gone(c));
      if (gone(n.menu)) n.menu = -1;
      // 가리키는 요소가 없으면(빠졌거나 처음부터 찾지 못함) 부모 안쪽의 왼쪽·위 가장자리 기준: left=0, top=0
      if (gone(n.rightOf)) n.rightOf = -1;
      if (gone(n.below)) n.below = -1;
      if (n.hasRightOf && n.rightOf < 0 && n.left === null) n.left = 0;
      if (n.hasBelow && n.below < 0 && n.top === null) n.top = 0;
    }
    return { ...doc, nodes, recovered: true };
  }

  // ---- 위치 계산 (uilayout.cppm의 Layouter, compute()) ----
  /// 요소마다 {x, y, w, h} (nodes와 같은 번호, 창 왼쪽 위 기준 실제 픽셀). 오류가 있고 복구하지 않은 문서는 빈 배열.
  /// metrics = { textWidth(바이트 글) → 픽셀, lineHeight(기본 16), scale(%, 기본 100) }
  function compute(doc, width, height, metrics = {}) {
    if ((doc.errorCount !== 0 && !doc.recovered) || !doc.nodes.length) return [];
    const nodes = doc.nodes, node = i => nodes[i];
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
    const scale = clamp(metrics.scale ?? 100, 25, 800);
    const lineH = clamp(metrics.lineHeight ?? 16, 0, 100000);
    const textW = n => metrics.textWidth ? clamp(metrics.textWidth(n.text), 0, 1000000) : 0;
    /// 96 DPI 값 → 실제 픽셀 (반올림, 0.5는 0에서 먼 쪽)
    const s = v => { const p = v * scale; return Math.trunc((p + (p >= 0 ? 50 : -50)) / 100); };
    const rects = nodes.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));

    /// 자연 크기 (axis: 0 = 가로, 1 = 세로). 정할 수 없으면 0
    function natural(i, axis) {
      const n = node(i), sz = axis === 0 ? n.w : n.h;
      if (sz.mode === "fixed") return Math.max(0, s(sz.value));
      if (sz.mode === "none") return 0;
      switch (n.kind) {
        case LABEL: return axis === 0 ? textW(n) : lineH;
        case BUTTON: case DROPDOWN: return axis === 0 ? textW(n) + 2 * s(8) : lineH + 2 * s(6);
        case EDIT: case NUMBER: return lineH + 2 * s(6);   // auto는 세로만
        case CHECK: return axis === 0 ? s(13) + s(4) + textW(n) : Math.max(s(13), lineH);
        case ROW: case COLUMN: {
          const along = (n.kind === ROW) === (axis === 0);   // 차례로 놓는 방향
          let sum = 0, big = 0;
          for (const c of n.children) { const v = node(c).kind === SPACER ? 0 : natural(c, axis); sum += v; big = Math.max(big, v); }
          const pad = 2 * Math.max(0, s(n.padding)), cnt = n.children.length;
          return along ? pad + sum + (cnt > 1 ? (cnt - 1) * s(n.spacing) : 0) : pad + big;
        }
        default: return 0;
      }
    }
    function inside(i) {
      const n = node(i);
      if (n.kind === GROUP) {
        const r = rects[i], p = s(n.padding);
        placeGroup(i, { x: r.x + p, y: r.y + p, w: Math.max(0, r.w - 2 * p), h: Math.max(0, r.h - 2 * p) });
      } else if (n.kind === ROW || n.kind === COLUMN) placeLine(i);
    }
    function placeGroup(gi, inr) {
      const x1 = inr.x + inr.w, y1 = inr.y + inr.h;
      for (const c of node(gi).children) {
        const n = node(c);
        if (!isScreen(n.kind)) continue;
        const r = { x: 0, y: 0, w: 0, h: 0 };
        const w = natural(c, 0);   // 가로
        if (n.rightOf >= 0) { const o = rects[n.rightOf]; r.x = o.x + o.w + s(n.spacing); r.w = n.right !== null ? x1 - s(n.right) - r.x : w; }
        else if (n.left !== null && n.right !== null) { r.x = inr.x + s(n.left); r.w = x1 - s(n.right) - r.x; }
        else if (n.right !== null) { r.w = w; r.x = x1 - s(n.right) - r.w; }
        else { r.x = inr.x + s(n.left ?? 0); r.w = w; }
        const h = natural(c, 1);   // 세로
        if (n.below >= 0) { const o = rects[n.below]; r.y = o.y + o.h + s(n.spacing); r.h = n.bottom !== null ? y1 - s(n.bottom) - r.y : h; }
        else if (n.top !== null && n.bottom !== null) { r.y = inr.y + s(n.top); r.h = y1 - s(n.bottom) - r.y; }
        else if (n.bottom !== null) { r.h = h; r.y = y1 - s(n.bottom) - r.h; }
        else { r.y = inr.y + s(n.top ?? 0); r.h = h; }
        r.w = Math.max(0, r.w); r.h = Math.max(0, r.h);
        rects[c] = r;
        inside(c);
      }
    }
    function placeLine(li) {
      const ln = node(li), row = ln.kind === ROW, lr = rects[li];
      const p = s(ln.padding), gap = s(ln.spacing);
      const ix = lr.x + p, iy = lr.y + p, iw = Math.max(0, lr.w - 2 * p), ih = Math.max(0, lr.h - 2 * p);
      const mainLen = row ? iw : ih, crossLen = row ? ih : iw, ma = row ? 0 : 1, ca = row ? 1 : 0;
      let used = 0, spacers = 0;
      const cnt = ln.children.length;
      for (const c of ln.children) { if (node(c).kind === SPACER) spacers++; else used += natural(c, ma); }
      if (cnt > 1) used += (cnt - 1) * gap;
      const rest = Math.max(0, mainLen - used);
      let pos = row ? ix : iy, nth = 0;
      for (const c of ln.children) {
        const n = node(c);
        let len = 0, cl = 0, co = 0;
        if (n.kind === SPACER) {
          len = Math.trunc(rest / spacers) + (nth < rest % spacers ? 1 : 0);
          nth++;
          cl = crossLen;
        } else {
          len = natural(c, ma);
          const lineSet = row ? n.hLine : n.wLine;
          if (ln.align === "fill" && !lineSet) cl = crossLen;
          else {
            cl = natural(c, ca);
            if (ln.align === "center") co = Math.trunc((crossLen - cl) / 2);
            else if (ln.align === "right" || ln.align === "bottom") co = crossLen - cl;
          }
        }
        const r = row ? { x: pos, y: iy + co, w: len, h: cl } : { x: ix + co, y: pos, w: cl, h: len };
        r.w = Math.max(0, r.w); r.h = Math.max(0, r.h);
        rects[c] = r;
        pos += len + gap;
        inside(c);
      }
    }

    rects[0] = { x: 0, y: 0, w: Math.max(0, width), h: Math.max(0, height) };
    placeGroup(0, rects[0]);
    const cl = v => clamp(v, -1000000000, 1000000000);
    return rects.map(r => ({ x: cl(r.x), y: cl(r.y), w: cl(r.w), h: cl(r.h) }));
  }

  /// 시험용 글자 너비: 코드 포인트 × 7 (ui-check의 test_text_width와 같음. 바이트 글을 받음)
  const testTextWidth = t => { let n = 0; for (let i = 0; i < t.length; i++) if ((t.charCodeAt(i) & 0xC0) !== 0x80) n++; return n * 7; };
  /// ui-check의 layout_text()와 같은 출력: "이름 x y w h" (화면 요소와 spacer만, 파일 순서, 뺀 요소 없음).
  /// 창은 기본 640×480, 배율 100. 글에 "// test: width=… height=… scale=…" 줄이 있으면 그 값을 쓴다.
  /// 오류가 있으면 recover()한 문서로 계산한다 (tests/ui/recover). 복구할 수 없으면 빈 글자.
  function layoutText(u8) {
    let doc = parse(toBytes(u8));
    if (doc.errorCount) { doc = recover(doc); if (!doc) return ""; }
    const text = new TextDecoder().decode(u8), win = { width: 640, height: 480, scale: 100 };
    const p = text.indexOf("// test:");
    if (p >= 0) {
      const line = text.slice(p + 8).split("\n")[0];
      for (const k of Object.keys(win)) { const m = line.match(new RegExp(k + "=(-?\\d+)")); if (m) win[k] = +m[1]; }
    }
    const rects = compute(doc, win.width, win.height, { textWidth: testTextWidth, lineHeight: 16, scale: win.scale });
    let out = "";
    for (let i = 1; i < rects.length && i < doc.nodes.length; i++) {
      const n = doc.nodes[i];
      if (n.kind === MENU || n.kind === ITEM || n.kind === SEPARATOR || n.kind === UNKNOWN || n.dropped) continue;
      const label = n.name ? fromBytes(n.name) : `${KIND_NAMES[n.kind]}@${n.line}`;
      const r = rects[i];
      out += `${label} ${r.x} ${r.y} ${r.w} ${r.h}\n`;
    }
    return out;
  }

  return { check, localize, format, recover, compute, layoutText, text: fromBytes, KIND_NAMES };
})();

