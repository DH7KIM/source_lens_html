// ======================= 파일 종류 =======================
// 언어: cpp, rust, toml, json, json5, bat, hash(# 주석: 셸·PowerShell·YAML·Makefile·.gitignore), md, plain
const LANG_BY_EXT = {
  cpp: "cpp", cc: "cpp", cxx: "cpp", c: "cpp", h: "cpp", hh: "cpp", hpp: "cpp", hxx: "cpp", ipp: "cpp", inl: "cpp",
  ixx: "cpp", cppm: "cpp", mpp: "cpp", ccm: "cpp", cxxm: "cpp", rc: "cpp",
  rs: "rust", toml: "toml", ini: "toml", cfg: "toml", editorconfig: "toml",
  json: "json", jsonc: "json", jsonl: "json", ndjson: "json", json5: "json5", bat: "bat", cmd: "bat",
  sh: "hash", ps1: "hash", psm1: "hash", yml: "hash", yaml: "hash", cmake: "hash", mk: "hash",
  gitignore: "hash", gitattributes: "hash",
  md: "md", txt: "plain", log: "plain", ui: "ui", xml: "plain", manifest: "plain", def: "plain", ld: "plain",
};
const LANG_BY_NAME = {
  makefile: "hash", gnumakefile: "hash", "cmakelists.txt": "hash", dockerfile: "hash",
  "cargo.lock": "toml", license: "plain", copying: "plain",
};
function langOf(path) {
  const name = path.slice(path.lastIndexOf("/") + 1).toLowerCase();
  if (LANG_BY_NAME[name]) return LANG_BY_NAME[name];
  if (name.endsWith(".ui.log")) return "uilog";   // ui-check·프로그램이 남기는 .ui 수정 로그
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? LANG_BY_EXT[name.slice(dot + 1)] || null : null;
}
const isMd = p => langOf(p) === "md";

