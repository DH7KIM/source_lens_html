// ======================= 지원 파일 형식 (머리 막대 단추 + 모달 표 창) =======================
// FILE_TYPES(02-file-kinds.js)를 읽어 그린다. 표를 따로 두지 않아서 파일 종류를 더하면 이 창도 같이 늘어난다.
// 열: 확장자·파일 이름 / 언어 / 설명 / 색칠 / 문법 검사기. 위쪽 필터 상자로 행을 거른다 (입력한 글자로 시작하는 것만, 설명은 찾지 않음)
const CHECK_NAMES = { ui: ".ui", toml: "TOML", json: "JSON" };   // 문법 검사기 이름 (번역하지 않는 고유 이름)
// 색칠이 되는지: 색칠 규칙 표(RULES)에 있거나 .ui 전용 색칠이면 됨. md는 문서로 그려서 색칠 열에서는 없음으로 보임
const hasColors = lang => lang === "ui" || !!RULES[LANG_ALIAS[lang] || lang];

// 화면 언어에 따라 바뀌는 고정 글자 (단추·창 제목·필터·닫기). drawStatic()에서 부름
function drawTypesStatic() {
  $("typesBtn").textContent = t("types"); $("typesBtn").title = t("typesTip");
  $("typesTitle").textContent = t("types");
  $("typesFilter").placeholder = t("typesFilterHint"); $("typesFilter").title = t("typesFilterTip");
  $("typesClose").textContent = t("typesClose"); $("typesClose").title = t("typesCloseTip");
}

function mark(on, label) {   // ✓ / — 는 색만으로 구분하지 않게 글자(있음·없음)를 풍선으로도 알림
  return `<td class="mark${on ? "" : " no"}" title="${esc(t(on ? "typesYes" : "typesNo"))}">${on ? "✓" : "—"}${label ? " " + esc(label) : ""}</td>`;
}

function drawTypesTable() {
  const th = (key, tipKey) => `<th title="${esc(t(tipKey))}">${esc(t(key))}</th>`;
  let h = `<table class="types-table"><thead><tr>${th("typesColExt", "typesColExtTip")}${th("typesColLang", "typesColLangTip")}${th("typesColDesc", "typesColDescTip")}${th("typesColColor", "typesColColorTip")}${th("typesColCheck", "typesColCheckTip")}</tr></thead><tbody>`;
  for (const ft of FILE_TYPES) {
    const keys = [...(ft.exts || []).map(e => "*." + e), ...(ft.names || [])];
    const find = [...keys.map(k => k.replace(/^\*\./, "")), ...ft.name.split(/[\s/]+/)].join(" ").toLowerCase();   // 필터가 앞부분을 비교하는 낱말들 (확장자는 "*." 없이, 언어 이름은 낱말로 나눔)
    h += `<tr data-find="${esc(find)}"><td>${keys.map(k => `<code>${esc(k)}</code>`).join(" ")}</td><td>${esc(ft.name)}</td><td class="desc">${esc(t("desc_" + ft.id))}</td>${mark(hasColors(ft.lang))}${mark(!!ft.check, CHECK_NAMES[ft.check])}</tr>`;
  }
  $("typesBody").innerHTML = h + `</tbody></table><p class="types-none" id="typesNone" hidden></p><p class="types-note">${esc(t("typesNote"))}</p>`;
}

// 필터: 확장자·파일 이름·언어 이름의 낱말이 입력한 글로 시작하는 행만 보임. "py"·".py"·"*.py"·"Makefile"·"C++" 모두 같은 방식 (대소문자 구분 없음)
// 글자가 중간에 들어 있는 것은 맞추지 않음: "py"가 "copying"(License)에 맞으면 ".py 지원 여부" 확인이 틀려짐
function applyTypesFilter() {
  const raw = $("typesFilter").value.trim();
  const q = raw.toLowerCase().replace(/^[*.]+/, "");
  let shown = 0;
  for (const tr of $("typesBody").querySelectorAll("tbody tr")) {
    const ok = !q || tr.dataset.find.split(" ").some(w => w.startsWith(q));
    tr.hidden = !ok;
    if (ok) shown++;
  }
  const none = $("typesNone");
  none.hidden = shown > 0;   // 맞는 행이 없으면 "지원하지 않는 형식"이라고 알림
  if (!none.hidden) none.textContent = t("typesNone", raw);
}

$("typesBtn").onclick = () => {
  $("typesFilter").value = "";   // 열 때마다 처음부터
  drawTypesTable();
  $("typesDlg").showModal();
  $("typesFilter").focus();
};
$("typesFilter").oninput = applyTypesFilter;
$("typesClose").onclick = () => $("typesDlg").close();
$("typesDlg").onclick = e => { if (e.target === $("typesDlg")) $("typesDlg").close(); };   // 창 바깥(어두운 곳)을 누르면 닫음. Esc는 브라우저가 처리
