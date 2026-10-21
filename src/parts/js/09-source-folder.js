// ======================= 소스 폴더 (두 가지 방식) =======================
// 1) FSA: 폴더 핸들 (Chrome·Edge) → 자동 새로 고침, 다음 실행 때 다시 씀
// 2) files: <input webkitdirectory>로 고른 파일 목록 (다른 브라우저) → 그 순간의 내용만
const SKIP_DIRS = new Set(["obj", "gcm.cache", ".git", "target", "node_modules", "bin", "build", "Claude outputs"]);
const HL_MAX = 1.5 * 1024 * 1024;    // 이보다 큰 파일은 색칠하지 않음
let src = null;          // { kind, name, list() → [path], get(path) → File }
let fileSet = new Set(); // 목록에 있는 모든 경로
let entries = new Map(); // 목록 키 → { md: { lang: path } } 또는 { path }
let cur = null;          // 지금 보는 파일 경로
let curMod = 0;          // 지금 파일의 수정 시각 (자동 새로 고침)
let logMod = "";         // 소스를 그릴 때 본 컴파일러 결과 파일들의 수정 시각
// 시작 언어: 언어 상자에서 직접 고른 값(sv-lang, 폴더와 상관없이 하나)이 있으면 그것, 없으면 브라우저 언어 (언어 표는 앞 조각에서 모두 읽힘)
let savedLang = null;
try { savedLang = localStorage.getItem("sv-lang"); } catch (e) {}
if (savedLang && !UI[savedLang]) savedLang = null;   // 화면 글자 표가 있는 언어만 기억 (없으면 시작 화면의 언어 상자가 비어 보임)
uiLang = savedLang || pickUiLang();
let docLang = uiLang;    // 고른 문서 언어
let mdRaw = false;       // .md를 원문으로 볼지
let hlLine = 0;          // 표시한 줄
let hlItem = null;       // 계층 보기에서 고른 항목 { id, line, col, ec } (소스 보기에서 그 글자 범위를 더 진하게). 줄만 고른 때는 null
const $ = id => document.getElementById(id);
const KEY = location.pathname; // file:// 페이지는 저장소를 함께 쓰므로 이 파일 경로로 구분
try { mdRaw = localStorage.getItem("sv-md-raw:" + KEY) === "1"; } catch (e) {}
let jsonTree = false;    // JSON·JSON5를 계층으로 볼지
try { jsonTree = localStorage.getItem("sv-json-tree:" + KEY) === "1"; } catch (e) {}
let treeShown = false;   // 지금 계층으로 보여 주고 있는지 (오류면 소스 보기로 돌아가므로 jsonTree와 다를 수 있음)
let showDiag = true;     // .ui·toml 오류를 줄 아래에 보일지
try { showDiag = localStorage.getItem("sv-diag:" + KEY) !== "0"; } catch (e) {}
// 읽을 하위 폴더 단계: 2 / 4 / 6 / 8 / 제한 없음(0). 기본 4. 폴더(열쇠)마다 기억
const DEPTHS = [2, 4, 6, 8, 0];
let maxDepth = 4;
try { const raw = localStorage.getItem("sv-depth:" + KEY); if (raw !== null && DEPTHS.includes(+raw)) maxDepth = +raw; } catch (e) {}
const depthLimit = () => maxDepth === 0 ? Infinity : maxDepth;
let wrapLines = false;   // 소스 보기에서 긴 줄을 화면 너비에서 접어 보일지 (기본: 끔)
try { wrapLines = localStorage.getItem("sv-wrap:" + KEY) === "1"; } catch (e) {}
// .ui 배치 미리보기 설정: 켜짐, 창 크기("fit" | "custom" | "640x480"…), 너비·높이, 배율, 아래 칸 높이
const pvSet = { on: true, mode: "layout", win: "640x480", w: 640, h: 480, scale: 100, paneH: 300 };
try { Object.assign(pvSet, JSON.parse(localStorage.getItem("sv-preview:" + KEY) || "{}")); } catch (e) {}
let pvDoc = null, pvOpen = 0;   // 미리보기: 그린 문서, 보기 모드에서 펼친 menu_button 노드 번호(0 = 없음)
const savePv = () => { try { localStorage.setItem("sv-preview:" + KEY, JSON.stringify(pvSet)); } catch (e) {} };
let pvCheck = null;      // 지금 .ui 파일의 검사 결과 (배치 미리보기용)

// ctx(선택): { count: 지금까지 본 파일 수, signal: 취소 신호, lastYield: 마지막으로 쉰 시각 }. 취소하면 AbortError를 던짐
async function scanHandle(dir, prefix = "", depth = 0, out = [], ctx = null) {
  for await (const [name, h] of dir.entries()) {
    if (ctx) {
      if (ctx.signal.aborted) throw new DOMException("cancelled", "AbortError");
      // 항목이 쉬지 않고 이어서 나오면 화면(취소 단추·시간 표시)이 멈추므로, 30ms마다 잠깐 쉬어 줌
      if (performance.now() - ctx.lastYield > 30) { await new Promise(r => setTimeout(r)); ctx.lastYield = performance.now(); }
      if (ctx.signal.aborted) throw new DOMException("cancelled", "AbortError");
    }
    if (h.kind === "directory") {
      if (depth < depthLimit() && !SKIP_DIRS.has(name) && !name.startsWith(".")) await scanHandle(h, prefix + name + "/", depth + 1, out, ctx);
    } else {
      if (ctx) ctx.count++;
      if (langOf(name)) out.push(prefix + name);
    }
  }
  return out;
}

async function getHandleFile(dir, path) {
  const parts = path.split("/");
  for (let k = 0; k < parts.length - 1; k++) dir = await dir.getDirectoryHandle(parts[k]);
  return (await dir.getFileHandle(parts[parts.length - 1])).getFile();
}

function useHandle(dir) {
  src = { kind: "fsa", name: dir.name, list: ctx => scanHandle(dir, "", 0, [], ctx), get: p => getHandleFile(dir, p) };
}

function useFiles(fileList) {
  const all = [...fileList];
  const map = new Map();
  let root = "";
  for (const f of all) { const parts = (f.webkitRelativePath || f.name).split("/"); if (parts.length > 1) root = parts[0]; }
  const build = () => {   // 단계를 바꾸면 다시 걸러야 해서 목록을 부를 때마다 만든다
    map.clear();
    for (const f of all) {
      const rel = f.webkitRelativePath || f.name;
      const parts = rel.split("/");
      if (parts.length > 1) parts.shift();
      const dirs = parts.slice(0, -1);
      if (dirs.some(d => SKIP_DIRS.has(d) || d.startsWith(".")) || dirs.length > depthLimit()) continue;
      if (langOf(rel)) map.set(parts.join("/"), f);
    }
  };
  src = { kind: "files", name: root || "files",
          list: async () => { build(); return [...map.keys()]; },
          get: async p => { const f = map.get(p); if (!f) throw new Error("not found"); return f; } };
}

// 이름.ko.md → { base: 이름, lang: ko },  이름.md → { base: 이름, lang: en }
function splitLang(path) {
  const m = path.match(/^(.*?)(?:\.([a-z]{2}(?:-[a-z]{2})?))?\.md$/i);
  return m ? { base: m[1], lang: (m[2] || "en").toLowerCase() } : { base: path, lang: "" };
}
const keyOf = p => isMd(p) ? splitLang(p).base + ".md" : p;

// 프로젝트 버전: 폴더 맨 위 CHANGELOG.md(없으면 CHANGELOG.ko.md)의 첫 "## vX.Y.Z". 없으면 빈 글
let projectVersion = "";
async function readProjectVersion(paths) {
  for (const p of ["CHANGELOG.md", "CHANGELOG.ko.md"]) {
    if (!paths.includes(p)) continue;
    try {
      const m = (await (await src.get(p)).text()).match(/^##[ \t]+v?(\d+\.\d+\.\d+[\w.+-]*)/m);
      if (m) return "v" + m[1];
    } catch (e) {}
  }
  return "";
}
// 경로 앞: "이름 v0.28.0 폴더 (55개 파일) / ". 파일 수는 목록에 올라온 파일(지원하는 형식) 개수
const projectLabel = () => src.name ? t("projectLabel", src.name + (projectVersion ? " " + projectVersion : ""), fileSet.size.toLocaleString()) : "";
function drawName() {
  if (!cur || !src) return;
  $("name").textContent = projectLabel() + cur;
  $("name").title = t("projectLabelTip", fileSet.size.toLocaleString());
}

// 폴더를 읽는 동안 "폴더 읽는 중… 파일 N개 · 3.2초 [취소]"를 보임 (0.4초가 지나야 나타남: 빨리 끝나면 깜빡이지 않게)
let reading = null;   // 읽는 중이면 { cancel() }
async function listWithProgress() {
  const ctl = new AbortController();
  const ctx = { count: 0, signal: ctl.signal, lastYield: performance.now() };
  const t0 = performance.now();
  const busyIds = ["folder", "depth", "pick", "pickFiles", "regrant"];   // 읽는 중에는 다른 폴더·단계를 고르지 못하게
  reading = { cancel: () => ctl.abort() };
  for (const id of busyIds) $(id).disabled = true;
  const tick = () => {
    const ms = performance.now() - t0;
    $("reading").hidden = ms < 400;
    $("readingText").textContent = t("reading", ctx.count.toLocaleString(), (ms / 1000).toFixed(1));
  };
  const timer = setInterval(tick, 200);
  try { return await src.list(ctx); }
  finally {
    clearInterval(timer); reading = null;
    $("reading").hidden = true;
    for (const id of busyIds) $(id).disabled = false;
  }
}

// show: 사용자가 연 읽기(진행 표시·취소 있음). 창 포커스 때 조용히 다시 읽을 때는 false
async function refreshList(show = false) {
  const paths = ((show && src.kind === "fsa" ? await listWithProgress() : await src.list())).sort();
  projectVersion = await readProjectVersion(paths);
  fileSet = new Set(paths);
  entries = new Map();
  for (const p of paths) {
    const key = keyOf(p);
    if (isMd(p)) {
      if (!entries.has(key)) entries.set(key, { md: {} });
      entries.get(key).md[splitLang(p).lang] = p;
    } else entries.set(key, { path: p });
  }
  drawNav(); drawLangs(); drawName();
  return paths.length;
}

// README, CHANGELOG를 먼저, 그다음 폴더 없는 파일, 폴더별 파일
function orderedKeys() {
  const rank = k => /^readme\.md$/i.test(k) ? 0 : /^changelog\.md$/i.test(k) ? 1 : k.includes("/") ? 3 : 2;
  const dir = k => k.slice(0, k.lastIndexOf("/") + 1);
  return [...entries.keys()].sort((a, b) => rank(a) - rank(b) || dir(a).localeCompare(dir(b)) || a.localeCompare(b));
}

function pathFor(key, lang) {
  const e = entries.get(key);
  if (!e) return null;
  if (!e.md) return e.path;
  return e.md[lang] || e.md.en || Object.values(e.md)[0];
}

