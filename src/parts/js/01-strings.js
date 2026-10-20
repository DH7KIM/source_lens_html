// ======================= 화면 문자열 =======================
const UI = {};   // 언어별 표는 01-strings-ko.js, 01-strings-en.js 같은 파일에서 UI.<언어 코드> = { ... }로 채움
// 언어 이름은 번역하지 않고 각 언어 자신의 이름으로 (화면 언어를 못 읽어도 찾을 수 있게). 이 표의 순서가 언어 목록 상자의 순서
const LANG_NAMES = { ko: "한국어", en: "English", ja: "日本語", "zh-cn": "中文(简体)", "zh-tw": "中文(繁體)", fr: "Français", de: "Deutsch", it: "Italiano", es: "Español", zh: "中文" };
let uiLang = (navigator.language || "en").toLowerCase().startsWith("ko") ? "ko" : "en";
// {0|item|items} = 값이 1이면 앞의 말, 아니면 뒤의 말 (영어 단수·복수, 한국어 문구는 쓰지 않음)
const t = (key, ...a) => String((UI[uiLang] || UI.en)[key] ?? UI.en[key]).replace(/\{(\d)\|([^|}]*)\|([^|}]*)\}/g, (_, i, one, many) => +a[+i] === 1 ? one : many).replace(/\{(\d)\}/g, (_, i) => a[+i] ?? "");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

