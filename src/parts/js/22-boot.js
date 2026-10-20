// 머리 막대 높이 (창이 좁아 두 줄이 되어도 목록·소스 영역이 맞게)
new ResizeObserver(() => document.body.style.setProperty("--hdr", document.querySelector("header").offsetHeight + "px"))
  .observe(document.querySelector("header"));

(async () => {
  drawStatic();
  if (hasFsa) {
    savedDir = await loadDir();
    if (savedDir) {
      try {
        if ((await savedDir.queryPermission({ mode: "read" })) === "granted") { await openHandle(savedDir, false); return; }
      } catch (e) {}
      showStart("regrant"); return;
    }
  }
  showStart("new");
})();
