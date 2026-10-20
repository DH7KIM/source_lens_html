// ---------- 보기 모드: menu_button → menu 펼치기 (보기만, 클릭으로 radio·checkbox를 바꾸지 않음) ----------
// menu 노드 → 풀다운 HTML. 안쪽 menu는 하위 메뉴(마우스를 올리면 오른쪽에 펼침)
function menuHtml(doc, mi, depth) {
  const m = doc.nodes[mi];
  let h = `<div class="pv-pop">`, any = false;
  for (const c of m.children) {
    const n = doc.nodes[c], kind = uiCheck.KIND_NAMES[n.kind];
    if (n.dropped || n.hidden) continue;
    if (kind === "separator") { h += `<div class="sep" title="${esc(t("pvItem", "separator", n.line))}"></div>`; continue; }
    if (kind !== "menu_item" && kind !== "menu") continue;
    any = true;
    const sub = kind === "menu" && depth < 8;
    const mark = n.checked ? (n.radio ? "●" : "✓") : "";
    const tip = t("pvItem", `${kind} ${uiCheck.text(n.name)}`.trim(), n.line) + (n.disabled ? " " + t("pvDisabled") : "");
    h += `<div class="mi${n.disabled ? " dis" : ""}" title="${esc(tip)}"><span class="mk">${mark}</span><span class="tx">${esc(uiCheck.text(n.text) || uiCheck.text(n.name))}</span>`
      + (sub ? `<span class="ar">▸</span>${menuHtml(doc, c, depth + 1)}` : "") + `</div>`;
  }
  if (!any) h += `<div class="mi dis"><span class="mk"></span><span class="tx">${esc(t("pvEmpty"))}</span></div>`;
  return h + `</div>`;
}
function closeMenu() {
  pvOpen = 0;
  for (const x of $("pvStage").querySelectorAll(".pv-wrap > .pv-pop")) x.remove();
  for (const x of $("pvStage").querySelectorAll(".pv-open")) x.classList.remove("pv-open");
}
function openMenu(i) {
  closeMenu();
  const b = $("pvStage").querySelector(`.pv-win > div[data-i="${i}"]`), n = pvDoc && pvDoc.nodes[i];
  if (!b || !n) return;
  pvOpen = i; b.classList.add("pv-open");
  const win = b.parentElement, x = b.offsetLeft + win.clientLeft, y = b.offsetTop + b.offsetHeight + win.clientTop;
  const wrap = win.parentElement, tmp = document.createElement("div");
  tmp.innerHTML = n.menu > 0 && pvDoc.nodes[n.menu] ? menuHtml(pvDoc, n.menu, 0) : `<div class="pv-pop"><div class="mi dis"><span class="mk"></span><span class="tx">${esc(t("pvNoMenu"))}</span></div></div>`;
  const pop = tmp.firstElementChild;
  pop.style.left = x + "px"; pop.style.top = y + "px"; pop.style.font = win.style.font;
  pop.style.minWidth = b.offsetWidth + "px";
  wrap.appendChild(pop);
}
for (const id of ["pvModeL", "pvModeV"]) $(id).onclick = () => { pvSet.mode = $(id).dataset.m; savePv(); closeMenu(); drawPreview(); };
addEventListener("keydown", e => { if (e.key === "Escape" && pvOpen) closeMenu(); });
document.addEventListener("pointerdown", e => {
  if (pvOpen && !e.target.closest(".pv-pop") && !e.target.closest(".pv-open")) closeMenu();
}, true);
