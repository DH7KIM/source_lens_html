// ======================= 테마 =======================
// v: bg 배경, fg 글자, muted 흐린 글자, line 선, panel 코드·버튼 배경, code 인라인 코드 글자,
//    link 링크, th 표 머리, accent 강조, side 목록 배경, sel 목록·줄 선택
// s: 문법 색 — 키워드, 타입, 문자열, 주석, 숫자·상수, 전처리·속성, 함수·매크로
// safe: (선택) 오류 빨강과 헷갈리지 않는 색 — "--hk2 --hp2" 순서. 키워드(hk)·속성(hp)이 빨강 계열인 테마만 정함. 없으면 hk·hp 그대로
// "", light, dark는 위 CSS에 있음 (""는 시스템 설정을 따라 밝게/어둡게)
const SERIF = 'Georgia, "Batang", "바탕", "Malgun Gothic", serif';
const GH_FONT = '-apple-system, "Segoe UI", "Noto Sans", "Malgun Gothic", Helvetica, Arial, sans-serif';
const THEMES = [
  { id: "", ko: "시스템 (밝게/어둡게)", en: "System (light/dark)" },
  { id: "light", ko: "Claude 밝게", en: "Claude Light" },
  { id: "github", ko: "GitHub", en: "GitHub", hrule: 1, font: GH_FONT,
    v: "#ffffff #1f2328 #59636e #d1d9e0 #f6f8fa #1f2328 #0969da #f6f8fa #0969da #f6f8fa #e7ecf0",
    s: "#cf222e #953800 #0a3069 #59636e #0550ae #cf222e #8250df", safe: "#1a7f37 #8250df" },
  { id: "solarized-light", ko: "Solarized 밝게", en: "Solarized Light",
    v: "#fdf6e3 #586e75 #93a1a1 #e4ddc8 #eee8d5 #d33682 #268bd2 #eee8d5 #cb4b16 #f5efdc #e6dfc8",
    s: "#859900 #b58900 #2aa198 #93a1a1 #d33682 #cb4b16 #268bd2" },
  { id: "gruvbox-light", ko: "Gruvbox 밝게", en: "Gruvbox Light",
    v: "#fbf1c7 #3c3836 #7c6f64 #d5c4a1 #f2e5bc #9d0006 #076678 #ebdbb2 #af3a03 #f2e5bc #ebdbb2",
    s: "#9d0006 #b57614 #79740e #928374 #8f3f71 #af3a03 #076678", safe: "#427b58" },
  { id: "catppuccin-latte", ko: "Catppuccin Latte", en: "Catppuccin Latte",
    v: "#eff1f5 #4c4f69 #6c6f85 #ccd0da #e6e9ef #d20f39 #1e66f5 #e6e9ef #8839ef #e6e9ef #dce0e8",
    s: "#8839ef #df8e1d #40a02b #9ca0b0 #fe640b #ea76cb #1e66f5" },
  { id: "sakura", ko: "벚꽃", en: "Sakura",
    v: "#fffafb #4a4a4a #8a7f82 #f2d7de #fbeef1 #c2185b #d6336c #fbeef1 #d6336c #fdf2f5 #f8e1e7",
    s: "#c2185b #8e5a9e #5a8a3a #a89aa0 #d9730d #ad1457 #1e6fb0" },
  { id: "academic", ko: "논문 (LaTeX 느낌)", en: "Academic (LaTeX style)", hrule: 1,
    font: '"Latin Modern Roman", "CMU Serif", Cambria, "Times New Roman", "Batang", "바탕", serif',
    v: "#ffffff #111111 #555555 #cccccc #f7f7f7 #111111 #1a3e8c #f2f2f2 #1a3e8c #fafafa #ececec",
    s: "#1a3e8c #6b2f8a #2e6b2e #777777 #8a4b0f #6b2f8a #111111" },
  { id: "sepia", ko: "종이", en: "Paper", font: SERIF,
    v: "#f4ecd8 #3b2f1e #7a6a52 #dccfb0 #ebe0c4 #8a3b12 #8a4b0f #ebe0c4 #8a4b0f #ede3c9 #e0d2ae",
    s: "#8a3b12 #6b4f1d #4f6b1d #9a8a72 #a0521a #7a3e7a #2f5a8a" },
  { id: "dark", ko: "Claude 어둡게", en: "Claude Dark", dark: 1 },
  { id: "github-dark", ko: "GitHub 어둡게", en: "GitHub Dark", dark: 1, hrule: 1, font: GH_FONT,
    v: "#0d1117 #e6edf3 #9198a1 #3d444d #151b23 #e6edf3 #4493f8 #151b23 #4493f8 #010409 #1f2630",
    s: "#ff7b72 #ffa657 #a5d6ff #9198a1 #79c0ff #ff7b72 #d2a8ff", safe: "#56d364 #d2a8ff" },
  { id: "solarized-dark", ko: "Solarized 어둡게", en: "Solarized Dark", dark: 1,
    v: "#002b36 #93a1a1 #6c868d #0d4250 #073642 #d33682 #268bd2 #073642 #cb4b16 #00252e #0a4352",
    s: "#859900 #b58900 #2aa198 #586e75 #d33682 #cb4b16 #268bd2" },
  { id: "gruvbox-dark", ko: "Gruvbox 어둡게", en: "Gruvbox Dark", dark: 1,
    v: "#282828 #ebdbb2 #a89984 #504945 #32302f #fb4934 #83a598 #3c3836 #fe8019 #1d2021 #3c3836",
    s: "#fb4934 #fabd2f #b8bb26 #928374 #d3869b #fe8019 #83a598", safe: "#8ec07c" },
  { id: "nord", ko: "Nord", en: "Nord", dark: 1,
    v: "#2e3440 #e5e9f0 #a0a8b7 #434c5e #3b4252 #b48ead #88c0d0 #3b4252 #88c0d0 #292e39 #434c5e",
    s: "#81a1c1 #8fbcbb #a3be8c #616e88 #b48ead #5e81ac #88c0d0" },
  { id: "dracula", ko: "Dracula", en: "Dracula", dark: 1,
    v: "#282a36 #f8f8f2 #a4a8c2 #44475a #21222c #ff79c6 #8be9fd #343746 #bd93f9 #21222c #44475a",
    s: "#ff79c6 #8be9fd #f1fa8c #6272a4 #bd93f9 #ff79c6 #50fa7b" },
  { id: "one-dark", ko: "One Dark", en: "One Dark", dark: 1,
    v: "#282c34 #abb2bf #7f848e #3e4451 #21252b #e06c75 #61afef #2c313a #c678dd #21252b #2c313a",
    s: "#c678dd #e5c07b #98c379 #7f848e #d19a66 #c678dd #61afef" },
  { id: "tokyo-night", ko: "Tokyo Night", en: "Tokyo Night", dark: 1,
    v: "#1a1b26 #c0caf5 #8089b3 #2f334d #16161e #f7768e #7aa2f7 #24283b #bb9af7 #16161e #292e42",
    s: "#bb9af7 #2ac3de #9ece6a #565f89 #ff9e64 #7dcfff #7aa2f7" },
  { id: "catppuccin-mocha", ko: "Catppuccin Mocha", en: "Catppuccin Mocha", dark: 1,
    v: "#1e1e2e #cdd6f4 #a6adc8 #45475a #181825 #f38ba8 #89b4fa #313244 #cba6f7 #181825 #313244",
    s: "#cba6f7 #f9e2af #a6e3a1 #6c7086 #fab387 #f5c2e7 #89b4fa" },
  { id: "high-contrast", ko: "고대비", en: "High Contrast", dark: 1,
    v: "#000000 #ffffff #d0d0d0 #9a9a9a #111111 #ffd700 #00e5ff #1a1a1a #ffd700 #0a0a0a #333333",
    s: "#ffd700 #00e5ff #7cfc00 #a0a0a0 #ff9f40 #ff6ec7 #87cefa" },
];
const VAR_NAMES = ["bg", "fg", "muted", "line", "panel", "code-fg", "link", "th", "accent", "side", "sel"];
const HL_NAMES = ["hk", "ht", "hs", "hc", "hn", "hp", "hf"];
let themeId = "";

function drawThemes() {
  const sel = $("theme");
  sel.innerHTML = "";
  sel.title = t("theme"); $("themeLabel").textContent = t("theme");   // 선택 상자는 설정 창 안에 있음 (12b-settings.js)
  for (const dark of [0, 1]) {
    const g = document.createElement("optgroup");
    g.label = t(dark ? "dark" : "light");
    for (const th of THEMES) {
      if (!!th.dark !== !!dark) continue;
      const o = document.createElement("option");
      o.value = th.id; o.textContent = th[uiLang] || th.en;
      g.append(o);
    }
    sel.append(g);
  }
  sel.value = themeId;
}

function applyTheme(id) {
  const th = THEMES.find(x => x.id === id) || THEMES[0];
  const root = document.documentElement;
  root.removeAttribute("style");
  if (th.id) root.dataset.theme = th.id; else delete root.dataset.theme;
  if (th.hrule) root.dataset.hrule = ""; else delete root.dataset.hrule;
  if (th.v) th.v.split(" ").forEach((c, k) => root.style.setProperty("--" + VAR_NAMES[k], c));
  if (th.s) th.s.split(" ").forEach((c, k) => root.style.setProperty("--" + HL_NAMES[k], c));
  if (th.safe) th.safe.split(" ").forEach((c, k) => root.style.setProperty("--" + ["hk2", "hp2"][k], c));
  if (th.font) root.style.setProperty("--font", th.font);
  if (th.v) root.style.setProperty("--err", th.dark ? "#ff6b6b" : "#d03030");
  if (th.v) root.style.setProperty("--warn", th.dark ? "#e8a33d" : "#b06a00");
  if (th.id) root.style.colorScheme = th.dark ? "dark" : "light";
  themeId = th.id;
  $("theme").value = th.id;
  applyCodeFont(); applyCodeSize();   // 위에서 인라인 스타일을 모두 지웠으니 설정 창에서 고른 코드 글꼴·글자 크기(12b-settings.js)를 다시 입힘 (v0.71.0, v0.70.0의 새로 고침 뒤 풀리는 버그)
}
try { applyTheme(localStorage.getItem("sv-theme") || ""); } catch (e) { applyTheme(""); }
$("theme").onchange = () => { applyTheme($("theme").value); try { localStorage.setItem("sv-theme", themeId); } catch (e) {} };

