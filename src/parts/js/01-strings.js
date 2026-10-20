// ======================= 화면 문자열 =======================
const UI = {};   // 언어별 표는 01-strings-ko.js, 01-strings-en.js 같은 파일에서 UI.<언어 코드> = { ... }로 채움
const LANG_NAMES = { ko: "한국어", en: "English", ja: "日本語", zh: "中文" };
let uiLang = (navigator.language || "en").toLowerCase().startsWith("ko") ? "ko" : "en";
// {0|item|items} = 값이 1이면 앞의 말, 아니면 뒤의 말 (영어 단수·복수, 한국어 문구는 쓰지 않음)
const t = (key, ...a) => String((UI[uiLang] || UI.en)[key] ?? UI.en[key]).replace(/\{(\d)\|([^|}]*)\|([^|}]*)\}/g, (_, i, one, many) => +a[+i] === 1 ? one : many).replace(/\{(\d)\}/g, (_, i) => a[+i] ?? "");
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

