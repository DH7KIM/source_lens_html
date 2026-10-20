// ---------- 컴파일러 결과: 연 폴더 맨 위 build.log (GCC)의 "파일:줄:칸: error/warning/note: 메시지" ----------
// 파일 경로는 프로젝트 안 경로의 끝부분과 맞춰 찾는다 (로그에 절대 경로·역슬래시·./ 가 있어도 됨). 색 코드(ESC[..m)는 뗀다.
// 컴파일러 결과 파일: [이름, 읽는 함수]  (GCC: build.log, Rust: cargo.json)
const BUILD_LOGS = [["build.log", parseGccLog], ["cargo.json", parseCargoJson]];
let buildLog = { mod: "", n: -1, files: new Map() };   // 소스 경로 → 진단 목록
// 로그의 경로 → 프로젝트 안의 파일 (끝부분 맞춤, 못 찾거나 동점이면 null)
function makePathFinder(paths) {
  const lower = paths.map(p => [p, p.toLowerCase()]);
  const cache = new Map();
  return raw => {
    const lp = raw.replace(/\\/g, "/").replace(/^(\.\/)+/, "").toLowerCase();
    if (cache.has(lp)) return cache.get(lp);
    let best = null, score = 0, tie = false;
    for (const [p, pl] of lower) {
      if (lp !== pl && !lp.endsWith("/" + pl) && !pl.endsWith("/" + lp)) continue;
      const sc = Math.min(lp.length, pl.length);
      if (sc > score) { best = p; score = sc; tie = false; } else if (sc === score) tie = true;
    }
    const r = tie ? null : best;
    cache.set(lp, r);
    return r;
  };
}
function parseGccLog(text, paths) {
  const find = makePathFinder(paths);
  const files = new Map(), seen = new Set();
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\x1b\[[0-9;]*[A-Za-z]/g, "");
    const m = line.match(/^(.+?):(\d+):(?:(\d+):)?[ \t]+(fatal error|error|warning|note):[ \t]+(.*?)\s*$/);
    if (!m) continue;
    const path = find(m[1]);
    if (!path) continue;
    let msg = m[5], code = "";
    const fm = msg.match(/\s\[(-W[\w+-]+)\]$/);
    if (fm) { code = fm[1]; msg = msg.slice(0, fm.index); }
    const severity = m[4] === "fatal error" ? "error" : m[4];
    const key = [path, m[2], m[3], severity, msg].join("\u0001");
    if (seen.has(key)) continue;   // 같은 헤더에서 여러 번 나온 것은 한 번만
    seen.add(key);
    if (!files.has(path)) files.set(path, []);
    files.get(path).push({ line: +m[2], col: +m[3] || 1, length: 0, severity, code, msg, help: "", src: "gcc" });
  }
  return files;
}
// GCC 메시지 설명 표: 패턴 → 한국어 [메시지, help], 영어 help. $1·$2는 패턴에서 잡은 낱말.
// 영어 화면은 원문 + 영어 help, 그 밖의 화면 언어는 번역(+ 풍선에 영어 원문). 표에 없는 메시지는 원문 그대로.
// (컴파일러는 LANG=C 영어 출력이어야 맞음. 앞으로 한 번에 몇 개씩 늘림)
const GCC_MSG = [
  { re: /^'(.+)' was not declared in this scope/, ko: ["'$1'이(가) 이 범위에서 선언되지 않았습니다", "철자, 위쪽에 선언이 있는지, #include·import를 확인하세요"], en: "check the spelling, that it is declared above, and the #include / import" },
  { re: /^'(.+)' has not been declared/, ko: ["'$1'이(가) 선언되지 않았습니다", "철자, 위쪽에 선언이 있는지, #include·import를 확인하세요"], en: "check the spelling, that it is declared above, and the #include / import" },
  { re: /^'(.+)' does not name a type/, ko: ["'$1'은(는) 타입 이름이 아닙니다", "타입 철자와 #include·import를 확인하고, 바로 앞 문장 끝에 ';'가 빠졌는지도 보세요"], en: "check the type's spelling and the #include / import, and whether the previous statement is missing a ';'" },
  { re: /^expected '(.+?)' before '(.+?)'/, ko: ["'$2' 앞에 '$1'이(가) 필요합니다", "가리킨 줄이 아니라 바로 앞 줄 끝에 '$1'이(가) 빠졌는지 확인하세요"], en: "the '$1' is often missing at the end of the line before the one shown" },
  { re: /^expected '(.+?)' at end of input/, ko: ["파일 끝에 '$1'이(가) 필요합니다", "열고 닫는 괄호나 ';' 짝이 맞는지 확인하세요"], en: "check that every bracket and ';' is paired" },
  { re: /^(.+): No such file or directory$/, ko: ["$1: 파일이나 폴더가 없습니다", "파일 이름·경로의 철자와 포함 폴더(-I) 옵션을 확인하세요"], en: "check the file name, the path and the include folder (-I) option" },
  { re: /^no matching function for call to '(.+)'/, ko: ["'$1' 호출에 맞는 함수가 없습니다", "아래 note: candidate 줄에서 후보 함수의 인자 개수·타입과 비교해 보세요"], en: "compare the arguments with the candidates in the note: lines below" },
  { re: /^invalid conversion from '(.+?)' to '(.+?)'/, ko: ["'$1'을(를) '$2'(으)로 바꿀 수 없습니다", "타입이 맞는지 보고, 정말 필요하면 static_cast 같은 명시적 변환을 쓰세요"], en: "check that the types match; use an explicit cast such as static_cast only if you mean it" },
  { re: /^passing '(.+?)' as 'this' argument discards qualifiers/, ko: ["'$1' 객체로 const가 아닌 멤버 함수를 불렀습니다", "그 함수 선언 끝에 const를 붙이거나, 객체를 const로 두지 마세요"], en: "add const to the end of that member function's declaration, or do not make the object const" },
  { re: /^assignment of read-only (?:variable|parameter) '(.+)'/, ko: ["const인 '$1'에 값을 대입할 수 없습니다", "const를 빼거나 다른 변수를 쓰세요"], en: "remove const or use another variable" },
  { re: /^assignment of member '(.+)' in read-only object/, ko: ["const 객체의 멤버 '$1'에 값을 대입할 수 없습니다", "객체의 const를 빼거나 멤버 함수를 const가 아닌 것으로 부르세요"], en: "remove const from the object, or use a non-const path" },
  { re: /^unused variable '(.+)'/, ko: ["변수 '$1'을(를) 쓰지 않았습니다", "필요 없으면 지우고, 일부러 두는 것이면 [[maybe_unused]]를 붙이세요"], en: "remove it, or add [[maybe_unused]] if it is on purpose" },
  { re: /^unused parameter '(.+)'/, ko: ["매개변수 '$1'을(를) 쓰지 않았습니다", "이름만 지우거나 [[maybe_unused]]를 붙이세요"], en: "remove the name, or add [[maybe_unused]]" },
  { re: /^comparison of integer expressions of different signedness: '(.+?)' and '(.+?)'/, ko: ["부호가 다른 정수 '$1'과(와) '$2'을(를) 비교합니다", "한쪽을 다른 쪽 타입에 맞추세요 (예: 반복 변수를 size_t로)"], en: "use the same type on both sides (for example size_t for the loop variable)" },
  { re: /^no return statement in function returning non-void/, ko: ["값을 돌려줘야 하는 함수인데 return이 없습니다", "모든 경로에서 값을 return 하세요"], en: "return a value on every path" },
  { re: /^'(.+)' is used uninitialized/, ko: ["'$1'을(를) 초기화하지 않고 썼습니다", "선언할 때 초기값을 넣으세요 (예: int x = 0;)"], en: "give it an initial value where it is declared (for example int x = 0;)" },
  { re: /^'(.+)' may be used uninitialized/, ko: ["'$1'이(가) 초기화되지 않은 채 쓰일 수 있습니다", "선언할 때 초기값을 넣거나 모든 경로에서 값을 정하세요"], en: "give it an initial value, or set it on every path" },
];
// 한 진단의 설명 (원본은 건드리지 않고 복사해서 돌려줌). 화면 언어가 영어가 아니면 번역(d.show)
function gccApply(d, L) {
  const norm = d.msg.replace(/[‘’]/g, "'");
  const hint = norm.match(/;\s*did you mean '([^']+)'\?\s*$/);   // GCC가 준 힌트는 help 줄로
  const base = hint ? norm.slice(0, hint.index) : norm;
  const hintText = l => hint ? (l === "ko" ? `GCC가 '${hint[1]}'을(를) 제안합니다` : `GCC suggests '${hint[1]}'`) : "";
  const fill = (str, m) => str.replace(/\$(\d)/g, (_, i) => m[+i] ?? "");
  let e = null, m = null;
  for (const x of GCC_MSG) if ((m = base.match(x.re))) { e = x; break; }
  const join = (a, b) => [a, b].filter(Boolean).join(" · ");
  const out = Object.assign({}, d);
  if (!e) {
    if (!hint) return out;
    out.msg = hint ? base : d.msg;
    out.help = hintText("en");
    if (L !== "en") out.show = { msg: base, help: hintText(L) };
    return out;
  }
  out.msg = hint ? base : d.msg;
  out.help = join(fill(e.en, m), hintText("en"));
  if (L !== "en") out.show = { msg: fill(e.ko[0], m), help: join(fill(e.ko[1], m), hintText(L)) };
  return out;
}
// Rust (cargo build --message-format=json > cargo.json): 줄마다 JSON, compiler-message만 읽음
function parseCargoJson(text, paths) {
  const find = makePathFinder(paths);
  const files = new Map(), seen = new Set();
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (line[0] !== "{") continue;
    let o;
    try { o = JSON.parse(line); } catch (e) { continue; }
    const m = o && o.reason === "compiler-message" ? o.message : null;
    if (!m || !m.spans) continue;
    const severity = m.level === "warning" ? "warning" : /^error/.test(m.level) ? "error" : "";
    if (!severity) continue;
    let sp = m.spans.find(x => x.is_primary), path = null;
    for (let i = 0; sp && i < 8; i++) {   // 매크로 안이면 부른 곳으로 따라감
      path = find(sp.file_name);
      if (path || !sp.expansion || !sp.expansion.span) break;
      sp = sp.expansion.span;
    }
    if (!sp || !path) continue;
    const msg = String(m.message || "");
    const code = m.code && m.code.code ? m.code.code : "";
    const key = [path, sp.line_start, sp.column_start, severity, msg].join("\u0001");
    if (seen.has(key)) continue;
    seen.add(key);
    const help = [(sp.label || "").replace(/^help: /, ""), ...(m.children || []).filter(c => c.level === "help").map(c => c.message)].filter(Boolean).join(" / ");
    const length = sp.line_start === sp.line_end ? Math.max(sp.column_end - sp.column_start, 1) : 0;
    if (!files.has(path)) files.set(path, []);
    files.get(path).push({ line: sp.line_start, col: sp.column_start || 1, length, severity, code, msg, help });
  }
  return files;
}
// 컴파일러 결과 파일들의 수정 시각 묶음 (없으면 -1) — 바뀌었는지 비교용
async function buildLogMod() {
  const k = [];
  for (const [name] of BUILD_LOGS) {
    if (!fileSet.has(name)) { k.push(-1); continue; }
    try { k.push((await src.get(name)).lastModified); } catch (e) { k.push(-1); }
  }
  return k.join("|");
}
async function loadBuildLog() {
  const key = await buildLogMod();
  if (buildLog.mod === key && buildLog.n === fileSet.size) return buildLog;
  const files = new Map();
  for (const [name, parse] of BUILD_LOGS) {
    if (!fileSet.has(name)) continue;
    try {
      const { text } = await readText(await src.get(name));
      for (const [p, ds] of parse(text, [...fileSet])) files.set(p, (files.get(p) || []).concat(ds));
    } catch (e) {}
  }
  buildLog = { mod: key, n: fileSet.size, files };
  return buildLog;
}
// 밑줄 길이: 칸에서 시작하는 낱말·"문자열"·<헤더> (없으면 한 글자). note는 밑줄 없이 진단 줄만
function gccFit(diags, text) {
  const rows = text.split("\n");
  return diags.map(d => {
    if (d.length > 0 && d.severity !== "note") return d;   // 길이를 아는 것(Rust)은 그대로
    const ch = [...(rows[d.line - 1] || "")].slice(d.col - 1);
    const w = (ch.join("").match(/^(?:[\p{L}\p{N}_]+|"[^"]*"?|<[^>]*>?)/u) || [ch[0] || ""])[0];
    return Object.assign({}, d, { length: d.severity === "note" ? 0 : [...w].length });
  });
}

