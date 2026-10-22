// ======================= 화면 문자열 =======================
const UI = {};   // 언어별 표는 01-strings-ko.js, 01-strings-en.js 같은 파일에서 UI.<언어 코드> = { ... }로 채움
// 언어 이름은 번역하지 않고 각 언어 자신의 이름으로 (화면 언어를 못 읽어도 찾을 수 있게). 이 표의 순서가 언어 목록 상자의 순서
const LANG_NAMES = { ko: "한국어", en: "English", ja: "日本語", "zh-cn": "中文(简体)", "zh-tw": "中文(繁體)", fr: "Français", de: "Deutsch", it: "Italiano", es: "Español", pt: "Português", zh: "中文" };
let uiLang = "en";   // 시작 때 pickUiLang()가 브라우저 언어로 다시 고름 (언어 표가 모두 읽힌 뒤, 09-source-folder.js)
// 브라우저 언어 태그 → 언어 코드: zh-TW·zh-HK·zh-MO·zh-Hant → zh-tw, 그 밖의 zh → zh-cn, 나머지는 앞 부분 (ja-JP → ja)
function langCodeOf(tag) {
  const s = String(tag).toLowerCase();
  if (s.startsWith("zh")) return /hant|-tw|-hk|-mo/.test(s) ? "zh-tw" : "zh-cn";
  return s.split("-")[0];
}
// 브라우저 선호 언어 목록을 앞에서부터 보고 화면 글자 표(UI)가 있는 첫 언어를 고름, 없으면 en
function pickUiLang() {
  for (const tag of navigator.languages?.length ? navigator.languages : [navigator.language || "en"]) {
    const c = langCodeOf(tag);
    if (UI[c]) return c;
  }
  return "en";
}
// 복수 형식 {0|칸1|칸2|…}: 수 0번째 값에 맞는 칸을 고름. 규칙은 Intl.PluralRules(화면 언어)의 분류 (CLDR)
//   칸이 2개: one이면 앞의 말, 아니면 뒤의 말 (영어 1 → 앞, 프랑스어는 0·1 → 앞). 예: {0|item|items}
//   칸이 3개 이상: 그 언어의 분류를 zero·one·two·few·many·other 순서로 놓고 같은 순서의 칸을 씀 (모자라면 마지막 칸).
//   예: 러시아어 {0|файл|файла|файлов} = one(1, 21, 101) · few(2~4, 22) · many(0, 5~20, 25, 111)
const PLURAL_ORDER = ["zero", "one", "two", "few", "many", "other"];
const pluralRules = {};
function pluralIndex(lang, n, count) {
  let rules = pluralRules[lang];
  if (rules === undefined) {
    try { rules = new Intl.PluralRules(lang); } catch { rules = null; }
    pluralRules[lang] = rules;
  }
  const cat = rules ? rules.select(n) : (n === 1 ? "one" : "other");
  if (count === 2) return cat === "one" ? 0 : 1;
  const cats = rules ? PLURAL_ORDER.filter(c => rules.resolvedOptions().pluralCategories.includes(c)) : ["one", "other"];
  return Math.min(Math.max(cats.indexOf(cat), 0), count - 1);
}
const t = (key, ...a) => String((UI[uiLang] || UI.en)[key] ?? UI.en[key]).replace(/\{(\d)\|([^}]*)\}/g, (_, i, list) => { const f = list.split("|"); return f[pluralIndex(uiLang, +a[+i], f.length)]; }).replace(/\{(\d)\}/g, (_, i) => a[+i] ?? "");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

