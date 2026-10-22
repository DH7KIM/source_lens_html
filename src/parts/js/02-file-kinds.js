// ======================= 파일 종류 =======================
// 기준 표 FILE_TYPES: 지원하는 파일 종류를 여기에만 적는다 (v0.47.0~).
//   id    = 종류 이름표 (영문 소문자·밑줄). 설명 글자 키 desc_<id>에 씀
//   name  = 사람이 읽는 언어·파일 이름 (번역하지 않는 고유 이름)
//   lang  = 색칠·검사 방식: cpp, rust, toml, json, json5, bat, hash(# 주석: 셸·PowerShell·YAML·Makefile·.gitignore), md, ui, uilog, plain
//   exts  = 확장자 (점 없이, 소문자)
//   names = 확장자 없는 파일 이름 (화면에 보이는 그대로 적고, 맞출 때는 소문자로 바꿔 비교)
//   check = 문법 검사기: ui, toml, json (없으면 검사기 없음). INI 계열은 lang이 toml이어도 검사하지 않아서 비워 둠
// LANG_BY_EXT·LANG_BY_NAME은 이 표에서 만든다. 새 종류는 이 표에 한 줄만 더한다.
// 이름은 ".ui.log"처럼 끝이 겹치는 것은 langOf()가 먼저 따로 본다 (exts의 "ui.log"는 표 보기용).
const FILE_TYPES = [
  { id: "cpp",           name: "C++",                lang: "cpp",   exts: ["cpp", "cc", "cxx", "hh", "hpp", "hxx", "ipp", "inl"] },
  { id: "cpp_module",    name: "C++ module",         lang: "cpp",   exts: ["ixx", "cppm", "mpp", "ccm", "cxxm"] },
  { id: "c",             name: "C",                  lang: "cpp",   exts: ["c"] },
  { id: "c_header",      name: "C/C++ header",       lang: "cpp",   exts: ["h"] },
  { id: "rc",            name: "Windows resource",   lang: "cpp",   exts: ["rc"] },
  { id: "rust",          name: "Rust",               lang: "rust",  exts: ["rs"] },
  { id: "toml",          name: "TOML",               lang: "toml",  check: "toml", exts: ["toml"] },
  { id: "cargo_lock",    name: "Cargo lock",         lang: "toml",  check: "toml", names: ["Cargo.lock"] },
  { id: "ini",           name: "INI",                lang: "toml",  exts: ["ini", "cfg"] },
  { id: "editorconfig",  name: "EditorConfig",       lang: "toml",  exts: ["editorconfig"] },
  { id: "json",          name: "JSON",               lang: "json",  check: "json", exts: ["json"] },
  { id: "jsonc",         name: "JSON with comments", lang: "json",  check: "json", exts: ["jsonc"] },
  { id: "jsonl",         name: "JSON Lines",         lang: "json",  check: "json", exts: ["jsonl", "ndjson"] },
  { id: "json5",         name: "JSON5",              lang: "json5", check: "json", exts: ["json5"] },
  { id: "batch",         name: "Batch",              lang: "bat",   exts: ["bat", "cmd"] },
  { id: "shell",         name: "Shell",              lang: "hash",  exts: ["sh"] },
  { id: "powershell",    name: "PowerShell",         lang: "hash",  exts: ["ps1", "psm1"] },
  { id: "yaml",          name: "YAML",               lang: "hash",  exts: ["yml", "yaml"] },
  { id: "cmake",         name: "CMake",              lang: "hash",  exts: ["cmake"], names: ["CMakeLists.txt"] },
  { id: "makefile",      name: "Makefile",           lang: "hash",  exts: ["mk"], names: ["Makefile", "GNUmakefile"] },
  { id: "dockerfile",    name: "Dockerfile",         lang: "hash",  names: ["Dockerfile"] },
  { id: "gitignore",     name: "Git ignore",         lang: "hash",  exts: ["gitignore"] },
  { id: "gitattributes", name: "Git attributes",     lang: "hash",  exts: ["gitattributes"] },
  { id: "markdown",      name: "Markdown",           lang: "md",    exts: ["md"] },
  { id: "text",          name: "Text",               lang: "plain", exts: ["txt"] },
  { id: "log",           name: "Log",                lang: "plain", exts: ["log"] },
  { id: "ui",            name: "UI layout",          lang: "ui",    check: "ui",   exts: ["ui"] },
  { id: "ui_log",        name: "UI log",             lang: "uilog", exts: ["ui.log"] },
  { id: "xml",           name: "XML",                lang: "plain", exts: ["xml"] },
  { id: "manifest",      name: "Manifest",           lang: "plain", exts: ["manifest"] },
  { id: "def",           name: "Module definition",  lang: "plain", exts: ["def"] },
  { id: "ld",            name: "Linker script",      lang: "plain", exts: ["ld"] },
  { id: "license",       name: "License",            lang: "plain", names: ["LICENSE", "COPYING"] },
];
const LANG_BY_EXT = {};
const LANG_BY_NAME = {};
for (const ft of FILE_TYPES) {
  for (const e of ft.exts || []) if (!e.includes(".")) LANG_BY_EXT[e] = ft.lang;
  for (const n of ft.names || []) LANG_BY_NAME[n.toLowerCase()] = ft.lang;
}
function langOf(path) {
  const name = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  if (LANG_BY_NAME[name]) return LANG_BY_NAME[name];
  if (name.endsWith(".ui.log")) return "uilog";   // ui-check·프로그램이 남기는 .ui 수정 로그
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? LANG_BY_EXT[name.slice(dot + 1)] || null : null;
}
// 지금 파일이 FILE_TYPES의 어느 종류인지(`지원 파일 형식` 창의 현재 행 강조용). langOf()와 같은 순서: 파일 이름 → 겹친 확장자(ui.log) → 마지막 확장자
const TYPE_BY_NAME = {}, TYPE_BY_EXT = {}, COMPOUND_EXTS = [];
for (const ft of FILE_TYPES) {
  for (const n of ft.names || []) TYPE_BY_NAME[n.toLowerCase()] = ft;
  for (const e of ft.exts || []) { if (e.includes(".")) COMPOUND_EXTS.push([e, ft]); else TYPE_BY_EXT[e] = ft; }
}
function typeOf(path) {
  const name = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  if (TYPE_BY_NAME[name]) return TYPE_BY_NAME[name];
  for (const [e, ft] of COMPOUND_EXTS) if (name.endsWith("." + e)) return ft;
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? TYPE_BY_EXT[name.slice(dot + 1)] || null : null;
}
const isMd = p => langOf(p) === "md";
