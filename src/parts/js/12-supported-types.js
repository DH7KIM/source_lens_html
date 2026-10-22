// ======================= 지원 파일 형식 (머리 막대 단추 + 모달 표 창) =======================
// FILE_TYPES(02-file-kinds.js)를 읽어 그린다. 표를 따로 두지 않아서 파일 종류를 더하면 이 창도 같이 늘어난다.
// 열: 확장자·파일 이름 / 언어 / 색칠 / 문법 검사기. (설명 열은 다음 버전)
const CHECK_NAMES = { ui: ".ui", toml: "TOML", json: "JSON" };   // 문법 검사기 이름 (번역하지 않는 고유 이름)
// 색칠이 되는지: 색칠 규칙 표(RULES)에 있거나 .ui 전용 색칠이면 됨. md는 문서로 그려서 색칠 열에서는 없음으로 보임
const hasColors = lang => lang === "ui" || !!RULES[LANG_ALIAS[lang] || lang];

// 화면 언어에 따라 바뀌는 고정 글자 (단추·창 제목·닫기). drawStatic()에서 부름
function drawTypesStatic() {
  $("typesBtn").textContent = t("types"); $("typesBtn").title = t("typesTip");
  $("typesTitle").textContent = t("types");
  $("typesClose").textContent = t("typesClose"); $("typesClose").title = t("typesCloseTip");
}

function mark(on, label) {   // ✓ / — 는 색만으로 구분하지 않게 글자(있음·없음)를 풍선으로도 알림
  return `<td class="mark${on ? "" : " no"}" title="${esc(t(on ? "typesYes" : "typesNo"))}">${on ? "✓" : "—"}${label ? " " + esc(label) : ""}</td>`;
}

function drawTypesTable() {
  const th = (key, tipKey) => `<th title="${esc(t(tipKey))}">${esc(t(key))}</th>`;
  let h = `<table class="types-table"><thead><tr>${th("typesColExt", "typesColExtTip")}${th("typesColLang", "typesColLangTip")}${th("typesColColor", "typesColColorTip")}${th("typesColCheck", "typesColCheckTip")}</tr></thead><tbody>`;
  for (const ft of FILE_TYPES) {
    const keys = [...(ft.exts || []).map(e => "*." + e), ...(ft.names || [])];
    h += `<tr><td>${keys.map(k => `<code>${esc(k)}</code>`).join("")}</td><td>${esc(ft.name)}</td>${mark(hasColors(ft.lang))}${mark(!!ft.check, CHECK_NAMES[ft.check])}</tr>`;
  }
  $("typesBody").innerHTML = h + `</tbody></table><p class="types-note">${esc(t("typesNote"))}</p>`;
}

$("typesBtn").onclick = () => { drawTypesTable(); $("typesDlg").showModal(); };
$("typesClose").onclick = () => $("typesDlg").close();
$("typesDlg").onclick = e => { if (e.target === $("typesDlg")) $("typesDlg").close(); };   // 창 바깥(어두운 곳)을 누르면 닫음. Esc는 브라우저가 처리
