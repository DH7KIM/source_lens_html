// ---------- 트리 목록 (폴더 접기·펼치기, 접은 폴더는 브라우저에 기억) ----------
// 각 폴더 안의 순서: README·CHANGELOG → 하위 폴더 → 그 밖의 파일 (이름순)
let closed = new Set();  // 접은 폴더 경로 ("src/", "src/ui/")
try { closed = new Set(JSON.parse(localStorage.getItem("sv-closed:" + KEY) || "[]")); } catch (e) {}
function saveClosed() { try { localStorage.setItem("sv-closed:" + KEY, JSON.stringify([...closed])); } catch (e) {} }
/// 이 파일이 들어 있는 폴더를 모두 펼침
function expandTo(path) {
  const parts = path.split("/");
  let changed = false;
  for (let k = 1; k < parts.length; k++) if (closed.delete(parts.slice(0, k).join("/") + "/")) changed = true;
  if (changed) saveClosed();
}

function buildTree() {
  const root = { dirs: new Map(), files: [] };
  for (const key of entries.keys()) {
    const parts = key.split("/");
    let n = root;
    for (let k = 0; k < parts.length - 1; k++) {
      if (!n.dirs.has(parts[k])) n.dirs.set(parts[k], { dirs: new Map(), files: [] });
      n = n.dirs.get(parts[k]);
    }
    n.files.push(key);
  }
  return root;
}

const ICON_CHEVRON = '<svg class="tw" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_FOLDER = '<svg class="fi" viewBox="0 0 16 16" aria-hidden="true"><path d="M1.75 3.25h4.1l1.5 1.6h6.9v8.4H1.75z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';

/// 줄 앞에 연결선 칸을 붙임 (칸: "" 빈칸, v │, t ├, l └)
function guides(el, list, isFile) {
  list.forEach((c, k) => {
    if (!c) return;
    const s = document.createElement("span");
    s.className = "g " + c + (isFile ? " f" : "");
    s.style.setProperty("--k", k);
    el.prepend(s);
  });
}

function drawNav() {
  const nav = $("nav");
  const top = nav.scrollTop;
  nav.innerHTML = "";
  const fileRank = k => { const n = k.slice(k.lastIndexOf("/") + 1); return /^readme\.md$/i.test(n) ? 0 : /^changelog\.md$/i.test(n) ? 1 : 2; };
  const fileRow = (key, depth) => {
    const p = pathFor(key, docLang);
    const a = document.createElement("a");
    a.style.setProperty("--d", depth);
    const dot = document.createElement("span");
    dot.className = "dot " + langOf(p);
    a.append(dot, key.slice(key.lastIndexOf("/") + 1));
    if (isMd(p)) {
      const lang = splitLang(p).lang;
      if (lang !== docLang) { const s = document.createElement("span"); s.className = "alt"; s.textContent = lang; a.append(s); }
    }
    a.title = p;
    if (p === cur) a.className = "cur";
    a.onclick = () => openFile(p);
    nav.append(a);
  };
  const walk = (node, prefix, depth, trail) => {
    const files = node.files.sort((a, b) => fileRank(a) - fileRank(b) || a.localeCompare(b));
    const kids = [...files.filter(f => fileRank(f) < 2).map(f => ({ f })),
                  ...[...node.dirs].sort((a, b) => a[0].localeCompare(b[0])).map(([name, sub]) => ({ name, sub })),
                  ...files.filter(f => fileRank(f) === 2).map(f => ({ f }))];
    kids.forEach((kid, i) => {
      const last = i === kids.length - 1;
      // 연결선: 위 칸들은 그 조상 폴더 뒤에 형제가 있으면 │, 마지막 칸은 ├ (마지막 항목이면 └)
      const g = depth ? [...trail.map(l => l ? "" : "v"), last ? "l" : "t"] : [];
      if (kid.f) { fileRow(kid.f, depth); guides(nav.lastChild, g, true); return; }
      const path = prefix + kid.name + "/";
      const open = !closed.has(path);
      const d = document.createElement("div");
      d.className = "dir" + (open ? " open" : "") + (!open && cur && cur.startsWith(path) ? " has-cur" : "");
      d.style.setProperty("--d", depth);
      d.innerHTML = ICON_CHEVRON + ICON_FOLDER;
      d.append(kid.name);
      d.title = path + "\n" + t("dirTip");
      d.onclick = () => { if (open) closed.add(path); else closed.delete(path); saveClosed(); drawNav(); };
      nav.append(d);
      guides(d, g, false);
      if (open) walk(kid.sub, path, depth + 1, depth ? [...trail, last] : []);
    });
  };
  walk(buildTree(), "", 0, []);
  nav.hidden = false;
  $("navSize").hidden = false;
  nav.scrollTop = top;
  if (!navWidthSaved) fitNav();
}

