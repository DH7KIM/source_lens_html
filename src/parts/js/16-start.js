// ======================= 시작 =======================
/// 주소의 #경로, #경로:L12, #경로#제목 → { path, line, hash }
function savedTarget() {
  const raw = decodeURI(location.hash.slice(1));
  if (raw) {
    const [p, h = ""] = raw.split("#");
    const m = p.match(/^(.*):L(\d+)$/);
    return m ? { path: m[1], line: +m[2] } : { path: p, hash: h };
  }
  try { return { path: localStorage.getItem("sv-last:" + KEY) }; } catch (e) { return { path: null }; }
}

async function startWith(target) {
  const n = await refreshList();
  if (!n) { showStart("noFiles"); return; }
  $("folder").hidden = false;
  if (target && target.path && fileSet.has(target.path)) openFile(target.path, { line: target.line || 0, hash: target.hash || "" });
  else openFile(pathFor(orderedKeys()[0], docLang));
}

function db() {
  return new Promise((ok, no) => {
    const r = indexedDB.open("source-viewer", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error);
  });
}
async function saveDir(h) {
  try { const d = await db(); d.transaction("kv", "readwrite").objectStore("kv").put(h, "dir:" + KEY); } catch (e) {}
}
async function loadDir() {
  try {
    const d = await db();
    return await new Promise(ok => { const r = d.transaction("kv").objectStore("kv").get("dir:" + KEY); r.onsuccess = () => ok(r.result || null); r.onerror = () => ok(null); });
  } catch (e) { return null; }
}

const hasFsa = !!window.showDirectoryPicker;
let savedDir = null;

function showStart(kind) {
  $("start").hidden = false; $("out").hidden = true; $("code").hidden = true;
  pvCheck = null; drawPreview();
  $("pick").hidden = !hasFsa; $("pickFiles").hidden = hasFsa;
  $("regrant").hidden = kind !== "regrant";
  $("startMsg").innerHTML = kind === "regrant" ? esc(t("startRegrant", savedDir.name)) : kind === "noFiles" ? esc(t("noFiles")) : t("startNew");
  $("startNote").textContent = hasFsa ? t("noteFsa") : t("noteFallback");
  drawStatic();
}

// 화면 언어에 따라 바뀌는 고정 글자
function drawStatic() {
  $("pick").textContent = t("pick"); $("regrant").textContent = t("regrant"); $("pickFiles").textContent = t("pickFiles");
  $("folder").textContent = t("folder"); $("folder").title = t("folderTip");
  $("navSize").title = t("navSizeTip");
  const md = cur && isMd(cur);
  $("mdMode").hidden = !md;
  const ui = cur && langOf(cur) === "ui";
  const diagOk = ui || (cur && isTomlFile(cur));   // 오류 설명 켜기/끄기: .ui와 toml
  $("diagBtn").hidden = !diagOk;
  if (diagOk) { $("diagBtn").textContent = showDiag ? t("diagOff") : t("diagOn"); $("diagBtn").title = t("diagTip"); }
  $("pvBtn").hidden = !ui;
  if (ui) { $("pvBtn").textContent = pvSet.on ? t("pvOff") : t("pvOn"); $("pvBtn").title = t("pvTip"); }
  if (md) { $("mdMode").textContent = mdRaw ? t("doc") : t("raw"); $("mdMode").title = mdRaw ? t("docTip") : t("rawTip"); }
  $("code").dataset.tip = t("noTip");
  drawThemes();
}
// 줄 번호 풍선 도움말: 마우스가 올라간 줄 번호에만 넣는다
$("code").addEventListener("mouseover", e => { const no = e.target.closest(".no"); if (no && !no.title) no.title = $("code").dataset.tip; });

async function pickFolder() {
  if (hasFsa) {
    try {
      const h = await showDirectoryPicker({ id: "source-viewer", mode: "read" });
      savedDir = h; useHandle(h); await saveDir(h); await startWith(savedTarget());
    } catch (e) {}
  } else {
    $("dirInput").click();
  }
}
$("pick").onclick = pickFolder;
$("pickFiles").onclick = pickFolder;
$("folder").onclick = pickFolder;
$("dirInput").onchange = async () => { if ($("dirInput").files.length) { useFiles($("dirInput").files); await startWith(savedTarget()); } };
$("regrant").onclick = async () => {
  try {
    if ((await savedDir.requestPermission({ mode: "read" })) === "granted") { useHandle(savedDir); await startWith(savedTarget()); }
  } catch (e) { showStart("new"); }
};

// 폴더를 끌어다 놓기
addEventListener("dragover", e => { e.preventDefault(); document.body.classList.add("dragging"); });
addEventListener("dragleave", e => { if (!e.relatedTarget) document.body.classList.remove("dragging"); });
addEventListener("drop", async e => {
  e.preventDefault(); document.body.classList.remove("dragging");
  const item = e.dataTransfer.items && e.dataTransfer.items[0];
  if (item && item.getAsFileSystemHandle) {
    try {
      const h = await item.getAsFileSystemHandle();
      if (h && h.kind === "directory") { savedDir = h; useHandle(h); await saveDir(h); await startWith(savedTarget()); }
    } catch (er) {}
  }
});

