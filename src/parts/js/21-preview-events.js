// 표시한 줄(hlLine)의 상자 강조
function markPreview() {
  for (const b of $("pvStage").querySelectorAll(".pv-win > div[data-ln]")) b.classList.toggle("pv-cur", +b.dataset.ln === hlLine);
}
// 상자 클릭 → 소스의 그 줄로 이동 + 강조
$("pvStage").addEventListener("click", e => {
  if (pvSet.mode === "view") {
    if (e.target.closest(".pv-pop")) {   // 항목 클릭 = 메뉴 닫기 (하위 메뉴·흐린 항목은 그대로)
      const it = e.target.closest(".mi");
      if (it && !it.classList.contains("dis") && !it.querySelector(".pv-pop")) closeMenu();
      return;
    }
    const d = e.target.closest(".pv-win > div.pv-menu_button");
    if (d) { if (pvOpen === +d.dataset.i) closeMenu(); else openMenu(+d.dataset.i); }
    return;
  }
  const b = e.target.closest(".pv-win > div[data-ln]");
  if (!b) return;
  const n = +b.dataset.ln, r = $("L" + n);
  if (!r) return;
  for (const x of $("code").querySelectorAll(".r.hl")) x.classList.remove("hl");
  hlLine = n; r.classList.add("hl");
  r.scrollIntoView({ block: "center" });
  setHash(); markPreview();
});
$("pvBtn").onclick = () => { pvSet.on = !pvSet.on; savePv(); drawStatic(); drawPreview(); };
$("pvWin").onchange = () => {
  pvSet.win = $("pvWin").value;
  if (pvSet.win === "custom") { pvSet.w = +$("pvW").value || 640; pvSet.h = +$("pvH").value || 480; }
  savePv(); drawPreview();
};
$("pvScale").onchange = () => { pvSet.scale = +$("pvScale").value || 100; savePv(); drawPreview(); };
for (const id of ["pvW", "pvH"]) $(id).onchange = () => {
  const clampWH = v => Math.min(10000, Math.max(1, Math.round(+v) || 1));
  pvSet.win = "custom"; pvSet.w = clampWH($("pvW").value); pvSet.h = clampWH($("pvH").value);
  savePv(); drawPreview();
};
$("pvSize").addEventListener("pointerdown", e => {
  e.preventDefault();
  const h = $("pvSize"); h.setPointerCapture(e.pointerId);
  document.body.classList.add("resizing-v");
  const move = ev => { setPaneH(innerHeight - ev.clientY - 3, false); if (pvSet.win === "fit") drawPreview(); };
  const up = ev => {
    setPaneH(innerHeight - ev.clientY - 3, true); drawPreview();
    document.body.classList.remove("resizing-v");
    h.removeEventListener("pointermove", move); h.removeEventListener("pointerup", up);
  };
  h.addEventListener("pointermove", move); h.addEventListener("pointerup", up);
});
addEventListener("resize", () => { if (pvCheck && pvSet.on) drawPreview(); });

