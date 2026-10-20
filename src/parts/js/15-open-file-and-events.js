async function openFile(path, { hash = "", line = 0, keepScroll = false } = {}) {
  let f;
  try { f = await src.get(path); }
  catch (e) { setState(t("notFound", path), true); return; }
  const codeEl = $("code"), art = $("out");
  const prevY = !codeEl.hidden ? codeEl.scrollTop : scrollY;
  const lang = langOf(path);
  const { text, enc, size, bytes } = await readText(f, lang === "ui");
  const changed = path !== cur;
  if (changed) expandTo(path);
  cur = path; curMod = f.lastModified;
  logMod = await buildLogMod();
  if (changed) { hlLine = 0; hlItem = null; }
  if (line) hlLine = line;
  if (lang === "md") {
    docLang = splitLang(path).lang;
    if (UI[docLang]) uiLang = docLang;
    document.documentElement.lang = docLang;
  }
  const asDoc = lang === "md" && !mdRaw;
  let lineCount = 0, note = "", check = null, packNote = "", treeErr = "", treeHtml = null;
  // JSON·JSON5 계층 보기: 읽기 오류일 때는 소스 보기. 표시한 줄(hlLine)은 두 보기가 함께 쓴다
  if (!asDoc && jsonTree && (lang === "json" || lang === "json5") && !text.includes("\u0000")) {
    try { treeHtml = renderJsonTree(json5Tree(text)); }
    catch (e) {
      const jl = jsonLinesOf(text, e);   // JSON Lines(줄마다 값 하나)면 줄마다 항목 하나로, 틀린 줄은 오류 항목
      if (jl) treeHtml = renderJsonTree(jl, { lines: true, text });
      else {
      // 오류가 있어도 오류 직전까지 읽은 부분은 계층으로 보여 주고, 오류 자리에 안내 (읽은 것이 없거나 JSON Lines면 소스 보기)
      const d = e && e.node ? jsonCheck(text)[0] : null;
      if (d && d.severity === "error") {
        Object.assign(d, jsonText(d, "en")); if (uiLang !== "en") d.show = jsonText(d, uiLang);
        treeHtml = renderJsonTree(e.node, { d, text });
      } else treeErr = t("treeErr", e.line || 1, e.message);
      }
    }
  }
  treeShown = treeHtml !== null;
  if (asDoc) {
    art.innerHTML = renderMarkdown(text);
    await loadImages();
    codeEl.hidden = true; art.hidden = false;
    lineCount = text.split("\n").length;
  } else {
    if (text.includes("\u0000") && enc !== "UTF-16") {
      codeEl.innerHTML = `<div class="msg">${esc(t("binary"))}</div>`;
    } else if (treeHtml !== null) {
      codeEl.innerHTML = treeHtml;
      lineCount = text.split("\n").length - (text.endsWith("\n") ? 1 : 0);
    } else {
      const big = text.length > HL_MAX;
      if (big) note = t("tooBig");
      let toks = big || lang === "plain" ? [[null, text]] : highlight(text, lang);
      // .ui 전체 검사 (ui-check와 같은 결과). 오류·경고 범위에 밑줄, 줄 아래에 진단
      if (lang === "ui") {
        check = uiCheck.check(bytes);
        // 화면 언어의 번역 표가 있으면 진단 줄·풍선은 번역 (ui-check 출력·d.msg는 영어 그대로)
        const { table, note: pn } = await uiTable(uiLang);
        packNote = pn;
        if (table) for (const d of check.diags) d.show = uiCheck.localize(d, table);
        if (!big) toks = markUiDiags(toks, check.diags);
      } else if (lang !== "plain") {
        // 컴파일러 결과 (build.log): 이 파일의 진단이 있으면 같은 방식으로 밑줄 + 진단 줄
        const ds = (await loadBuildLog()).files.get(path);
        const toml = !big && isTomlFile(path);
        const json = !big && isJsonFile(path);
        let diags = ds && ds.length ? gccFit(ds, text) : [];
        diags = diags.map(d => d.src === "gcc" ? gccApply(d, uiLang) : d);   // GCC 설명은 화면 언어로 (원문은 d.msg)
        if (toml) {   // TOML 문법 검사: 설명은 화면 언어로 (영어 원문은 d.msg)
          const tds = tomlCheck(text);
          for (const d of tds) { Object.assign(d, tomlText(d, "en")); if (uiLang !== "en") d.show = tomlText(d, uiLang); }
          diags = tds.concat(diags).sort((a, b) => a.line - b.line || a.col - b.col);
        }
        if (json) {   // JSON·JSON5 문법 검사: 첫 오류 하나. 설명은 화면 언어로
          const jds = jsonCheck(text);
          for (const d of jds) { Object.assign(d, jsonText(d, "en")); if (uiLang !== "en") d.show = jsonText(d, uiLang); }
          diags = jds.concat(diags).sort((a, b) => a.line - b.line || a.col - b.col);
        }
        if (toml || json || diags.length) {
          check = { diags, gcc: !toml && !json, toml, json, errorCount: diags.filter(d => d.severity === "error").length, warningCount: diags.filter(d => d.severity === "warning").length };
          if (!big) toks = markUiDiags(toks, diags);
        }
      }
      // 계층 보기에서 고른 항목의 글자 범위 (JSON·JSON5, 그 줄을 보고 있을 때)
      if (!big && hlItem && hlItem.line === hlLine && (lang === "json" || lang === "json5")) toks = markItemRange(toks, hlItem);
      const diags = check ? check.diags : [];
      const lines = tokensToLines(toks);
      if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
      lineCount = lines.length;
      const sevOf = new Map();   // 줄(0부터) → "bad"(오류) | "warn"(경고만)
      for (const d of diags) if (d.severity !== "note" && (d.severity === "error" || !sevOf.has(d.line - 1))) sevOf.set(d.line - 1, d.severity === "error" ? "bad" : "warn");
      codeEl.style.setProperty("--no-w", (String(lineCount).length + 3) + "ch");
      let html = '<div class="lines">';
      // 오류 줄 아래에 진단 끼워 넣기 (줄 번호 없음, 복사 안 됨)
      const byLine = new Map();
      if (showDiag) for (const d of diags) { if (!byLine.has(d.line - 1)) byLine.set(d.line - 1, []); byLine.get(d.line - 1).push(d); }
      const srcLines = text.split("\n");
      lines.forEach((l, k) => {
        html += `<div class="r${k + 1 === hlLine ? " hl" : ""}${sevOf.has(k) ? " " + sevOf.get(k) : ""}" id="L${k + 1}"><span class="no" data-n="${k + 1}"></span><span class="tx">${l}</span></div>`;
        for (const d of byLine.get(k) || []) html += diagRows(d, srcLines[k] || "");
      });
      // 파일 끝을 넘는 줄의 진단 (빈 파일의 E001 등)은 마지막 줄 아래에
      for (const [k, list] of byLine) if (k >= lines.length) for (const d of list) html += diagRows(d, "");
      codeEl.innerHTML = html + "</div>";
    }
    art.hidden = true; codeEl.hidden = false;
  }
  $("start").hidden = true; $("fileBar").hidden = false; document.body.classList.add("has-bar");
  $("name").textContent = projectLabel() + path;
  document.title = path + " - Source Viewer";
  setState([lineCount ? t("lines", lineCount) : "", fmtSize(size), enc, src.kind === "fsa" ? t("auto") : t("noAuto"), note].filter(Boolean).join(" · "));
  if (treeErr) {   // 계층 보기 오류 (빨강)
    const b = document.createElement("span");
    b.className = "bad"; b.textContent = " · " + treeErr;
    $("state").append(b);
  }
  if (check && !(check.gcc && !check.errorCount && !check.warningCount)) {   // .ui 검사 결과(또는 컴파일러 결과): 오류(빨강)·경고(주황)·문제 없음
    const b = document.createElement("span");
    const parts = [];
    if (check.errorCount) parts.push(t("uiErrs", check.errorCount));
    if (check.warningCount) parts.push(t("uiWarns", check.warningCount));
    b.className = check.errorCount ? "bad" : check.warningCount ? "warn" : "okay";
    b.textContent = " · " + (parts.length ? parts.join(" · ") : t("uiOk"));
    b.title = check.toml ? t("tomlTip") : check.json ? t("jsonTip") : check.gcc ? t("gccTip") : t("uiErrsTip", UI_DOC_VERSION);
    $("state").append(b);
    if (packNote) {   // 언어팩 문제 (빨강)
      const pb = document.createElement("span");
      pb.className = "bad"; pb.textContent = " · " + packNote;
      $("state").append(pb);
    }
  }
  pvCheck = lang === "ui" && check ? check : null;
  drawNav(); drawLangs(); drawStatic(); drawPreview();
  try { localStorage.setItem("sv-last:" + KEY, path); } catch (e) {}
  if (changed || line || hash) setHash(hash);
  if (asDoc) {
    if (hash) { const el = document.getElementById(decodeURIComponent(hash)); if (el) { el.scrollIntoView(); return; } }
    scrollTo(0, keepScroll ? prevY : 0);
  } else {
    scrollTo(0, 0);
    if (keepScroll) { codeEl.scrollTop = prevY; if (treeShown) markTreeLines(hlLine); }
    else if (treeShown) { if (!(changed && !hlLine && scrollToFirstError(codeEl, check))) scrollTreeToLine(hlLine); }
    else if (line) { const r = $("L" + line); if (r) r.scrollIntoView({ block: "center" }); }
    else if (!(changed && scrollToFirstError(codeEl, check))) codeEl.scrollTop = 0;
  }
}

// 파일을 처음 열 때 첫 오류 위치로 이동 (소스 보기: 오류 줄, 계층 보기: 오류 안내 항목). 오류가 없으면 false.
// 가로로는 움직이지 않게 inline: "start" (긴 줄이 있어도 왼쪽 끝에서 시작)
function scrollToFirstError(codeEl, check) {
  let el = null;
  if (treeShown) el = codeEl.querySelector(".tj-err");
  else { const d = check && check.diags.find(x => x.severity === "error"); if (d) el = $("L" + d.line); }
  if (!el) return false;
  for (let d = el.closest("details"); d; d = d.parentElement.closest("details")) d.open = true;
  el.scrollIntoView({ block: "center", inline: "start" });
  return true;
}

/// 진단 2줄: "   ^^^^ error[E003]: 메시지" / "        help: 추천" (경고는 warning[W103], 주황)
/// 앞부분은 원래 줄의 글자(칸 = 코드 포인트)를 투명하게 그대로 써서, 탭·한글이 있어도 칸이 맞는다.
/// 글자는 모두 CSS ::before(data-t)로 그려서 선택·복사되지 않는다 (줄 번호와 같은 방식)
function diagRows(d, line) {
  const span = (cls, text) => `<span class="${cls}" data-t="${esc(text)}"></span>`;
  const pad = span("pad", [...line].slice(0, d.col - 1).join(""));
  const row = body => `<div class="r dg${d.severity === "warning" ? " dw" : d.severity === "note" ? " dn" : ""}"><span class="no"></span><span class="tx">${body}</span></div>`;
  const w = Math.max(d.length, 1);
  const s = d.show || d;
  let html = row(pad + span("x", "^".repeat(w) + " " + d.severity + (d.code ? "[" + d.code + "]" : "")) + span("dm", ": " + s.msg));
  if (s.help) html += row(pad + span("dh", " ".repeat(w + 1) + "help: " + s.help));
  return html;
}

function setHash(anchor = "") {
  history.replaceState(null, "", "#" + encodeURI(cur) + (hlLine && !$("code").hidden ? ":L" + hlLine : anchor ? "#" + anchor : ""));
}

// 줄 클릭 → 그 줄 표시 (주소에 남김). 줄 번호뿐 아니라 글자 부분을 눌러도 되고, 같은 줄을 또 누르면 해제.
// 글자를 끌어서 고른 뒤에는 줄 선택을 바꾸지 않는다 (복사하려는 것이므로)
$("code").addEventListener("click", e => {
  const r = e.target.closest(".r");
  if (!r || r.classList.contains("dg")) return;
  const no = r.querySelector(".no");
  if (!no || !no.dataset.n) return;
  if (!e.target.closest(".no") && String(getSelection()).length) return;
  const n = +no.dataset.n;
  for (const x of $("code").querySelectorAll(".r.hl")) x.classList.remove("hl");
  for (const x of $("code").querySelectorAll(".sel-item")) x.classList.remove("sel-item");
  hlItem = null;   // 줄만 고름 (계층 보기에서는 그 줄의 첫 항목이 진하게)
  if (hlLine === n) hlLine = 0;
  else { hlLine = n; r.classList.add("hl"); }
  setHash(); markPreview();
});

async function loadImages() {
  for (const img of $("out").querySelectorAll("img[data-src]")) {
    const u = img.dataset.src;
    if (/^(https?:|data:)/.test(u)) { img.src = u; continue; }
    try { img.src = URL.createObjectURL(await src.get(resolve(cur, u))); } catch (e) {}
  }
}

// 문서 안 링크: 폴더 안 파일은 이 뷰어에서 (file.rs#L12 → 12번 줄), #은 제목으로, http는 새 탭
$("out").addEventListener("click", e => {
  const a = e.target.closest("a[data-href]");
  if (!a) return;
  e.preventDefault();
  const href = a.dataset.href;
  if (/^(https?:|mailto:)/i.test(href)) { open(href, "_blank", "noopener"); return; }
  if (href.startsWith("#")) { const el = document.getElementById(decodeURIComponent(href.slice(1))); if (el) el.scrollIntoView(); return; }
  const [p, h = ""] = href.split("#");
  const target = resolve(cur, decodeURI(p));
  if (!fileSet.has(target)) { setState(t("notFile", href), true); return; }
  const ln = h.match(/^L(\d+)$/);
  openFile(target, ln ? { line: +ln[1] } : { hash: h });
});

// 자동 새로 고침 (FSA만): 1초마다 지금 파일의 수정 시각 확인, 창으로 돌아올 때 목록 다시 읽기
setInterval(async () => {
  if (!src || src.kind !== "fsa" || !cur || document.hidden) return;
  try {
    const f = await src.get(cur);
    if (f.lastModified !== curMod || (await buildLogMod()) !== logMod) openFile(cur, { keepScroll: true });
  } catch (e) {}
}, 1000);
addEventListener("focus", async () => { if (src && src.kind === "fsa" && !reading) { try { await refreshList(); } catch (e) {} } });

// .md 문서 보기 ↔ 원문 보기
// .ui·toml·json 오류 설명 켜기 ↔ 끄기 (밑줄과 풍선 도움말은 늘 있음)
$("diagBtn").onclick = () => {
  showDiag = !showDiag;
  try { localStorage.setItem("sv-diag:" + KEY, showDiag ? "1" : "0"); } catch (e) {}
  if (cur) openFile(cur, { keepScroll: true });
};

// 자동 줄바꿈 켜기 ↔ 끄기 (소스 보기만. 파일을 다시 읽지 않고 클래스만 바꿈)
$("wrapBtn").onclick = () => {
  wrapLines = !wrapLines;
  try { localStorage.setItem("sv-wrap:" + KEY, wrapLines ? "1" : "0"); } catch (e) {}
  drawStatic();
};

$("mdMode").onclick = () => {
  mdRaw = !mdRaw;
  try { localStorage.setItem("sv-md-raw:" + KEY, mdRaw ? "1" : "0"); } catch (e) {}
  if (cur) openFile(cur);
};

