// ======================= JSON·JSON5 문법 검사 =======================
/// JSON·JSON5 문법 검사 (문법 오류만. 값의 뜻은 검사하지 않음). 읽기 코드는 계층 보기와 같은 json5Tree를 쓴다.
/// 진단: { line, col, length(코드 포인트, 줄 끝까지로 자름), severity: "error"|"note", code: "J001"…, args, msg, help }
/// 이번 버전은 첫 오류 하나만 알린다 (오류 복구는 다음 후보).
/// JSON Lines(줄마다 값 하나, `jsonLinesOf`가 판단): 줄마다 따로 읽어 틀린 줄을 모두 알린다(최대 100개). 틀린 줄이 없으면 오류 대신 안내(note) J012.
function jsonCheck(text) {
  if (jsonSyntax === "lines") {   // 직접 고른 JSON Lines: 줄마다 엄격한 JSON
    const ds = json5Lines(text, true).bads.slice(0, 100).map(b => jsonLineDiag(b.err, b.line, b.text));
    return ds.length ? ds : [{ line: 1, col: 1, length: 0, severity: "note", code: "J012", args: [], msg: "", help: "" }];
  }
  try { jsonTreeOf(text); return []; }
  catch (e) {
    if (!e || e.code === undefined) throw e;
    const jl = jsonLinesOf(text, e);
    if (jl) {
      const ds = jl.bads.slice(0, 100).map(b => jsonLineDiag(b.err, b.line, b.text));
      return ds.length ? ds : [{ line: 1, col: 1, length: 0, severity: "note", code: "J012", args: [], msg: "", help: "" }];
    }
    const p = jsonPos(text, e.pos, e.len);
    return [{ line: p.line, col: p.col, length: p.length, severity: "error", code: e.code, args: e.args || [], msg: "", help: "" }];
  }
}

/// 소스 안 위치(UTF-16) → 줄, 칸, 길이 (칸·길이는 코드 포인트, 길이는 줄 끝까지로 자름)
function jsonPos(text, pos, len) {
  const before = text.slice(0, pos), line = before.split("\n").length;
  const lineStart = before.lastIndexOf("\n") + 1;
  const col = Array.from(before.slice(lineStart)).length + 1;
  let lineEnd = text.indexOf("\n", pos); if (lineEnd < 0) lineEnd = text.length;
  if (lineEnd > lineStart && text[lineEnd - 1] === "\r") lineEnd--;
  const length = Array.from(text.slice(pos, Math.min(pos + len, Math.max(lineEnd, pos)))).length;
  return { line, col, length };
}

/// JSON Lines의 한 줄(lineNo번 줄, 글 lineText)에서 난 오류 e → 진단 (위치는 그 줄 안의 것)
function jsonLineDiag(e, lineNo, lineText) {
  const p = jsonPos(lineText, e.pos, e.len);
  return { line: lineNo, col: p.col, length: p.length, severity: "error", code: e.code, args: e.args || [], msg: "", help: "" };
}

/// 진단의 설명 글: 화면 언어 표(UI)에서 가져온다 (영어는 d.msg·d.help, 화면 언어가 영어가 아니면 d.show)
function jsonText(d, L) {
  const a = d.args || [];
  const f = k => String((UI[L] || UI.en)[k] ?? UI.en[k]).replace(/\{(\d)\}/g, (_, i) => a[+i] ?? "");
  const key = "json" + d.code;
  return { msg: f(key), help: f(key + "h") };
}
const isJsonFile = path => { const k = langOf(path); return k === "json" || k === "json5"; };
