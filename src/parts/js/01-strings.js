// ======================= 화면 문자열 =======================
const UI = {};   // 언어별 표는 01-strings-ko.js, 01-strings-en.js 같은 파일에서 UI.<언어 코드> = { ... }로 채움
// 언어 이름은 번역하지 않고 각 언어 자신의 이름으로 (화면 언어를 못 읽어도 찾을 수 있게). 이 표의 순서가 언어 목록 상자의 순서
const LANG_NAMES = { ko: "한국어", en: "English", ja: "日本語", "zh-cn": "中文(简体)", "zh-tw": "中文(繁體)", fr: "Français", de: "Deutsch", it: "Italiano", es: "Español", zh: "中文" };
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
// {0|item|items} = 값이 1이면 앞의 말, 아니면 뒤의 말 (영어 단수·복수, 한국어 문구는 쓰지 않음)
const t = (key, ...a) => String((UI[uiLang] || UI.en)[key] ?? UI.en[key]).replace(/\{(\d)\|([^|}]*)\|([^|}]*)\}/g, (_, i, one, many) => +a[+i] === 1 ? one : many).replace(/\{(\d)\}/g, (_, i) => a[+i] ?? "");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

