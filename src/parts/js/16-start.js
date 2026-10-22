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

// 목록을 읽고 파일을 엶. 읽는 도중 취소하면 undo()로 읽기 전 상태로 돌려놓고 false (목록·열어 둔 파일은 그대로)
async function startWith(target, undo = () => {}) {
  let n;
  try { n = await refreshList(true); }
  catch (e) {
    if (e && e.name === "AbortError") { undo(); if (!src) showStart(savedDir ? "regrant" : "new"); return false; }
    throw e;
  }
  if (!n) { showStart("noFiles"); return true; }
  $("folder").hidden = false; $("depth").hidden = false;
  if (target && target.path && fileSet.has(target.path)) openFile(target.path, { line: target.line || 0, hash: target.hash || "" });
  else openFile(pathFor(orderedKeys()[0], docLang));
  return true;
}

// 폴더 핸들을 열고 읽음. 취소하면 열기 전 상태(폴더·저장된 핸들)로 돌아감. 읽기가 끝난 뒤에만 핸들을 저장
async function openHandle(h, save) {
  const before = { src, savedDir };
  savedDir = h; useHandle(h);
  const ok = await startWith(savedTarget(), () => { src = before.src; savedDir = before.savedDir; });
  if (ok && save) await saveDir(h);
  return ok;
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

let startKind = "";   // 시작 화면 종류 (언어를 바꿀 때 다시 그리려고 기억)
function showStart(kind) {
  startKind = kind;
  $("start").hidden = false; $("out").hidden = true; $("code").hidden = true; $("fileBar").hidden = true; document.body.classList.remove("has-bar");
  pvCheck = null; drawPreview();
  $("pick").hidden = !hasFsa; $("pickFiles").hidden = hasFsa;
  $("regrant").hidden = kind !== "regrant";
  $("startMsg").innerHTML = kind === "regrant" ? esc(t("startRegrant", savedDir.name)) : kind === "noFiles" ? esc(t("noFiles")) : t("startNew");
  $("startNote").textContent = hasFsa ? t("noteFsa") : t("noteFallback");
  drawLangs(); drawStatic();
}

// 화면 언어에 따라 바뀌는 고정 글자
function drawStatic() {
  drawTypesStatic(); drawLangStatic();
  $("readCancel").textContent = t("readCancel"); $("readCancel").title = t("readCancelTip");
  $("pick").textContent = t("pick"); $("regrant").textContent = t("regrant"); $("pickFiles").textContent = t("pickFiles");
  $("folder").textContent = t("folder"); $("folder").title = t("folderTip");
  const ds = $("depth"); ds.innerHTML = "";   // 하위 폴더 단계 선택 (폴더 전체에 적용되는 설정이라 머리 막대에 둠)
  for (const d of DEPTHS) {
    const o = document.createElement("option");
    o.value = String(d); o.textContent = d ? t("depthN", d) : t("depthAll");
    if (!d) o.title = t("depthTipAll");
    ds.appendChild(o);
  }
  ds.value = String(maxDepth); ds.title = maxDepth === 0 ? t("depthTipAll") : t("depthTip");
  $("navSize").title = t("navSizeTip");
  const md = cur && isMd(cur);
  $("mdMode").hidden = !md;
  const jl = cur && (langOf(cur) === "json" || langOf(cur) === "json5");
  $("treeMode").hidden = !jl;
  if (jl) {   // 소스 보기 | 계층 보기: 지금 보는 쪽이 눌린 모양
    $("treeSrc").textContent = t("treeSrc"); $("treeSrc").title = t("treeSrcTip"); $("treeSrc").setAttribute("aria-pressed", String(!treeShown));
    $("treeTree").textContent = t("treeTree"); $("treeTree").title = t("treeTreeTip"); $("treeTree").setAttribute("aria-pressed", String(treeShown));
  }
  $("jsonSyntax").hidden = !jl;
  if (jl) {   // 문법 고르기: 자동(지금까지처럼) / JSON / JSON5 / JSON Lines
    const js = $("jsonSyntax"); js.innerHTML = "";
    for (const k of JSON_SYNTAXES) {
      const o = document.createElement("option");
      o.value = k; o.textContent = t("syntaxN", t("syntax_" + k)); o.title = t("syntaxTip_" + k);
      js.appendChild(o);
    }
    js.value = jsonSyntax; js.title = t("syntaxTip");
  }
  const ui = cur && langOf(cur) === "ui";
  const diagOk = ui || (cur && (isTomlFile(cur) || isJsonFile(cur)));   // 오류 설명 켜기/끄기: .ui, toml, json
  $("diagBtn").hidden = !diagOk;
  if (diagOk) { $("diagBtn").textContent = showDiag ? t("diagOff") : t("diagOn"); $("diagBtn").title = t("diagTip"); }
  const wrapOk = !!cur && !$("code").hidden && !treeShown;   // 소스 보기(계층 보기·문서 보기가 아닐 때)
  $("wrapBtn").hidden = !wrapOk;
  $("code").classList.toggle("wrap", wrapOk && wrapLines);
  if (wrapOk) { $("wrapBtn").textContent = t("wrap"); $("wrapBtn").title = t("wrapTip"); $("wrapBtn").setAttribute("aria-pressed", String(wrapLines)); }
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
      await openHandle(h, true);
    } catch (e) {}
  } else {
    $("dirInput").click();
  }
}
$("pick").onclick = pickFolder;
$("pickFiles").onclick = pickFolder;
$("folder").onclick = pickFolder;
$("depth").onchange = async () => {   // 단계를 바꾸면 기억하고 목록을 다시 읽음 (열어 둔 파일이 아직 있으면 그대로)
  const prevDepth = maxDepth;
  maxDepth = +$("depth").value;
  try { localStorage.setItem("sv-depth:" + KEY, String(maxDepth)); } catch (e) {}
  drawStatic();
  if (src) await startWith({ path: cur }, () => {   // 읽다가 취소하면 단계도 전으로
    maxDepth = prevDepth;
    try { localStorage.setItem("sv-depth:" + KEY, String(maxDepth)); } catch (e) {}
    drawStatic();
  });
};
$("readCancel").onclick = () => { if (reading) reading.cancel(); };
$("dirInput").onchange = async () => { if ($("dirInput").files.length) { useFiles($("dirInput").files); await startWith(savedTarget()); } };
$("regrant").onclick = async () => {
  try {
    if ((await savedDir.requestPermission({ mode: "read" })) === "granted") await openHandle(savedDir, false);
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
      if (h && h.kind === "directory") await openHandle(h, true);
    } catch (er) {}
  }
});

