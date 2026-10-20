// ---------- 보기 모드: 풍선 도움말 (프로그램처럼 0.5초 뒤 커서 아래에, 상자를 떠나면 닫힘) ----------
const TOOLTIP_DELAY = 500;
let tooltipTimer = 0, tooltipBox = null, tooltipX = 0, tooltipY = 0;
function hideTooltip() {
  clearTimeout(tooltipTimer); tooltipTimer = 0; tooltipBox = null;
  $("pvTooltip").hidden = true;
}
function showTooltip() {
  tooltipTimer = 0;
  if (!tooltipBox || !tooltipBox.isConnected || pvOpen) return;
  const tt = $("pvTooltip");
  tt.textContent = tooltipBox.dataset.tooltip;
  tt.style.font = tooltipBox.parentElement.style.font;
  tt.hidden = false;
  const w = tt.offsetWidth, h = tt.offsetHeight;
  let x = tooltipX, y = tooltipY + 20;                         // 커서 아래 (커서 높이만큼)
  if (x + w > innerWidth - 4) x = Math.max(4, innerWidth - 4 - w);
  if (y + h > innerHeight - 4) y = Math.max(4, tooltipY - h - 4); // 아래가 모자라면 커서 위로
  tt.style.left = x + "px"; tt.style.top = y + "px";
}
$("pvStage").addEventListener("mouseover", e => {
  if (pvSet.mode !== "view") return;
  const b = e.target.closest(".pv-win > div[data-tooltip]");
  if (b === tooltipBox) return;
  hideTooltip();
  if (!b) return;
  tooltipBox = b; tooltipX = e.clientX; tooltipY = e.clientY;
  tooltipTimer = setTimeout(showTooltip, TOOLTIP_DELAY);
});
$("pvStage").addEventListener("mousemove", e => { if (tooltipTimer) { tooltipX = e.clientX; tooltipY = e.clientY; } });
$("pvStage").addEventListener("mouseleave", hideTooltip);
$("pvStage").addEventListener("scroll", hideTooltip);
addEventListener("pointerdown", hideTooltip, true);
addEventListener("wheel", hideTooltip, { capture: true, passive: true });
addEventListener("keydown", e => { if (e.key === "Escape") hideTooltip(); });
addEventListener("blur", hideTooltip);
