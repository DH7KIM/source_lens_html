// ======================= 문법 색칠 =======================
// 토큰 클래스: k 키워드, t 타입, s 문자열, c 주석, n 숫자·상수, p 전처리·속성, f 함수·매크로
const words = s => new Set(s.split(/\s+/));
const CPP_KW = words(`alignas alignof asm break case catch class co_await co_return co_yield concept const consteval
  constexpr constinit const_cast continue decltype default delete do dynamic_cast else enum explicit export extern false
  final for friend goto if import inline module mutable namespace new noexcept nullptr operator override private protected
  public register reinterpret_cast requires return sizeof static static_assert static_cast struct switch template this
  thread_local throw true try typedef typeid typename union using virtual volatile while`);
const CPP_TY = words(`auto bool char char8_t char16_t char32_t double float int long short signed unsigned void wchar_t
  size_t ptrdiff_t intptr_t uintptr_t int8_t int16_t int32_t int64_t uint8_t uint16_t uint32_t uint64_t
  BYTE WORD DWORD BOOL HWND HDC HINSTANCE HMODULE LPARAM WPARAM LRESULT UINT LPCWSTR LPWSTR WCHAR`);
const RS_KW = words(`as async await break const continue crate dyn else enum extern false fn for if impl in let loop
  macro_rules match mod move mut pub ref return self static struct super trait true type union unsafe use where while yield`);
const RS_TY = words(`i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str Self`);
const SH_KW = words(`if then else elif fi for do done while until case esac function in return export local exit
  foreach param begin process end switch break continue try catch finally throw`);
const BAT_KW = words(`echo set setlocal endlocal if else goto call exit pause cd pushd popd for do in not exist defined
  errorlevel equ neq lss leq gtr geq shift start del copy move mkdir md rd rmdir type title cls chcp off on`);

// 규칙 = (글, 위치, push) → 새 위치 (맞지 않으면 -1)
const re = (rx, cls) => (s, p, push) => {
  rx.lastIndex = p;
  const m = rx.exec(s);
  if (!m || !m[0]) return -1;
  push(typeof cls === "function" ? cls(m, s, p) : cls, m[0]);
  return p + m[0].length;
};
function atLineStart(s, p) {
  let b = p - 1;
  while (b >= 0 && (s[b] === " " || s[b] === "\t")) b--;
  return b < 0 || s[b] === "\n";
}
/// 이름 분류: 키워드 → 타입 → 대문자 상수 → 대문자로 시작(타입) → 매크로(name!) → 함수(name()
const ident = (rx, kw, ty, { macro = false, lower = false } = {}) => re(rx, (m, s, p) => {
  const w = m[0], key = lower ? w.toLowerCase() : w;
  let e = p + w.length;
  if (kw.has(key)) return "k";
  if (ty.has(key)) return "t";
  if (macro && s[e] === "!" && s[e + 1] !== "=") return "f";
  if (/^[A-Z][A-Z0-9_]+$/.test(w)) return "n";
  if (/^[A-Z]/.test(w) && /[a-z]/.test(w)) return "t";
  while (s[e] === " ") e++;
  return s[e] === "(" ? "f" : null;
});
function cppPre(s, p, push) {                    // #include, #define ...
  if (s[p] !== "#" || !atLineStart(s, p)) return -1;
  const rx = /#\s*\w*/y; rx.lastIndex = p;
  const d = rx.exec(s)[0];
  push("p", d);
  let e = p + d.length;
  if (/include|import/.test(d)) {
    const r = /(\s*)(<[^>\n]*>)/y; r.lastIndex = e;
    const m = r.exec(s);
    if (m) { push(null, m[1]); push("s", m[2]); e += m[0].length; }
  }
  return e;
}
function rustBlockComment(s, p, push) {          // /* */ 중첩 가능
  if (s[p] !== "/" || s[p + 1] !== "*") return -1;
  let d = 0, i = p;
  while (i < s.length) {
    if (s[i] === "/" && s[i + 1] === "*") { d++; i += 2; }
    else if (s[i] === "*" && s[i + 1] === "/") { d--; i += 2; if (!d) break; }
    else i++;
  }
  push("c", s.slice(p, i)); return i;
}
function rustAttr(s, p, push) {                  // #[derive(...)], #![allow(...)]
  if (s[p] !== "#") return -1;
  let i = p + 1;
  if (s[i] === "!") i++;
  if (s[i] !== "[") return -1;
  let d = 0;
  for (; i < s.length; i++) {
    if (s[i] === "[") d++;
    else if (s[i] === "]" && !--d) { i++; break; }
  }
  push("p", s.slice(p, i)); return i;
}
const hashComment = (s, p, push) => {           // # 주석 (앞이 줄 처음이거나 공백일 때만)
  if (s[p] !== "#" || (p > 0 && !/\s/.test(s[p - 1]))) return -1;
  const e = s.indexOf("\n", p);
  const end = e < 0 ? s.length : e;
  push("c", s.slice(p, end)); return end;
};
const lineStart = (rx, cls) => (s, p, push) => atLineStart(s, p) ? re(rx, cls)(s, p, push) : -1;

// HTML: 태그 이름(k)·속성 이름(f)·속성 값(s)·주석(c)·<!doctype>(p)·&엔티티;(n). <script>·<style> 안은 색칠 없이 그대로 둔다 (JS·CSS 색칠기가 아직 없음)
function htmlTag(s, p, push) {                   // <div class="a">, </div>, <br/>: 한 태그를 이름·속성·값으로 나눠 색칠
  const m = /<(\/?)([A-Za-z][\w:.-]*)((?:"[^"]*"|'[^']*'|[^'">])*)(>?)/y;
  m.lastIndex = p;
  const r = m.exec(s);
  if (!r) return -1;
  push(null, "<" + r[1]); push("k", r[2]);
  const body = r[3], tk = /\s+|"[^"]*"|'[^']*'|=|\/|[^\s="'\/]+|[\s\S]/y;
  let i = 0, afterEq = false;
  while (i < body.length) {
    tk.lastIndex = i;
    const w = tk.exec(body)[0]; i += w.length;
    if (/^\s+$/.test(w) || w === "/") { push(null, w); continue; }
    if (w === "=") { push(null, w); afterEq = true; continue; }
    push(w[0] === '"' || w[0] === "'" || afterEq ? "s" : "f", w);   // 따옴표 값·따옴표 없는 값은 s, 그 밖은 속성 이름
    afterEq = false;
  }
  push(null, r[4]);
  const name = r[2].toLowerCase();
  if (!r[1] && r[4] && (name === "script" || name === "style") && !body.trimEnd().endsWith("/")) {   // 안쪽은 그대로
    const end = p + r[0].length, close = new RegExp("</" + name, "gi");
    close.lastIndex = end;
    const c = close.exec(s), stop = c ? c.index : s.length;
    push(null, s.slice(end, stop));
    return stop;
  }
  return p + r[0].length;
}

const RULES = {
  cpp: [
    re(/\/\/.*/y, "c"),
    re(/\/\*[\s\S]*?(?:\*\/|$)/y, "c"),
    cppPre,
    re(/(?:u8|u|U|L)?R"([^()\\\s]{0,16})\([\s\S]*?\)\1"/y, "s"),
    re(/(?:u8|u|U|L)?"(?:\\.|[^"\\\n])*"?/y, "s"),
    re(/(?:u8|u|U|L)?'(?:\\.|[^'\\\n])*'/y, "s"),
    re(/(?:\.\d|\d)(?:[eEpP][+-]|[\w']|\.)*/y, "n"),
    ident(/[A-Za-z_]\w*/y, CPP_KW, CPP_TY),
  ],
  rust: [
    re(/\/\/.*/y, "c"),
    rustBlockComment,
    re(/b?r(#*)"[\s\S]*?"\1/y, "s"),
    re(/b?"(?:\\[\s\S]|[^"\\])*"?/y, "s"),
    re(/b?'(?:\\(?:u\{[\da-fA-F]{1,6}\}|x[\da-fA-F]{2}|[\s\S])|[^'\\\n])'/y, "s"),
    re(/'[A-Za-z_]\w*/y, "p"),                   // 수명 'a
    rustAttr,
    re(/\d(?:[eE][+-]|\w|\.(?=\d))*/y, "n"),
    ident(/[A-Za-z_]\w*/y, RS_KW, RS_TY, { macro: true }),
  ],
  toml: [
    re(/[#;].*/y, "c"),
    lineStart(/\[\[?[^\]\n]*\]\]?/y, "t"),
    lineStart(/[\w.\-"' ]+?(?=\s*=)/y, "f"),
    re(/"""[\s\S]*?(?:"""|$)|'''[\s\S]*?(?:'''|$)/y, "s"),
    re(/"(?:\\.|[^"\\\n])*"?|'[^'\n]*'?/y, "s"),
    re(/[+-]?\d[\w:.+\-]*/y, "n"),
    ident(/[A-Za-z_][\w-]*/y, words("true false inf nan"), new Set()),
  ],
  json: [
    re(/\/\/.*/y, "c"),
    re(/\/\*[\s\S]*?(?:\*\/|$)/y, "c"),
    re(/"(?:\\.|[^"\\\n])*"?/y, (m, s, p) => /^\s*:/.test(s.slice(p + m[0].length, p + m[0].length + 8)) ? "f" : "s"),
    re(/-?\d[\d.eE+\-]*/y, "n"),
    ident(/[A-Za-z_]\w*/y, words("true false null"), new Set()),
  ],
  json5: [                                       // JSON5: 주석, 따옴표 없는 키, 작은따옴표, 16진수, Infinity·NaN, 끝 쉼표
    re(/\/\/.*/y, "c"),
    re(/\/\*[\s\S]*?(?:\*\/|$)/y, "c"),
    re(/"(?:\\[\s\S]|[^"\\\n])*"?|'(?:\\[\s\S]|[^'\\\n])*'?/y, (m, s, p) => /^\s*:/.test(s.slice(p + m[0].length, p + m[0].length + 8)) ? "f" : "s"),
    re(/[A-Za-z_$][\w$]*(?=\s*:)/y, "f"),         // 따옴표 없는 키
    re(/[+-]?(?:0[xX][\da-fA-F]+|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/y, "n"),
    re(/[+-]?(?:Infinity|NaN)(?![\w$])/y, "n"),
    ident(/[A-Za-z_$][\w$]*/y, words("true false null"), new Set()),
  ],
  bat: [
    lineStart(/@?(?:rem\b|::).*/iy, "c"),
    lineStart(/:\w+/y, "f"),
    re(/%(?:~[a-zA-Z]*\d|%~?[a-zA-Z]|\d|[^%\s]+%)|![^!\s]+!/y, "p"),
    re(/"[^"\n]*"?/y, "s"),
    re(/\d+\b/y, "n"),
    ident(/[A-Za-z_][\w.\-]*/y, BAT_KW, new Set(), { lower: true }),
  ],
  uilog: [                                       // .ui.log: 시각, 줄:칸, 오류 코드
    lineStart(/\d{4}-\d\d-\d\d \d\d:\d\d:\d\d/y, "n"),
    re(/\d+:\d+(?!\d)/y, "n"),
    re(/E\d{3}(?!\w)/y, "x"),
    re(/W\d{3}(?!\w)/y, "n"),
    re(/'[^'\n]*'/y, "s"),
    re(/->/y, "p"),
    re(/[A-Za-z_][\w.]*/y, null),
  ],
  html: [
    re(/<!--[\s\S]*?(?:-->|$)/y, "c"),
    re(/<![\s\S]*?(?:>|$)|<\?[\s\S]*?(?:\?>|$)/y, "p"),   // <!doctype html>, <![CDATA[ ]]>, <?xml ?>
    htmlTag,
    re(/&(?:#\d+|#[xX][\da-fA-F]+|[A-Za-z]\w*);/y, "n"),
  ],
  hash: [
    hashComment,
    re(/\$\{[^}\n]*\}|\$\([^)\n]*\)|\$[\w@#?*!]+/y, "p"),
    re(/"(?:\\.|[^"\\\n])*"?|'[^'\n]*'?/y, "s"),
    re(/\d[\w.]*/y, "n"),
    re(/[A-Za-z_][\w.\-]*(?=\s*:(?!:))/y, "f"),  // YAML 키, Makefile 대상
    ident(/[A-Za-z_][\w\-]*/y, SH_KW, new Set(), { lower: true }),
  ],
};
const LANG_ALIAS = { "c++": "cpp", c: "cpp", h: "cpp", hpp: "cpp", cxx: "cpp", cc: "cpp", cppm: "cpp", ixx: "cpp",
  rs: "rust", ini: "toml", jsonc: "json", cmd: "bat", batch: "bat", bash: "hash", sh: "hash", shell: "hash",
  powershell: "hash", ps1: "hash", yaml: "hash", yml: "hash", makefile: "hash", cmake: "hash" };

/// 글 → [[클래스, 글], ...]
function highlight(src, lang) {
  if (lang === "ui") return highlightUi(src);
  const rules = RULES[LANG_ALIAS[lang] || lang];
  if (!rules) return [[null, src]];
  const out = [];
  let plain = "";
  const push = (cls, text) => {
    if (!text) return;
    if (!cls) { plain += text; return; }
    if (plain) { out.push([null, plain]); plain = ""; }
    out.push([cls, text]);
  };
  let pos = 0;
  outer: while (pos < src.length) {
    for (const r of rules) {
      const n = r(src, pos, push);
      if (n > pos) { pos = n; continue outer; }
    }
    // 아무 규칙도 맞지 않으면 이름이 아닌 글자를 한꺼번에 넘긴다
    const rx = /[^\w"'#/$%!@:;\[\-\.+<&]+|[\s\S]/y; rx.lastIndex = pos;
    const m = rx.exec(src)[0];
    push(null, m); pos += m.length;
  }
  if (plain) out.push([null, plain]);
  return out;
}

