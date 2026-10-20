// ---------- 목록 폭 (끌어서 조절, 두 번 클릭 = 이름에 맞춤, 브라우저에 기억) ----------
let navWidthSaved = false;
function setNavWidth(px, save) {
  const w = Math.round(Math.min(Math.max(px, 140), innerWidth * 0.6));
  document.body.style.setProperty("--nav-w", w + "px"); // <html>의 style은 테마가 바꾸므로 body에
  if (save) { navWidthSaved = true; try { localStorage.setItem("sv-nav-w:" + KEY, String(w)); } catch (e) {} }
}
function fitNav() {
  let max = 0;
  for (const a of $("nav").querySelectorAll("a, .dir")) {
    a.style.width = "max-content";
    max = Math.max(max, a.getBoundingClientRect().width);
    a.style.width = "";
  }
  const nav = $("nav"), cs = getComputedStyle(nav);
  const extra = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth)
              + (nav.offsetWidth - nav.clientWidth - parseFloat(cs.borderRightWidth));
  if (max) setNavWidth(Math.ceil(max + extra + 2), false);
}
try { const w = +localStorage.getItem("sv-nav-w:" + KEY); if (w > 0) { navWidthSaved = true; setNavWidth(w, false); } } catch (e) {}
$("navSize").addEventListener("pointerdown", e => {
  e.preventDefault();
  const h = $("navSize"); h.setPointerCapture(e.pointerId);
  const left = $("nav").getBoundingClientRect().left;
  document.body.classList.add("resizing");
  const move = ev => setNavWidth(ev.clientX - left, false);
  const up = ev => {
    setNavWidth(ev.clientX - left, true);
    document.body.classList.remove("resizing");
    h.removeEventListener("pointermove", move); h.removeEventListener("pointerup", up);
  };
  h.addEventListener("pointermove", move); h.addEventListener("pointerup", up);
});
$("navSize").addEventListener("dblclick", () => {
  navWidthSaved = false;
  try { localStorage.removeItem("sv-nav-w:" + KEY); } catch (e) {}
  fitNav();
});

function drawLangs() {
  const all = new Set();
  for (const e of entries.values()) if (e.md) for (const l of Object.keys(e.md)) all.add(l);
  const box = $("langs");
  box.innerHTML = "";
  if (all.size < 2) return;
  for (const l of [...all].sort((a, b) => (a === "ko" ? -1 : b === "ko" ? 1 : a.localeCompare(b)))) {
    const b = document.createElement("button");
    b.textContent = LANG_NAMES[l] || l;
    b.title = t("langTip");
    b.className = l === docLang ? "on" : "";
    b.onclick = async () => {
      docLang = l;
      if (UI[l]) uiLang = l;
      if (cur && isMd(cur)) openFile(pathFor(keyOf(cur), l));
      else if (cur && (langOf(cur) === "ui" || isTomlFile(cur) || (await loadBuildLog()).files.has(cur))) openFile(cur, { keepScroll: true });   // 진단 설명도 그 언어로
      else { drawNav(); drawLangs(); drawStatic(); drawPreview(); }
    };
    box.append(b);
  }
}

// a/b/c.md 기준으로 상대 경로 풀기
function resolve(fromPath, href) {
  const parts = fromPath.split("/"); parts.pop();
  for (const seg of href.split("/")) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") parts.pop(); else parts.push(seg);
  }
  return parts.join("/");
}

/// 파일 → 글. UTF-8이 아니면 EUC-KR(CP949), BOM이 있으면 UTF-16
/// .ui는 UTF-8로만 읽는다 (형식이 UTF-8만 허용). 틀린 바이트는 �로 보이고 검사기가 E004로 알린다.
async function readText(f, utf8Only = false) {
  const b = new Uint8Array(await f.arrayBuffer());
  let text, enc;
  if (b[0] === 0xFF && b[1] === 0xFE) { text = new TextDecoder("utf-16le").decode(b); enc = "UTF-16"; }
  else if (b[0] === 0xFE && b[1] === 0xFF) { text = new TextDecoder("utf-16be").decode(b); enc = "UTF-16"; }
  else {
    try { text = new TextDecoder("utf-8", { fatal: true }).decode(b); enc = "UTF-8"; }
    catch (e) {
      if (utf8Only) { text = new TextDecoder("utf-8").decode(b); enc = "UTF-8 (!)"; }
      else { text = new TextDecoder("euc-kr").decode(b); enc = "EUC-KR"; }
    }
  }
  // .ui는 검사기와 같게 CRLF만 LF로 (줄 번호가 맞게)
  return { text: text.replace(/^\uFEFF/, "").replace(utf8Only ? /\r\n/g : /\r\n?/g, "\n"), enc, size: b.length, bytes: b };
}

const fmtSize = n => n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(1) + " MB";

function setState(text, err = false) { $("state").textContent = text; $("state").className = "state" + (err ? " err" : ""); }

