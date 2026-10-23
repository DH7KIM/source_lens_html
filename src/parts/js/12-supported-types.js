// ======================= 지원 파일 형식 (머리 막대 단추 + 모달 표 창) =======================
// FILE_TYPES(02-file-kinds.js)를 읽어 그린다. 표를 따로 두지 않아서 파일 종류를 더하면 이 창도 같이 늘어난다.
// 열: 확장자·파일 이름 / 언어 / 설명 / 색칠 / 문법 검사기 / 계층 보기 / 문서 보기. 위쪽 필터 상자로 행을 거른다 (입력한 글자로 시작하는 것만, 설명은 찾지 않음)
const CHECK_NAMES = { ui: ".ui", toml: "TOML", json: "JSON" };   // 문법 검사기 이름 (번역하지 않는 고유 이름)
// 색칠이 되는지: 색칠 규칙 표(RULES)에 있거나 .ui 전용 색칠이면 됨. md는 문서로 그려서 색칠 열에서는 없음으로 보임
// 계층 보기(트리)가 되는지: JSON 계열(json·json5, JSON Lines 포함). 단추가 보이는 조건(isJsonFile)과 같은 기준
const hasTreeView = lang => lang === "json" || lang === "json5";
// 문서 보기(마크다운을 문서 모양으로)가 되는지: md. 문서 보기 단추가 보이는 조건(isMd)과 같은 기준
const hasDocView = lang => lang === "md";
const hasColors = lang => lang === "ui" || !!RULES[LANG_ALIAS[lang] || lang];

// 화면 언어에 따라 바뀌는 고정 글자 (단추·창 제목·필터·닫기). drawStatic()에서 부름
function drawTypesStatic() {
  $("typesBtnName").textContent = t("types"); $("typesBtn").title = t("typesTip");
  $("typesTitle").textContent = t("types");
  $("typesFilter").placeholder = t("typesFilterHint"); $("typesFilter").title = t("typesFilterTip");
  $("typesClose").textContent = t("typesClose"); $("typesClose").title = t("typesCloseTip");
}

function mark(on, label) {   // ✓ / — 는 색만으로 구분하지 않게 글자(있음·없음)를 풍선으로도 알림
  return `<td class="mark${on ? "" : " no"}" title="${esc(t(on ? "typesYes" : "typesNo"))}">${on ? "✓" : "—"}${label ? " " + esc(label) : ""}</td>`;
}

function drawTypesTable() {
  const th = (key, tipKey) => `<th title="${esc(t(tipKey))}">${esc(t(key))}</th>`;
  let h = `<table class="dlg-table types-table"><thead><tr>${th("typesColExt", "typesColExtTip")}${th("typesColLang", "typesColLangTip")}${th("typesColDesc", "typesColDescTip")}${th("typesColColor", "typesColColorTip")}${th("typesColCheck", "typesColCheckTip")}${th("treeTree", "typesColTreeTip")}${th("doc", "typesColDocTip")}</tr></thead><tbody>`;
  const curType = cur ? typeOf(cur) : null;   // 지금 열어 둔 파일의 종류 (없으면 강조 없음)
  for (const ft of FILE_TYPES) {
    const keys = [...(ft.exts || []).map(e => "*." + e), ...(ft.names || [])];
    const find = [...keys.map(k => k.replace(/^\*\./, "")), ...ft.name.split(/[\s/]+/)].join(" ").toLowerCase();   // 필터가 앞부분을 비교하는 낱말들 (확장자는 "*." 없이, 언어 이름은 낱말로 나눔)
    const isCur = ft === curType;
    h += `<tr data-find="${esc(find)}"${isCur ? ` class="current" aria-current="true" title="${esc(t("typesCurrent"))}"` : ""}><td>${keys.map(k => `<code>${esc(k)}</code>`).join(" ")}</td><td>${esc(ft.name)}</td><td class="desc">${esc(t("desc_" + ft.id))}</td>${mark(hasColors(ft.lang))}${mark(!!ft.check, CHECK_NAMES[ft.check])}${mark(hasTreeView(ft.lang))}${mark(hasDocView(ft.lang))}</tr>`;
  }
  $("typesBody").innerHTML = h + `</tbody></table><p class="dlg-none" id="typesNone" hidden></p><p class="dlg-note">${esc(t("typesNote"))}</p>`;
}

// 필터·창 열기·닫기는 공통 부분(11a-dialog-table.js)을 씀. 필터는 확장자·파일 이름·언어 이름의 낱말이 입력한 글로 시작하는 행만 보임
function applyTypesFilter() { filterTableRows($("typesFilter"), $("typesBody"), $("typesNone"), "typesNone"); }

$("typesBtn").onclick = () => openTableDialog($("typesDlg"), $("typesFilter"), $("typesBody"), drawTypesTable);
$("typesFilter").oninput = applyTypesFilter;
wireTableDialog($("typesDlg"), $("typesClose"));
