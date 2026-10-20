// ---------- .ui 색칠 (검사는 위의 uiCheck가 한다) ----------
// 옛 이름(check item edit number dropdown / tip disabled_tip hint gap check)도 색칠 (경고 W104 밑줄은 검사 결과로)
const UI_KINDS = words("label button text_field number_field menu_button checkbox canvas spacer group row column menu menu_item separator defaults check item edit number dropdown");
const UI_ATTRS = words(`left top right bottom width height right_of below spacing hidden disabled text align placeholder max_length
  min max step hex menu checked padding checkable radio tooltip disabled_tooltip section tip disabled_tip hint gap check`);
const UI_RESERVED = new Set([...UI_KINDS, ...words("include style true false if else use ref")]);
const UI_NO_NAME = words("spacer separator");

/// 색칠만: 첫 단어 종류(k), 둘째 이름(f), 속성(t), 값: 숫자(n)·단어(p)·문자열(s), 주석(c).
/// 모르는 단어는 색 없이 두고, 오류 밑줄은 markUiDiags()가 검사 결과로 긋는다.
function highlightUi(src) {
  const out = [];
  const push = (cls, text) => { if (text) out.push([cls, text]); };
  const lex = /[ \t]+|\/\/.*|"(?:\\.|[^"\\])*"?|-?[A-Za-z0-9_]+|[\s\S]/y;
  src.split("\n").forEach((line, ln) => {
    if (ln) push(null, "\n");
    let i = 0, state = "kind";
    if (ln === 0 && /^\uFEFF?#ui(?![A-Za-z0-9_])/.test(line)) {   // 머리 줄
      const h = line.match(/^\uFEFF?#ui/)[0];
      push("k", h); i = h.length; state = "version";
    }
    while (i < line.length) {
      lex.lastIndex = i;
      const tok = lex.exec(line)[0];
      const before = line[i - 1], after = line[i + tok.length];
      i += tok.length;
      if (/^[ \t]/.test(tok)) { push(null, tok); continue; }
      if (tok.startsWith("//")) { push("c", tok); continue; }
      if (tok[0] === '"') { push("s", tok); continue; }
      if (!/^-?[A-Za-z0-9_]+$/.test(tok)) { push(null, tok); continue; }   // 글자 하나
      if (state === "version") { push("n", tok); state = "attr"; continue; }
      if (before === "=") { push(/^-?\d/.test(tok) ? "n" : /[A-Z]/.test(tok) ? null : "p", tok); continue; }   // 값
      if (state === "kind") { push(UI_KINDS.has(tok) ? "k" : null, tok); state = tok === "defaults" ? "dkind" : UI_NO_NAME.has(tok) ? "attr" : "name"; continue; }
      if (state === "dkind") { push(UI_KINDS.has(tok) ? "k" : null, tok); state = "attr"; continue; }
      if (state === "name" && after !== "=") {       // 요소 이름
        state = "attr";
        push(/[A-Z]/.test(tok) || UI_RESERVED.has(tok) ? null : "f", tok);
        continue;
      }
      state = "attr";                                // 속성 이름 (값 있음/없음)
      push(/^-?\d/.test(tok) ? "n" : UI_ATTRS.has(tok) ? "t" : null, tok);
    }
  });
  return out;
}

/// 검사 결과(diags)의 범위(줄, 칸, 길이: 코드 포인트)에 밑줄 클래스(오류 e, 경고 wn)와 풍선 도움말을 붙인다.
/// 길이 0인 진단(줄 끝에서 빠진 것 등)은 밑줄 없이 진단 줄로만 보인다.
function markUiDiags(tokens, diags) {
  const byLine = new Map();   // 줄(1부터) → [{ a 시작 칸, b 끝 칸(포함 안 함), d }]
  for (const d of diags) {
    if (!d.length) continue;
    if (!byLine.has(d.line)) byLine.set(d.line, []);
    byLine.get(d.line).push({ a: d.col, b: d.col + d.length, d });
  }
  // 번역해서 보일 때(d.show)는 아래에 ui-check와 같은 영어 원문도
  const tipOf = d => {
    const s = d.show || d, head = d.severity + (d.code ? `[${d.code}]` : "") + ": ";
    let tip = head + s.msg + (s.help ? `\nhelp: ${s.help}` : "");
    if (s !== d) tip += "\n───\n" + d.msg + (d.help ? `\nhelp: ${d.help}` : "");
    return tip;
  };
  const out = [];
  let ln = 1, col = 1;
  for (const [cls, text] of tokens) {
    let piece = "", key = null;
    const flush = () => {
      if (!piece) return;
      if (!key) out.push([cls, piece]);
      else {
        const sev = key.some(r => r.d.severity === "error") ? "e" : "wn";
        out.push([(cls ? cls + " " : "") + sev, piece, key.map(r => tipOf(r.d)).join("\n\n")]);
      }
      piece = "";
    };
    for (const ch of text) {   // 코드 포인트 단위
      if (ch === "\n") { flush(); key = null; out.push([null, "\n"]); ln++; col = 1; continue; }
      const hits = (byLine.get(ln) || []).filter(r => col >= r.a && col < r.b);
      const k = hits.length ? hits : null;
      if (String(k && k.map(r => r.d.line + ":" + r.d.col + r.d.code)) !== String(key && key.map(r => r.d.line + ":" + r.d.col + r.d.code))) { flush(); key = k; }
      piece += ch;
      col++;
    }
    flush();
  }
  return out;
}

/// 토큰 → 줄별 HTML (여러 줄 주석·문자열도 줄마다 나눔)
function tokensToLines(tokens) {
  const lines = [];
  let cur = "";
  for (const [cls, s, tip] of tokens) {
    const parts = s.split("\n");
    parts.forEach((part, k) => {
      if (k) { lines.push(cur); cur = ""; }
      if (!part) return;
      cur += cls ? `<span class="${cls}"${tip ? ` title="${esc(tip)}"` : ""}>${esc(part)}</span>` : esc(part);
    });
  }
  lines.push(cur);
  return lines;
}

