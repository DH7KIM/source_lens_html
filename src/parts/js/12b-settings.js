// ======================= 설정 (머리 막대 톱니 단추 + 설정 창) =======================
// 지금은 테마(v0.64.0에서 머리 막대에서 옮김, 선택 상자 #theme과 그 동작은 17-themes.js)와 합자(ligature) 켜기/끄기. 하위 단계(v0.66.0에서 옮김, 선택 상자 #depth와 그 동작은 16-start.js), 코드 글꼴 고르기(v0.70.0), 코드 글자 크기(v0.71.0). 창 닫기는 공통 부분(11a-dialog-table.js)을 씀
// 합자: 코드 글꼴이 `->`·`!=`·`=>` 같은 글자를 한 모양으로 합쳐 그리는 것. 기본은 끔(소스를 글자 그대로 보여 줌). 값은 sv-ligatures ("1" = 켬), 폴더와 상관없이 하나
let ligatures = false;
try { ligatures = localStorage.getItem("sv-ligatures") === "1"; } catch (e) {}
function applyLigatures() { document.body.classList.toggle("ligatures", ligatures); }   // CSS의 --lig 변수가 바뀜 (01-style.css)
applyLigatures();

// 코드 글꼴 고르기 (v0.70.0): 고른 글꼴을 CSS 변수 --mono 맨 앞에 두고, 뒤에는 원래 순서를 이어 붙임 (고른 글꼴에 없는 글자, 예: 한글은 다음 글꼴로 그려짐). 값은 sv-font ("" = 자동), 폴더와 상관없이 하나
// 설치 안 된 글꼴은 글자 폭을 재서 가려냄: serif·sans-serif 두 가지와 각각 비교 (Windows Chrome의 기본 monospace가 Consolas라서 monospace와만 비교하면 Consolas가 없다고 잘못 나옴)
const MONO_TAIL = '"Cascadia Code", "Cascadia Mono", Consolas, "D2Coding", "Malgun Gothic", monospace';
const FONT_CHOICES = ["Cascadia Code", "Cascadia Mono", "Consolas", "D2Coding", "monospace"];   // "monospace" = 기본 고정폭
let codeFont = "";
try { codeFont = localStorage.getItem("sv-font") || ""; } catch (e) {}
const fontInstalledCache = {};
function fontInstalled(name) {
  if (name === "monospace") return true;
  if (name in fontInstalledCache) return fontInstalledCache[name];
  let ok = false;
  try {
    const ctx = document.createElement("canvas").getContext("2d"), text = "abcdefghijklmnopqrstuvwxyz0123456789WwMmIil";
    for (const base of ["serif", "sans-serif"]) {
      ctx.font = "72px " + base; const w0 = ctx.measureText(text).width;
      ctx.font = '72px "' + name + '", ' + base; if (ctx.measureText(text).width !== w0) ok = true;
    }
  } catch (e) {}
  return (fontInstalledCache[name] = ok);
}
function applyCodeFont() {   // 기억한 글꼴이 없어졌으면 자동처럼 동작하되 기억한 값은 지우지 않음
  const root = document.documentElement.style;
  if (codeFont && fontInstalled(codeFont)) root.setProperty("--mono", (codeFont === "monospace" ? 'monospace, "Malgun Gothic"' : '"' + codeFont + '", ' + MONO_TAIL));
  else root.removeProperty("--mono");
}
applyCodeFont();
function drawFontSelect() {
  const sel = $("fontSel"); sel.innerHTML = "";
  const add = (value, text, disabled) => { const o = document.createElement("option"); o.value = value; o.textContent = text; o.disabled = !!disabled; sel.appendChild(o); };
  add("", t("fontAuto"));
  for (const name of FONT_CHOICES) {
    const ok = fontInstalled(name);
    add(name, (name === "monospace" ? t("fontGeneric") : name) + (ok ? "" : " (" + t("fontMissing") + ")"), !ok);
  }
  if (codeFont && !FONT_CHOICES.includes(codeFont)) codeFont = "";   // 목록에 없는 값은 버림
  sel.value = codeFont;
}

// 코드 글자 크기 (v0.71.0): 소스·계층 보기·미리 보기 줄의 글자 크기만 바뀜(마크다운 본문과 화면 글자는 그대로). CSS 변수 --code-size를 바꿈. 값은 sv-font-size ("" = 보통 13.5px), 폴더와 상관없이 하나
const FONT_SIZES = [["small", "12px", "fontSizeSmall"], ["", "13.5px", "fontSizeNormal"], ["large", "15.5px", "fontSizeLarge"], ["xlarge", "18px", "fontSizeXLarge"]];
let codeSize = "";
try { codeSize = localStorage.getItem("sv-font-size") || ""; } catch (e) {}
if (!FONT_SIZES.some(z => z[0] === codeSize)) codeSize = "";   // 목록에 없는 값은 보통
function applyCodeSize() {
  const px = FONT_SIZES.find(z => z[0] === codeSize)[1];
  if (codeSize) document.documentElement.style.setProperty("--code-size", px); else document.documentElement.style.removeProperty("--code-size");
}
applyCodeSize();
function drawFontSizeSelect() {
  const sel = $("fontSizeSel"); sel.innerHTML = "";
  for (const [value, , key] of FONT_SIZES) { const o = document.createElement("option"); o.value = value; o.textContent = t(key); sel.appendChild(o); }
  sel.value = codeSize;
}

// 화면 언어에 따라 바뀌는 고정 글자. drawStatic()에서 부름
function drawSettingsStatic() {
  $("settingsBtn").title = t("settingsTitle"); $("settingsBtn").setAttribute("aria-label", t("settingsTitle"));   // 글자 없는 단추라 풍선은 이름만 (Windows처럼)
  $("settingsTitle").textContent = t("settingsTitle");
  $("fontLabel").textContent = t("fontLabel"); drawFontSelect();
  $("fontSizeLabel").textContent = t("fontSizeLabel"); drawFontSizeSelect();
  $("fontLigName").textContent = t("fontLigatures"); $("fontLigDesc").textContent = t("fontLigaturesDesc");
  $("settingsClose").textContent = t("typesClose"); $("settingsClose").title = t("typesCloseTip");
}

// 미리 보기 줄: 켜고 끌 때 바로 달라지는 것을 보여 줌 (합자가 되는 글자들. "<!--"는 스크립트 안에서 쓰지 않으려고 나눠 적음)
$("fontSample").textContent = "a != b  ->  c => d >= e  === " + "<" + "!-- --" + ">";

$("settingsBtn").onclick = () => { $("fontLig").checked = ligatures; $("settingsDlg").showModal(); $("theme").focus({ preventScroll: true }); };
$("fontLig").onchange = () => {
  ligatures = $("fontLig").checked;
  applyLigatures();
  try { localStorage.setItem("sv-ligatures", ligatures ? "1" : "0"); } catch (e) {}
};
wireTableDialog($("settingsDlg"), $("settingsClose"));
$("fontSel").onchange = () => {
  codeFont = $("fontSel").value;
  applyCodeFont();
  try { localStorage.setItem("sv-font", codeFont); } catch (e) {}
};
$("fontSizeSel").onchange = () => {
  codeSize = $("fontSizeSel").value;
  applyCodeSize();
  try { localStorage.setItem("sv-font-size", codeSize); } catch (e) {}
};
