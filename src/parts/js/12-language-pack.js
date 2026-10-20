// ---------- 언어팩: language/<화면 언어>/ui-check.json5 의 "ui-check" 섹션이 내장 UI_MSG보다 우선 ----------
// 파일에 있는 번역은 파일 것, 없거나 빈 글이거나 {} 개수가 원문과 다르면 내장 번역(없으면 영어 원문)
let uiPack = { path: "", mod: -1, entries: null, skipped: 0, err: "" };
const countBraces = s => s.split("{}").length - 1;
async function uiTable(lang) {
  const path = `language/${lang}/ui-check.json5`;
  const builtin = UI_MSG[lang] || null;
  if (!fileSet.has(path)) return { table: builtin, note: "" };
  try {
    const f = await src.get(path);
    if (uiPack.path !== path || uiPack.mod !== f.lastModified) {
      uiPack = { path, mod: f.lastModified, entries: null, skipped: 0, err: "" };
      try {
        const sec = json5Parse(await f.text())["ui-check"];
        if (!sec || typeof sec !== "object" || Array.isArray(sec)) throw Object.assign(new Error('section "ui-check" not found'), { line: 1 });
        uiPack.entries = Object.create(null);
        for (const [k, v] of Object.entries(sec)) {
          if (typeof v !== "string" || v === "") continue;          // 빈 글 = 번역 안 함
          if (countBraces(k) !== countBraces(v)) uiPack.skipped++;
          else uiPack.entries[k] = v;
        }
      } catch (e) { uiPack.err = t("packErr", path, e.line || 1, e.message); }
    }
  } catch (e) { return { table: builtin, note: "" }; }
  if (uiPack.err) return { table: builtin, note: uiPack.err };
  return { table: Object.assign(Object.create(null), builtin, uiPack.entries),
           note: uiPack.skipped ? t("packSkip", path, uiPack.skipped) : "" };
}

