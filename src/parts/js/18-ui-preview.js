// ======================= .ui 배치 미리보기 =======================
// v0.3.0의 uiCheck.compute()로 위치를 계산해서 아래 칸에 그린다. 글자 너비는 브라우저에서 실제로 잰다.
// 오류가 있으면 uiCheck.recover()("무시"와 같음)로 틀린 요소를 빼고 그린다.
const PV_SIZES = ["640x480", "800x600", "1024x768", "1280x720"], PV_SCALES = [100, 125, 150, 175, 200];
const PV_FONT = '"Segoe UI", system-ui, sans-serif';
let pvCtx = null;
function setPaneH(px, save) {
  const max = Math.max(80, innerHeight - (document.querySelector("header").offsetHeight) - $("fileBar").offsetHeight - 80);
  pvSet.paneH = Math.round(Math.min(max, Math.max(80, px)));
  document.body.style.setProperty("--pv-h", pvSet.paneH + "px");
  if (save) savePv();
}
function drawPreview() {
  hideTooltip();
  const on = !!pvCheck && pvSet.on;
  $("pv").hidden = $("pvSize").hidden = !on;
  document.body.classList.toggle("pv-on", on);
  if (!on) { $("pvStage").innerHTML = ""; return; }
  setPaneH(pvSet.paneH, false);
  const view = pvSet.mode === "view";
  $("pv").classList.toggle("pv-view", view);
  for (const [id, m] of [["pvModeL", "layout"], ["pvModeV", "view"]]) {
    $(id).textContent = t(id); $(id).title = t(id + "Tip"); $(id).setAttribute("aria-pressed", String(pvSet.mode === m));
  }
  // 머리 줄: 창 크기 목록, 너비·높이, 배율
  const sel = $("pvWin");
  sel.innerHTML = [["fit", t("pvFit")], ...PV_SIZES.map(v => [v, v.replace("x", " × ")]), ["custom", t("pvCustom")]]
    .map(([v, l]) => `<option value="${v}"${v === pvSet.win ? " selected" : ""}>${esc(l)}</option>`).join("");
  sel.title = t("pvWinTip");
  $("pvScale").innerHTML = PV_SCALES.map(v => `<option value="${v}"${v === pvSet.scale ? " selected" : ""}>${v}%</option>`).join("");
  $("pvScale").title = t("pvScaleTip");
  $("pvWT").textContent = t("pvW"); $("pvHT").textContent = t("pvH");
  $("pvWL").title = $("pvHL").title = t("pvWHTip");
  $("pvSize").title = t("pvSizeTip");
  const stage = $("pvStage"), fit = pvSet.win === "fit";
  let w = pvSet.w, h = pvSet.h;
  if (fit) { w = Math.max(1, stage.clientWidth - 26); h = Math.max(1, stage.clientHeight - 26); }
  else if (pvSet.win !== "custom") [w, h] = pvSet.win.split("x").map(Number);
  $("pvW").value = w; $("pvH").value = h;
  $("pvW").disabled = $("pvH").disabled = fit;
  // 오류: 복구해서 그림 / 복구할 수 없으면 안내만
  const note = $("pvNote");
  note.textContent = ""; note.className = ""; note.title = "";
  let doc = pvCheck;
  if (doc.errorCount) {
    doc = uiCheck.recover(doc);
    if (!doc) { stage.innerHTML = `<div class="pv-msg">${esc(t("pvCannot"))}</div>`; return; }
    note.textContent = t("pvRecovered", pvCheck.errorCount); note.className = "bad"; note.title = t("pvRecoveredTip");
  }
  // 글꼴: 12px, 줄 높이 16 (96 DPI) × 배율
  const scale = pvSet.scale, fontPx = 12 * scale / 100, lineH = Math.round(16 * scale / 100);
  pvCtx ||= document.createElement("canvas").getContext("2d");
  pvCtx.font = `${fontPx}px ${PV_FONT}`;
  const textWidth = b => Math.ceil(pvCtx.measureText(uiCheck.text(b)).width);
  const rects = uiCheck.compute(doc, w, h, { textWidth, lineHeight: lineH, scale });
  const K = uiCheck.KIND_NAMES;
  pvDoc = doc;
  let html = `<div class="pv-wrap"><div class="pv-win" style="width:${w}px;height:${h}px;font:${fontPx}px/${lineH}px ${esc(PV_FONT)}">`;
  for (let i = 1; i < rects.length; i++) {
    const n = doc.nodes[i], kind = K[n.kind];
    if (n.dropped || !["label", "button", "text_field", "number_field", "menu_button", "checkbox", "canvas", "group", "row", "column"].includes(kind)) continue;
    const r = rects[i], name = uiCheck.text(n.name), txt = esc(uiCheck.text(n.text));
    const tip = t("pvBox", `${kind} ${name}`.trim(), r.x, r.y, r.w, r.h, n.line) + (n.hidden ? " " + t("pvHidden") : "") + (n.disabled ? " " + t("pvDisabled") : "") + "\n" + (!view ? t("pvBoxGo") : kind === "menu_button" ? t("pvDropGo") : "");
    let body = "";
    switch (kind) {
      case "label": body = txt; break;
      case "button": body = txt; break;
      case "menu_button": body = `<span>${txt}</span><span>▾</span>`; break;
      case "text_field": body = `<span class="h">${esc(uiCheck.text(n.placeholder))}</span>`; break;
      case "number_field": body = `<span>${n.hex ? "0x" + n.minValue.toString(16).toUpperCase() : n.minValue}</span><span>⇕</span>`; break;
      case "checkbox": body = `${n.checked ? "☑" : "☐"} ${txt}`; break;
      case "group": case "row": case "column": body = `<span class="tag">${esc(`${kind} ${name}`.trim())}</span>`; break;
    }
    // 보기 모드: 위치 설명 대신 프로그램의 풍선 도움말 (disabled면 disabled_tooltip, 없으면 tooltip; 빈 글·숨긴 요소는 안 보임)
    const tooltip = uiCheck.text(n.disabled && n.disabledTooltip !== null ? n.disabledTooltip : n.tooltip ?? "");
    const attr = !view ? ` title="${esc(tip)}"` : tooltip && !n.hidden ? ` data-tooltip="${esc(tooltip)}"` : "";
    const just = kind === "label" ? ` justify-content:${n.align === "center" ? "center" : n.align === "right" ? "flex-end" : "flex-start"};` : "";
    html += `<div data-i="${i}" data-ln="${n.line}" class="pv-${kind}${n.hidden ? " pv-hidden" : ""}${n.disabled ? " pv-disabled" : ""}${n.line === hlLine ? " pv-cur" : ""}" style="left:${r.x}px;top:${r.y}px;width:${r.w}px;height:${r.h}px;${just}"${attr}>${body}</div>`;
  }
  stage.innerHTML = html + "</div></div>";
  if (view && pvOpen > 0) openMenu(pvOpen); else pvOpen = 0;
}
