// ======================= JSON·JSON5 계층 보기 =======================
// json5Tree()로 읽은 노드를 접고 펼치는 목록으로 그린다 (보기만 함). 객체 {} 과 배열 [] 은 아이콘으로 구분한다.
// 줄(항목)을 누르면 강조하고, 소스 보기와 같은 표시한 줄(hlLine)로 기억한다. 오른쪽 숫자(소스의 줄 번호)를 누르면 소스 보기로 바꿔 그 줄로 간다.
const ICON_MAP = '<svg class="tj-ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2.5c-1.6 0-2 .8-2 2v2c0 1-.6 1.5-1.5 1.5.9 0 1.5.5 1.5 1.5v2c0 1.2.4 2 2 2M10 2.5c1.6 0 2 .8 2 2v2c0 1 .6 1.5 1.5 1.5-.9 0-1.5.5-1.5 1.5v2c0 1.2-.4 2-2 2" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_ARRAY = '<svg class="tj-ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 2.5h-2.5v11h2.5M9.5 2.5h2.5v11h-2.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const TREE_CLASS = { string: "s", number: "n", null: "tj-null" };
// 값 종류별 클래스: 문자열 s, 숫자 n, true / false / null 은 각각 따로
const valueClass = n => n.type === "boolean" ? (n.text === "true" ? "tj-true" : "tj-false") : TREE_CLASS[n.type];

// ei = 오류가 있는 파일의 부분 트리일 때 { d: 진단(jsonCheck), text: 소스 }. 오류가 난 자리에 빨간 안내와 오류 줄 하나만 보여 주고, 그 뒤는 표시하지 않는다
// JSON Lines 줄 트리(root.lines)일 때는 ei = { lines: true }: 줄마다 항목 하나, 틀린 줄은 빨간 오류 항목
function renderJsonTree(root, ei) {
  const openDepth = root.count > 3000 ? 1 : 2;   // 항목이 많으면 처음에는 덜 펼침
  // 오류가 안에 있는 항목(오류까지 가는 길)은 깊이와 상관없이 펼쳐서 오류가 바로 보이게 한다 (값 뒤 글자 오류 errAfter는 항목 밖에 그려지므로 제외)
  const markErr = n => {
    let h = !!(n.err && !n.errAfter);
    if (n.kids) for (const k of n.kids) if (markErr(k)) h = true;
    n.hasErr = h;
    return h;
  };
  markErr(root);
  const dataOf = n => ` data-line="${n.line}" data-id="${n.id}" data-col="${n.col}" data-ec="${n.ec}"`;
  const go = n => `<a class="tj-go" data-n="${n.line}" title="${esc(t("treeLine", n.line))}">${n.line}</a>`;
  // 키의 줄바꿈·탭 같은 제어 문자는 풀어서 그리지 않고 \n 처럼 글자 그대로 보여 줌 (값과 같게, 줄이 깨지지 않게)
  const keyText = k => k.replace(/[\u0000-\u001f\u007f\u2028\u2029]/g, c => ({ "\n": "\\n", "\r": "\\r", "\t": "\\t", "\b": "\\b", "\f": "\\f", "\v": "\\v" })[c] || "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
  const keyHtml = n => n.key === null ? ""
    : '<span class="tj-kk">' + (typeof n.key === "number" ? `<span class="tj-i">${n.key}</span>` : `<span class="tj-k">${esc(keyText(n.key))}</span>`) + '<span class="tj-sum">:</span></span>';
  // 오류 자리: 빨간 안내 + 오류 줄 하나 (줄 번호가 아니라 글자 그대로, 오류 글자에 밑줄). 아주 긴 줄은 오류 둘레만
  // 오류 자리 정보: 한 파일 부분 트리는 ei.d·ei.text, JSON Lines는 줄마다(n.err, n.errLine)
  const errInfo = (n, ln) => {   // ln = 그 항목이 속한 줄의 정보 (JSON Lines에서 줄 뿌리의 errLine을 아래로 물려줌)
    if (!ei.lines) return { d: ei.d, text: ei.text, lineNo: 0 };
    const dg = jsonLineDiag(n.err, ln.line, ln.text); Object.assign(dg, jsonText(dg, uiLang));
    return { d: dg, text: ln.text, lineNo: 1 };
  };
  const errBox = (n, ln) => {
    const { d, text, lineNo } = errInfo(n, ln), s = d.show || d, line = d.line;
    const chars = Array.from((lineNo ? text : text.split("\n")[line - 1] || "").replace(/\r$/, ""));
    const c0 = Math.min(d.col - 1, chars.length), len = Math.max(d.length, 1);
    const from = Math.max(0, c0 - 60), to = Math.min(chars.length, c0 + len + 60);
    const pre = (from > 0 ? "…" : "") + chars.slice(from, c0).join(""), bad = chars.slice(c0, c0 + len).join("") || " ", post = chars.slice(c0 + len, to).join("") + (to < chars.length ? "…" : "");
    return `<div class="tj-errbox"><div class="tj-err"><span class="tj-sp"></span><span class="tj-estop">${esc(t("treeStop", line, s.msg))}</span><a class="tj-ego" data-n="${line}" title="${esc(t("treeLine", line))}">${line}</a></div>` +
      `<div class="tj-err tj-esrc"><span class="tj-sp"></span><span>${esc(pre)}<span class="tj-ebad">${esc(bad)}</span>${esc(post)}</span></div></div>`;
  };
  // JSON Lines의 틀린 줄: 번호와 오류 메시지(빨강), 그 줄 글 (길면 앞부분만)
  const errRow = n => {
    const dg = jsonLineDiag(n.err, n.line, n.text); Object.assign(dg, jsonText(dg, uiLang));
    const tx = Array.from(n.text); const short = tx.length > 120 ? tx.slice(0, 120).join("") + "…" : n.text;
    return `<div class="tj-row"${dataOf(n)}><span class="tj-dot tj-edot"></span>${keyHtml(n)}<span class="tj-v tj-ebad">${esc(dg.msg)}</span><span class="tj-v tj-etext">${esc(short)}</span>${go(n)}</div>`;
  };
  const one = (n, d, ln) => {
    if (n.errLine) ln = n.errLine;
    if (n.type === "error") return errRow(n);
    if (n.kids) {
      const arr = n.type === "array";
      const icon = arr ? ICON_ARRAY : ICON_MAP;
      const sum = n.lines ? t("treeLines", n.kids.length) : arr ? `[${n.kids.length}]` : `{${n.kids.length}}`;
      return `<details class="tj"${d < openDepth || n.hasErr ? " open" : ""}><summary${dataOf(n)} title="${esc(t(arr ? "treeArray" : "treeMap", n.kids.length))}">${ICON_CHEVRON}${icon}${keyHtml(n)}<span class="tj-sum">${sum}</span>${go(n)}</summary>` +
        `<div class="tj-kids">${n.kids.map(c => one(c, d + 1, ln)).join("")}${n.err && !n.errAfter ? errBox(n, ln) : ""}</div></details>${n.err && n.errAfter ? errBox(n, ln) : ""}`;
    }
    const tx = n.text.length > 300 ? n.text.slice(0, 300) + "…" : n.text;
    return `<div class="tj-row"${dataOf(n)}><span class="tj-dot ${valueClass(n)}"></span>${keyHtml(n)}<span class="tj-v ${valueClass(n)}">${esc(tx)}</span>${go(n)}</div>${n.err ? errBox(n, ln) : ""}`;
  };
  return `<div class="tj-root">${one(root, 0)}</div>`;
}

// 줄(항목)의 정보 → hlItem
const itemOf = el => ({ id: +el.dataset.id, line: +el.dataset.line, col: +el.dataset.col, ec: +el.dataset.ec });

// 클릭: 오른쪽 숫자 → 소스 보기로 바꿔 그 줄로, 그 밖의 항목 → 그 항목 강조 (같은 항목을 또 누르면 해제)
$("code").addEventListener("click", e => {
  const eg = e.target.closest(".tj-ego");   // 오류 줄의 숫자: 소스 보기로 바꿔 오류 줄로 (고른 항목 없음)
  if (eg) {
    e.preventDefault();
    hlLine = +eg.dataset.n; hlItem = null;
    setJsonTree(false);
    if (cur) openFile(cur, { line: hlLine });
    return;
  }
  const a = e.target.closest(".tj-go");
  if (a) {
    e.preventDefault();
    hlLine = +a.dataset.n;
    hlItem = itemOf(a.closest("[data-line]"));
    setJsonTree(false);
    if (cur) openFile(cur, { line: hlLine });
    return;
  }
  const row = e.target.closest(".tj-root [data-line]");
  if (!row || String(getSelection()).length) return;   // 글자를 끌어 고른 뒤에는 바꾸지 않음
  const it = itemOf(row);
  if (hlItem && hlItem.id === it.id && hlLine === it.line) { hlLine = 0; hlItem = null; }
  else { hlLine = it.line; hlItem = it; }
  markTreeLines(hlLine);
  setHash();
});

// 표시한 줄(L)에 해당하는 항목: 그 줄의 항목, 없으면(주석, 빈 줄, `{` `[` `}` `]`만 있는 줄 등) 줄 번호가 가장 가까운 항목 (같은 거리면 뒤쪽).
// 같은 줄에 항목이 여럿이면 가장 바깥 항목. 항목이 없으면 null
function treeTarget(L) {
  const all = [...$("code").querySelectorAll(".tj-root [data-line]")];
  if (!all.length || !L) return null;
  let prev = null, next = null;   // L 이하에서 가장 큰 줄, L 이상에서 가장 작은 줄
  for (const x of all) {
    const n = +x.dataset.line;
    if (n <= L) prev = n;
    if (n >= L) { next = n; break; }
  }
  const line = prev === null ? next : next === null ? prev : (L - prev < next - L ? prev : next);
  return { line, el: all.find(x => +x.dataset.line === line) };
}

// 표시한 줄 L의 항목 강조: 한 줄에 항목이 여럿이면 고른 항목(없으면 가장 바깥 첫 항목)을 진하게(hl), 나머지는 연하게(hl2).
// 줄에 항목이 없으면 가장 가까운 항목에 같은 방식으로 강조 (표시한 줄 hlLine 자체는 바꾸지 않아서, 소스 보기로 돌아가면 처음 줄 그대로)
function markTreeLines(L) {
  for (const x of $("code").querySelectorAll(".tj-root .hl, .tj-root .hl2")) x.classList.remove("hl", "hl2");
  const tg = treeTarget(L);
  if (!tg) return null;
  const same = [...$("code").querySelectorAll(".tj-root [data-line]")].filter(x => +x.dataset.line === tg.line);
  const strong = (hlItem && hlItem.line === tg.line && same.find(x => +x.dataset.id === hlItem.id)) || same[0];
  for (const x of same) x.classList.add(x === strong ? "hl" : "hl2");
  return tg;
}

// 표시한 줄로 이동 + 가까운 항목 강조. 접혀 있으면 위쪽 묶음을 펼친다 (줄이 0이면 맨 위)
function scrollTreeToLine(L) {
  const tg = markTreeLines(L);
  if (!tg) { $("code").scrollTop = 0; return; }
  const best = tg.el;
  let d = (best.tagName === "SUMMARY" ? best.parentElement.parentElement : best.parentElement).closest("details");
  while (d) { d.open = true; d = d.parentElement.closest("details"); }
  best.scrollIntoView({ block: "center" });
}

// 소스 보기 ↔ 계층 보기: 두 단추를 다 보이고, 누른 쪽으로 바꿈
function setJsonTree(on) {
  jsonTree = on;
  try { localStorage.setItem("sv-json-tree:" + KEY, on ? "1" : "0"); } catch (e) {}
}
$("treeSrc").onclick = () => { setJsonTree(false); if (cur) openFile(cur, { line: hlLine }); };   // 표시한 줄로 이동
$("treeTree").onclick = () => { setJsonTree(true); if (cur) openFile(cur); };

// 소스 보기: 고른 항목(hlItem)의 글자 범위를 sel-item 클래스로 더 진하게 (첫 줄만, 칸은 UTF-16 단위, ec가 -1이면 줄 끝까지)
function markItemRange(tokens, it) {
  const out = [];
  let ln = 1, col = 0;
  for (const [cls, text, tip] of tokens) {
    let piece = "", on = false;
    const flush = () => { if (piece) out.push([on ? (cls ? cls + " " : "") + "sel-item" : cls, piece, tip]); piece = ""; };
    for (const ch of text) {
      if (ch === "\n") { flush(); out.push([null, "\n"]); ln++; col = 0; on = false; continue; }
      const now = ln === it.line && col >= it.col && (it.ec < 0 || col < it.ec);
      if (now !== on) { flush(); on = now; }
      piece += ch; col += ch.length;
    }
    flush();
  }
  return out;
}
