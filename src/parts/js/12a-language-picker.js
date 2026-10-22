// ======================= 언어 선택 (머리 막대 단추 + 모달 표 창) =======================
// 단추: 지구본 아이콘 + 지금 문서 언어의 자기 이름 (예: 한국어). 누르면 표 창이 열림. 창 틀·필터·열기·닫기는 공통 부분(11a-dialog-table.js)을 씀
// 열: 이름(지금 화면 언어로, Intl.DisplayNames) / 원래 이름(그 언어 자신의 이름, LANG_NAMES) / 코드. 행을 누르면 문서·화면 언어가 같이 바뀜
const DISPLAY_CODE = { "zh-cn": "zh-Hans", "zh-tw": "zh-Hant" };   // 중국어는 간체·번체로 보이게 (zh-cn은 그냥 두면 "중국어(중국)"로 나옴)

function langName(l) { return LANG_NAMES[l] || l; }   // 그 언어 자신의 이름, 이름 표에 없는 코드는 코드 그대로

// 목록 = 내장 화면 언어(UI)와 연 폴더의 문서 언어(이름.<코드>.md)를 합쳐 항상 모두. 순서는 LANG_NAMES 표의 순서, 표에 없는 코드는 그 뒤에 코드 순
function langList() {
  const all = new Set(Object.keys(UI));
  for (const e of entries.values()) if (e.md) for (const l of Object.keys(e.md)) all.add(l);
  const known = Object.keys(LANG_NAMES);
  const pos = l => known.indexOf(l) < 0 ? 1e3 : known.indexOf(l);
  return [...all].sort((a, b) => pos(a) - pos(b) || a.localeCompare(b));
}

// 단추 글자·풍선. 문서 언어가 바뀌거나 폴더를 열 때마다 부름 (drawLangs)
function drawLangs() {
  const name = langName(docLang);
  $("langBtnName").textContent = name;
  $("langBtn").title = t("langTip");
  $("langBtn").setAttribute("aria-label", t("langTitle") + ": " + name);
}

// 화면 언어에 따라 바뀌는 고정 글자 (창 제목·필터·닫기). drawStatic()에서 부름
function drawLangStatic() {
  $("langTitle").textContent = t("langTitle");
  $("langFilter").placeholder = t("langFilterHint"); $("langFilter").title = t("langFilterTip");
  $("langClose").textContent = t("typesClose"); $("langClose").title = t("typesCloseTip");
}

function drawLangTable() {
  let dn = null;
  try { dn = new Intl.DisplayNames([uiLang], { type: "language" }); } catch (e) {}   // 못 쓰는 브라우저면 이름 열에 원래 이름을 보임
  const nameIn = l => {   // 지금 화면 언어로 된 이름. 코드 그대로 돌아오면(모르는 코드) 원래 이름으로
    try { const n = dn && dn.of(DISPLAY_CODE[l] || l); if (n && n.toLowerCase() !== l.toLowerCase()) return n; } catch (e) {}
    return langName(l);
  };
  const words = s => s.split(/[\s()（）]+/);   // "중국어(간체)" → 중국어, 간체 (필터가 낱말 앞부분을 비교)
  let h = `<table class="dlg-table lang-table"><thead><tr><th>${esc(t("langColName"))}</th><th>${esc(t("langColOwn"))}</th><th>${esc(t("langColCode"))}</th></tr></thead><tbody>`;
  for (const l of langList()) {
    const name = nameIn(l), own = langName(l);
    const find = [...words(name), ...words(own), l].join(" ").toLowerCase();
    const isCur = l === docLang;
    h += `<tr data-code="${esc(l)}" data-find="${esc(find)}" tabindex="0"${isCur ? ` class="current" aria-current="true" title="${esc(t("langCurrent"))}"` : ""}><td>${esc(name)}</td><td lang="${esc(l)}">${esc(own)}</td><td><code>${esc(l)}</code></td></tr>`;
  }
  $("langBody").innerHTML = h + `</tbody></table><p class="dlg-none" id="langNone" hidden></p>`;
}

function chooseLang(l) {
  $("langDlg").close();
  if (l === docLang) return;
  try { localStorage.setItem("sv-lang", l); } catch (e) {}   // 직접 고른 때만 기억
  setLanguage(l);
}

$("langBtn").onclick = () => openTableDialog($("langDlg"), $("langFilter"), $("langBody"), drawLangTable);
$("langFilter").oninput = () => filterTableRows($("langFilter"), $("langBody"), $("langNone"), "langNone");
$("langFilter").onkeydown = e => {   // 필터로 한 행만 남았을 때 Enter로 고름
  if (e.key !== "Enter") return;
  const rows = $("langBody").querySelectorAll("tbody tr:not([hidden])");
  if (rows.length === 1) { e.preventDefault(); chooseLang(rows[0].dataset.code); }
};
$("langBody").onclick = e => { const tr = e.target.closest("tr[data-code]"); if (tr) chooseLang(tr.dataset.code); };
$("langBody").onkeydown = e => {   // 행에 초점이 있을 때 Enter·Space로 고름
  if ((e.key === "Enter" || e.key === " ") && e.target.matches("tr[data-code]")) { e.preventDefault(); chooseLang(e.target.dataset.code); }
};
wireTableDialog($("langDlg"), $("langClose"));
