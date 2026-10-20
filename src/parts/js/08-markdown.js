// ======================= 마크다운 → HTML (docs-viewer와 같은 변환기) =======================
function inline(text) {
  const keep = [];
  const stash = html => "\u0000" + (keep.push(html) - 1) + "\u0000";
  text = text.replace(/(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/g, (_, q, c) => stash("<code>" + esc(c.replace(/^ (.*) $/, "$1")) + "</code>"));
  text = esc(text);
  text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => stash(`<img alt="${a}" data-src="${u}">`));
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, s, u) => stash(`<a data-href="${u}">${s}</a>`));
  text = text.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_, p, u) => p + stash(`<a data-href="${u}">${u}</a>`));
  text = text.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^\w*])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
  text = text.replace(/ {2,}$/gm, "<br>");
  for (let n = 0; n < 3 && text.includes("\u0000"); n++) text = text.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[+i]);
  return text;
}

const reHead = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const reFence = /^\s*(```|~~~)(.*)$/;
const reHr = /^\s*([-*_])(\s*\1){2,}\s*$/;
const reItem = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const reTableSep = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;
const indentOf = s => s.match(/^\s*/)[0].replace(/\t/g, "    ").length;

function slug(text, used) {
  let s = text.replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "").toLowerCase().trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
  let id = s, n = 1;
  while (used.has(id)) id = s + "-" + n++;
  used.add(id);
  return id;
}

function splitRow(line) {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|") && !s.endsWith("\\|")) s = s.slice(0, -1);
  const cells = []; let cur = "", inCode = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "`") inCode = !inCode;
    if (ch === "\\" && s[i + 1] === "|") { cur += "|"; i++; continue; }
    if (ch === "|" && !inCode) { cells.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

function dedent(lines) {
  const ind = Math.min(...lines.filter(l => l.trim()).map(indentOf));
  return lines.map(l => l.replace(/\t/g, "    ").slice(Number.isFinite(ind) ? ind : 0));
}

function renderBlocks(lines, used) {
  let html = "", i = 0;
  const startsBlock = l => reHead.test(l) || reFence.test(l) || reHr.test(l) || reItem.test(l) || /^\s*>/.test(l);
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let m;
    if ((m = line.match(reFence))) {            // 코드 블록 (언어가 있으면 색칠)
      const fence = m[1], lang = m[2].trim().toLowerCase(), body = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence)) body.push(lines[i++]);
      i++;
      const code = dedent(body).join("\n");
      const hl = (!lang || lang === "text") && /^#ui[ \t]/.test(code) ? "ui" : lang;   // ```ui 또는 #ui로 시작하는 블록
      const inner = hl ? tokensToLines(highlight(code, hl)).join("\n") : esc(code);
      html += `<pre><code${lang ? ` class="lang-${esc(lang)}"` : ""}>${inner}</code></pre>`;
      continue;
    }
    if ((m = line.match(reHead))) {
      const n = m[1].length, h = inline(m[2]);
      html += `<h${n} id="${slug(h, used)}">${h}</h${n}>`; i++; continue;
    }
    if (reHr.test(line) && !reItem.test(line)) { html += "<hr>"; i++; continue; }
    if (line.includes("|") && i + 1 < lines.length && reTableSep.test(lines[i + 1])) {
      const head = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map(c => c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : "");
      const al = k => aligns[k] ? ` style="text-align:${aligns[k]}"` : "";
      i += 2;
      let tb = "<table><thead><tr>" + head.map((c, k) => `<th${al(k)}>${inline(c)}</th>`).join("") + "</tr></thead><tbody>";
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        const row = splitRow(lines[i++]);
        tb += "<tr>" + head.map((_, k) => `<td${al(k)}>${inline(row[k] ?? "")}</td>`).join("") + "</tr>";
      }
      html += tb + "</tbody></table>"; continue;
    }
    if (/^\s*>/.test(line)) {
      const body = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*> ?/, ""));
      html += `<blockquote>${renderBlocks(body, used)}</blockquote>`; continue;
    }
    if (reItem.test(line)) {
      const r = renderList(lines, i, used); html += r.html; i = r.next; continue;
    }
    const para = [];
    while (i < lines.length && lines[i].trim() && !(para.length && startsBlock(lines[i]))
           && !(lines[i].includes("|") && i + 1 < lines.length && reTableSep.test(lines[i + 1]))) {
      para.push(lines[i++].trim() + (/ {2,}$/.test(lines[i - 1]) ? "  " : ""));
    }
    html += `<p>${inline(para.join("\n"))}</p>`;
  }
  return html;
}

function renderList(lines, i, used) {
  const first = lines[i].match(reItem);
  const base = indentOf(first[1]);
  const ordered = /\d/.test(first[2]);
  const start = ordered ? parseInt(first[2], 10) : 1;
  let html = ordered ? `<ol${start !== 1 ? ` start="${start}"` : ""}>` : "<ul>";
  while (i < lines.length) {
    const m = lines[i].match(reItem);
    if (!m || indentOf(m[1]) !== base || /\d/.test(m[2]) !== ordered) break;
    const text = [m[3]], child = [];
    i++;
    while (i < lines.length) {
      const l = lines[i];
      if (!l.trim()) {
        let j = i + 1; while (j < lines.length && !lines[j].trim()) j++;
        if (j < lines.length && indentOf(lines[j]) > base) { child.push(""); i++; continue; }
        break;
      }
      if (indentOf(l) <= base) break;
      if (!child.length && !reItem.test(l) && !reFence.test(l) && !reTableSep.test(lines[i + 1] || "")) {
        text.push(l.trim()); i++; continue;
      }
      child.push(l); i++;
    }
    html += `<li>${inline(text.join("\n"))}${child.length ? renderBlocks(dedent(child), used) : ""}</li>`;
  }
  return { html: html + (ordered ? "</ol>" : "</ul>"), next: i };
}

const renderMarkdown = text => renderBlocks(text.split("\n"), new Set());

