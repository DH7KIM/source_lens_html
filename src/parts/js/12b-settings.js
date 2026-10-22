// ======================= 설정 (머리 막대 톱니 단추 + 설정 창) =======================
// 지금은 테마(v0.64.0에서 머리 막대에서 옮김, 선택 상자 #theme과 그 동작은 17-themes.js)와 합자(ligature) 켜기/끄기. 하위 단계·글꼴 고르기·글자 크기는 이 창에 다음 버전들에서 더함. 창 닫기는 공통 부분(11a-dialog-table.js)을 씀
// 합자: 코드 글꼴이 `->`·`!=`·`=>` 같은 글자를 한 모양으로 합쳐 그리는 것. 기본은 끔(소스를 글자 그대로 보여 줌). 값은 sv-ligatures ("1" = 켬), 폴더와 상관없이 하나
let ligatures = false;
try { ligatures = localStorage.getItem("sv-ligatures") === "1"; } catch (e) {}
function applyLigatures() { document.body.classList.toggle("ligatures", ligatures); }   // CSS의 --lig 변수가 바뀜 (01-style.css)
applyLigatures();

// 화면 언어에 따라 바뀌는 고정 글자. drawStatic()에서 부름
function drawSettingsStatic() {
  $("settingsBtn").title = t("settingsTip"); $("settingsBtn").setAttribute("aria-label", t("settingsTitle"));
  $("settingsTitle").textContent = t("settingsTitle");
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
