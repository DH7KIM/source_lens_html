// ---------- JSON Lines 읽기 (줄마다 값 하나) ----------
// 줄을 따로따로 json5Tree로 읽는다. 틀린 줄은 오류 항목({ type: "error" })으로 두고 나머지는 계속 읽는다 (줄끼리 영향이 없어서 오류 복구가 필요 없다).
// 뿌리: { type: "array", lines: true, id: 0, kids, okCount, badCount, bads, count }. 항목의 key는 0부터 번호, line은 소스의 줄 번호.
// 틀린 줄: 오류 직전까지 읽은 부분 트리가 있으면 그 줄의 항목으로 두고(오류 자리에 err, 줄 정보 errLine = { line, text }), 읽은 것이 없으면 오류 항목 { type: "error", key, id, line, col: 0, ec: -1, err: e, text: 그 줄 글 }.
// bads = 틀린 줄 목록 [{ err, line, text }] (검사가 씀)
function json5Lines(text) {
  const kids = [], bads = [];
  let id = 1, ok = 0, bad = 0;
  text.split("\n").forEach((raw, k) => {
    const ln = raw.replace(/\r$/, "");
    if (ln.trim() === "" || /^\s*\/\//.test(ln)) return;   // 빈 줄·주석만 있는 줄은 건너뜀
    try {
      const n = json5Tree(ln, { line0: k, id0: id });
      n.key = kids.length; id = n.count; ok++; kids.push(n);
    } catch (e) {
      if (!e || e.code === undefined) throw e;
      bads.push({ err: e, line: k + 1, text: ln }); bad++;
      if (e.node) { const n = e.node; n.key = kids.length; id = n.count; n.errLine = { line: k + 1, text: ln }; kids.push(n); }   // 오류 직전까지 읽은 부분
      else kids.push({ type: "error", key: kids.length, id: id++, line: k + 1, col: 0, ec: -1, err: e, text: ln });
    }
  });
  return { type: "array", key: null, lines: true, id: 0, line: 1, col: 0, ec: -1, kids, okCount: ok, badCount: bad, bads, count: id };
}

// 파일 전체로 읽다가 값 뒤에 글자가 남았을 때(J010, e = 그 오류) JSON Lines인지 판단해 줄 트리를 돌려준다 (아니면 null).
// 조건: 첫 값이 끝난 뒤 줄이 바뀌어서 글자가 시작하고, 읽힌 줄이 2개 이상이며 틀린 줄보다 적지 않다 (한 파일 JSON의 꼬리 글자와 구별).
function jsonLinesOf(text, e) {
  if (!e || e.code !== "J010" || !e.node || !text.slice(e.node.end, e.pos).includes("\n")) return null;
  const r = json5Lines(text);
  return r.okCount >= 2 && r.okCount >= r.badCount ? r : null;
}
