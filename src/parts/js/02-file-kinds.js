// ======================= 파일 종류 =======================
// 기준 표 FILE_TYPES: 지원하는 파일 종류를 여기에만 적는다 (v0.47.0~).
//   name  = 사람이 읽는 언어·파일 이름 (번역하지 않는 고유 이름)
//   lang  = 색칠·검사 방식: cpp, rust, toml, json, json5, bat, hash(# 주석: 셸·PowerShell·YAML·Makefile·.gitignore), md, ui, uilog, plain
//   exts  = 확장자 (점 없이, 소문자)
//   names = 확장자 없는 파일 이름 (소문자)
// LANG_BY_EXT·LANG_BY_NAME은 이 표에서 만든다. 새 종류는 이 표에 한 줄만 더한다.
// 이름은 ".ui.log"처럼 끝이 겹치는 것은 langOf()가 먼저 따로 본다 (exts의 "ui.log"는 표 보기용).
const FILE_TYPES = [
  { name: "C++",                lang: "cpp",   exts: ["cpp", "cc", "cxx", "hh", "hpp", "hxx", "ipp", "inl"] },
  { name: "C++ module",         lang: "cpp",   exts: ["ixx", "cppm", "mpp", "ccm", "cxxm"] },
  { name: "C",                  lang: "cpp",   exts: ["c"] },
  { name: "C/C++ header",       lang: "cpp",   exts: ["h"] },
  { name: "Windows resource",   lang: "cpp",   exts: ["rc"] },
  { name: "Rust",               lang: "rust",  exts: ["rs"] },
  { name: "TOML",               lang: "toml",  exts: ["toml"] },
  { name: "Cargo lock",         lang: "toml",  names: ["cargo.lock"] },
  { name: "INI",                lang: "toml",  exts: ["ini", "cfg"] },
  { name: "EditorConfig",       lang: "toml",  exts: ["editorconfig"] },
  { name: "JSON",               lang: "json",  exts: ["json"] },
  { name: "JSON with comments", lang: "json",  exts: ["jsonc"] },
  { name: "JSON Lines",         lang: "json",  exts: ["jsonl", "ndjson"] },
  { name: "JSON5",              lang: "json5", exts: ["json5"] },
  { name: "Batch",              lang: "bat",   exts: ["bat", "cmd"] },
  { name: "Shell",              lang: "hash",  exts: ["sh"] },
  { name: "PowerShell",         lang: "hash",  exts: ["ps1", "psm1"] },
  { name: "YAML",               lang: "hash",  exts: ["yml", "yaml"] },
  { name: "CMake",              lang: "hash",  exts: ["cmake"], names: ["cmakelists.txt"] },
  { name: "Makefile",           lang: "hash",  exts: ["mk"], names: ["makefile", "gnumakefile"] },
  { name: "Dockerfile",         lang: "hash",  names: ["dockerfile"] },
  { name: "Git ignore",         lang: "hash",  exts: ["gitignore"] },
  { name: "Git attributes",     lang: "hash",  exts: ["gitattributes"] },
  { name: "Markdown",           lang: "md",    exts: ["md"] },
  { name: "Text",               lang: "plain", exts: ["txt"] },
  { name: "Log",                lang: "plain", exts: ["log"] },
  { name: "UI layout",          lang: "ui",    exts: ["ui"] },
  { name: "UI log",             lang: "uilog", exts: ["ui.log"] },
  { name: "XML",                lang: "plain", exts: ["xml"] },
  { name: "Manifest",           lang: "plain", exts: ["manifest"] },
  { name: "Module definition",  lang: "plain", exts: ["def"] },
  { name: "Linker script",      lang: "plain", exts: ["ld"] },
  { name: "License",            lang: "plain", names: ["license", "copying"] },
];
const LANG_BY_EXT = {};
const LANG_BY_NAME = {};
for (const ft of FILE_TYPES) {
  for (const e of ft.exts || []) if (!e.includes(".")) LANG_BY_EXT[e] = ft.lang;
  for (const n of ft.names || []) LANG_BY_NAME[n] = ft.lang;
}
function langOf(path) {
  const name = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  if (LANG_BY_NAME[name]) return LANG_BY_NAME[name];
  if (name.endsWith(".ui.log")) return "uilog";   // ui-check·프로그램이 남기는 .ui 수정 로그
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? LANG_BY_EXT[name.slice(dot + 1)] || null : null;
}
const isMd = p => langOf(p) === "md";
