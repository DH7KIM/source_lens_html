# Changelog

Korean: [CHANGELOG.ko.md](CHANGELOG.ko.md)

## v0.75.0 (2026-10-23)

### source-viewer.html

- **Added a `Document view` column to the `Supported file types` window** (last column, after `Tree view`). Only the type that has the document view (markdown `*.md`) gets `✓`; the others get `—`. The column name is the same word as the `Document` button of the file bar. The rule is the same as for showing that button (language `md`), so a new file type needs no extra entry. The remaining columns (build result, layout preview) are left for later versions.
- 1 translation key (`typesColDocTip`) added to all 10 languages (keys 242 -> 243, the same in all 10 languages). The column name reuses the existing `doc`. The translations are Claude drafts, not yet checked by native speakers.
- Tested: only the `*.md` row gets `✓` and the others `—`; every row has 7 cells (34 rows); the column name and the tip appear in all 10 languages; no errors.
- File size 425,992 -> 427,102 bytes.

## v0.74.0 (2026-10-23)

### source-viewer.html

- **Added a `Tree view` column to the `Supported file types` window** (last column, after `Syntax checker`). It shows `✓` for the types that have the tree view (JSON, JSON with comments, JSON Lines and JSON5) and `—` for the others. The column name is the same word as the `Tree` button of the file bar. The rule is the same as for showing that button (language `json` or `json5`), so a new file type needs no extra entry. The remaining columns (document view, build result, layout preview) are left for later versions.
- 1 translation key (`typesColTreeTip`) added to all 10 languages (keys 241 -> 242, the same in all 10 languages). The column name reuses the existing `treeTree`. The translations are Claude drafts, not yet checked by native speakers.
- Tested: 4 rows (`*.json`, `*.jsonc`, `*.jsonl *.ndjson`, `*.json5`) get `✓` and the others `—`; every row has 6 cells; the filter and the highlight of the current file's row still work; the column name and the tip appear in all 10 languages; the table scrolls sideways in a narrow window; no errors.
- File size 424,868 -> 425,992 bytes.

## v0.73.0 (2026-10-23)

### source-viewer.html

- **Added a `JSONC` item to the syntax box of JSON files** (`Syntax: auto / JSON / JSONC / JSON5 / JSON Lines`). JSONC is JSON with comments: `//` and `/* */` comments are allowed, and everything else is checked as strict JSON (single quotes, unquoted keys, JSON5 numbers and escapes are errors). A trailing comma is an error with the new code **J020** (`trailing comma is not allowed in JSONC`); the help says that JSON5 and some tools (VS Code `settings.json`, `tsconfig.json`) accept it. The choice only applies to the open file, like the other syntax choices.
- **Not changed**: `auto` still reads every JSON file with JSON5 rules (including `.jsonc`), and `JSON` is still strict JSON. Making `.jsonc` files start as `JSONC` is left for a later version (TODO).
- 4 translation keys (`syntax_jsonc`, `syntaxTip_jsonc`, `jsonJ020`, `jsonJ020h`) added to all 10 languages (keys 237 -> 241, the same in all 10 languages), and the check code range in `jsonTip` is now J001-J020. The translations are Claude drafts, not yet checked by native speakers.
- Tested: comments pass in JSONC but not in JSON (J013); a trailing comma gives J020 in JSONC, J014 in JSON and passes in JSON5; single quotes give J015 in JSONC; an unclosed comment gives J001 in JSONC; the results of `auto`, `JSON` and `JSON5` did not change; the box shows `Syntax: JSONC` and the error line shows on screen; the message and the choice text appear in all 10 languages; no errors.
- File size 420,337 -> 424,868 bytes.

## v0.72.0 (2026-10-23)

### source-viewer.html

- **Corrected a wrong comment** in `09-source-folder.js` (comment only, no behavior change): it said the subfolder depth is remembered "per folder", but `KEY` is the path of this HTML file (`location.pathname`), so there is one value per HTML file path, not per opened folder.
- File size 420,269 -> 420,337 bytes (the comment and the version line).

## v0.71.0 (2026-10-23)

### source-viewer.html

- **Added a `Code font size` line to the settings window**: `Small` (12px), `Normal` (13.5px, default), `Large` (15.5px), `Extra large` (18px). It changes the CSS variable `--code-size`, so the source, the tree view and the sample line change together. The markdown body text and the other text on the screen stay the same (code only). The value is remembered as `sv-font-size` (`""` = normal), one value regardless of the folder. A value that is not in the list is treated as normal.
- **Fixed a v0.70.0 bug**: when a theme is applied (`applyTheme` in `17-themes.js`), all inline styles were removed, so the chosen code font (`--mono`) was lost after a reload or a theme change. The code font and the font size are now applied again at the end of applying a theme. Fixed in the same version because the font size does not work without it.
- 5 translation keys (`fontSizeLabel`, `fontSizeSmall`, `fontSizeNormal`, `fontSizeLarge`, `fontSizeXLarge`) added to all 10 languages (keys 232 -> 237, the same in all 10 languages). The translations are Claude drafts, not yet checked by native speakers.
- Tested: in all four sizes the computed font size of the source, the tree view and the sample line changes while other text (such as the header) does not, the font and the size are kept after a reload and a theme change, an unknown stored value is treated as normal, the line name and the choices appear in all 10 languages, no errors.
- File size 417,023 -> 420,269 bytes.

## v0.70.0 (2026-10-23)

### source-viewer.html

- **Added a `Code font` line to the settings window**: choices `Auto`, `Cascadia Code`, `Cascadia Mono`, `Consolas`, `D2Coding`, `Default monospace`. The chosen font is put at the front of the CSS variable `--mono`, followed by the original order (`"Cascadia Code", "Cascadia Mono", Consolas, "D2Coding", "Malgun Gothic", monospace`), so characters the font does not have (such as Korean) are drawn with the next font. The source, the tree view, markdown code and the sample line all change at once.
- The value is remembered as `sv-font` (`""` = auto), one value regardless of the folder. The default is `Auto` (looks the same as before).
- Fonts that are not installed are detected by measuring text width (compared with both `serif` and `sans-serif`: the default `monospace` of Chrome on Windows is Consolas, so comparing only with `monospace` would wrongly report Consolas as missing). A missing font is disabled in the list and marked `(not installed)`. If a remembered font disappears later, it behaves like `Auto` but the remembered value is not deleted.
- 4 translation keys (`fontLabel`, `fontAuto`, `fontGeneric`, `fontMissing`) added to all 10 languages (keys 228 -> 232, the same in all 10 languages). The translations are Claude drafts, not yet checked by native speakers.
- Tested: the line name and the choices appear in all 10 languages, choosing `Default monospace` changes `--mono` and saves `sv-font`, a missing font stored in `sv-font` behaves like `Auto` and the value stays, an installed font (DejaVu Sans Mono in the test environment) can be chosen, no errors. The real look on the user's Windows screen (Cascadia Code, Consolas, D2Coding) is for the user to check.
- File size 413,056 -> 417,023 bytes.

## v0.69.0 (2026-10-23)

### source-viewer.html

- **Shortened the tooltip of the gear (settings) button from `Open the settings window` to `Settings`** (like Windows: the button has no text, so the tooltip is only the name). The `aria-label` is the same `Settings`. 10 languages (`설정`, `Settings`, `設定`, `设置`, `設定`, `Paramètres`, `Einstellungen`, `Impostazioni`, `Ajustes`, `Configurações`). The translation key `settingsTip` is removed and `settingsTitle` is used for both (the number of keys 229 -> 228, the same in all 10 languages).
- The tooltips of the buttons that have text (`Language`, `Supported file types`, `Change folder`) are left as they are: the tooltip would only repeat the text, which does not fit the UI rule of explaining the role in a tooltip.
- Tested: in all 10 languages the tooltip, the `aria-label` and the window title are the same name and not empty, clicking the gear opens the settings window, no errors.
- The file size shrank by 139 bytes (413,195 -> 413,056 bytes).

## v0.68.0 (2026-10-23)

### source-viewer.html

- **Redrew the header icons to fit the pixel grid, and used the document icon shape the user adjusted.** Before, a 24-grid drawing was scaled down (stroke width 1.125px), so the lines looked blurred at 100% zoom. Now the icons of `Language` (globe), `Supported file types` (document), `Change folder` (folder) and the settings gear are all redrawn on a 17x17 grid with a 1px stroke: the coordinates sit at pixel centers (.5), so the lines are sharp, and they are shown at 17px (`.with-icon svg` and `#settingsBtn svg`). At 200% display scale the lines grow cleanly to 2px, but at 150% the icon is 17px x 1.5 = 25.5 screen pixels, so the lines fall on fractional pixels and look less pretty (confirmed by the user, written in the TODO). `currentColor` and the hand-drawn SVG are the same.
- **The document icon follows the one the user adjusted in Paint (the 3rd)**: the margins did not match, so the body grew one cell in width and height (11x15 -> 12x16 cells), and the three lines (the last one short) are one cell longer.
- **The square icons (document and folder) use `shape-rendering: crispEdges`**: when a button sits at a fractional pixel (for example 925.797px), the left vertical line was confirmed to blur over two pixels; with this setting the lines snap to the pixels and look sharp. The round icons (globe and gear) look jagged with it, so they are left as they were (so a round icon can look slightly soft depending on its position).
- Tested: blur comparison at 100% zoom (enlarged 3 times), at widths where the buttons sit at fractional positions (1300px and 1291px), the buttons before and after opening a folder, the `Supported file types` window, the light and dark themes, the text of both buttons is not empty in all 10 languages, no errors. The header bar height is the same as v0.67.0 (83px at 820px, at 1000px only French, German, Italian, Spanish and Portuguese are 83px, 49px at 1300px).
- The file size grew by 207 bytes (413,227 -> 413,434 bytes).

## v0.67.0 (2026-10-23)

### source-viewer.html

- **Added icons to the `Supported file types` and `Change folder` buttons** (the icon rule: a button is icon + text, and only a button with a universal meaning, like the gear, is icon only). The icons are hand-drawn thick-line SVGs (24x24, stroke width 1.5, `currentColor`): a document with lines for `Supported file types` and a folder for `Change folder`. They look like the globe (`Language`), so the three buttons are consistent. They follow the text color in dark themes too.
- Made a shared CSS `.with-icon` (16px icon + text, 6px gap) used by `Language`, `Supported file types` and `Change folder` (it replaces the old `#langBtn` rules; the look is the same). `.with-icon[hidden]` hides the button (so `Change folder` stays hidden before a folder is open).
- The text now goes into `<span id="typesBtnName">` and `<span id="folderName">` (so changing a button's text does not erase its icon). The behavior and translations are the same.
- Tested: before a folder only `Language`, `Supported file types` and the gear show, and `Change folder` appears when a folder is open; the `Supported file types` window opens; checked the light and dark themes; the text of both buttons is not empty in all 10 languages; the header bar height is the same as v0.66.0 (83px at 820px, at 1000px only French, German, Italian, Spanish and Portuguese are 83px, 49px at 1300px); no errors.
- The file size grew by 725 bytes (412,502 -> 413,227 bytes).

## v0.66.0 (2026-10-23)

### source-viewer.html

- **Moved the `Depth` select box from the header bar into the settings window.** In the window it is a `Subfolder levels` row under the theme. It can be chosen before a folder is open too (the value is one value remembered by the path of this HTML file, not by the opened folder, so choosing it with no folder only remembers it and it is used the next time a folder is read). The behavior of the select box (`#depth`) is the same: remembering the value (`sv-depth:<folder>`), reading the list again at once when it changes, going back to the old level if the reading is cancelled, and not selectable while reading. The header bar keeps only `Language`, `Supported file types`, (`Change folder`) and the gear.
- A new translation key `depthLabel` (10 languages, newly translated in this conversation, not yet checked by native speakers). The number of keys is 229 (was 228).
- Tested: it can be chosen with no folder and is remembered, open a folder -> default 4 levels, changing to 2 levels reduces the files from 10 to 6 and `sv-depth` remembers 2, the row name is not empty in all 10 languages, no errors.
- Header bar height (folder open): 83px at 820px width (English, Korean and others; the previous version was 106px in Spanish), 49px at 1000 and 1300px (one line). The height difference between buttons is gone because the select boxes are all out.
- The file size grew by 618 bytes (411,884 -> 412,502 bytes).

## v0.65.0 (2026-10-23)

### source-viewer.html

- **Moved the gear (settings) button to the far right end of the header bar.** The order is now `Language`, `Supported file types`, (`Depth`, `Change folder`), gear. The gear is at the far right also when no folder is open. Only the button order changed; the behavior, texts and CSS are the same.
- The file size is the same (411,884 bytes).

## v0.64.0 (2026-10-23)

### source-viewer.html

- **Moved the theme select box from the header bar into the settings window** (the theme is a value you change about once). The header bar keeps only `Language`, `Supported file types`, the gear and (when a folder is open) `Depth` and `Change folder`. The window that opens with the gear has the `Theme (text and syntax colors)` select box at the top and `Ligatures` below it. The select box (`#theme`) and its behavior in `17-themes.js` (the light and dark groups, remembering in `sv-theme`, following the system setting) are the same; only the place changed. When the window opens, the focus is on the theme box.
- **Renamed `Font settings` to `Settings`** (the window now has things that are not about fonts): the window title, the button tooltip and the `aria-label` are now `Settings` and `Open the settings window` (10 languages). The translation keys `fontTitle` and `fontTip` became `settingsTitle` and `settingsTip` (the values were translated again; the number of keys stays 228), the element names `fontBtn`, `fontDlg`, `fontTitle` and `fontClose` became `settingsBtn`, `settingsDlg`, `settingsTitle` and `settingsClose`, the part `12b-font-settings.js` became `12b-settings.js`, the function `drawFontStatic()` became `drawSettingsStatic()`, and the CSS `#fontBtn` and `#fontDlg` became `#settingsBtn` and `#settingsDlg`. The ligature names (`fontLig*`, `sv-ligatures`) are about fonts, so they stay.
- A row style inside the window: `.set-line` (the name on the left, the select box on the right, a thin line below).
- Tested: in all 19 themes the background, text, accent, syntax colors, font and error color are the same as in v0.63.0; changing the theme, remembering in `sv-theme`, keeping it after reload, following the system (the background differs between light and dark settings), the ligature switch and the `Language` and `Supported file types` windows still work, the close button and clicking outside, the window title, theme names and group names are not empty in all 10 languages, no errors.
- Header bar: the theme box is gone, but with a folder open the height is almost the same (only Spanish at 820px width went from 148px to 106px), because the status line (`lines, size, encoding, auto refresh`), `Depth` and `Change folder` take much of the width. It will be measured again in the next version, which moves `Depth` into the settings window.
- The file grows by 1,368 bytes (410,516 → 411,884 bytes).

## v0.63.0 (2026-10-23)

### source-viewer.html

- **`Font settings` window and the ligature switch**: a button with only a gear icon (an SVG made for this project, with the tooltip `Open the font settings window` and an `aria-label`) is added to the header bar, and it opens a settings window. For now it has one check box, `Ligatures`: it turns on or off the joining of characters such as `!=`, `->` and `=>` into one shape by code fonts. The default is off (the source is shown exactly as written, as decided in v0.58.0). A preview line under the description (`a != b -> c => d >= e === <!-- -->`) changes immediately when you switch it, so you can see the effect on the screen. The description says that only fonts that support ligatures (for example Cascadia Code) look different.
- When on, it applies to the source view (`.code`), the tree view, markdown code blocks and the code in the `Supported file types` table. The value is remembered in `sv-ligatures` ("1" = on), one for all folders (like `sv-lang`). In CSS, the `font-variant-ligatures: none` of v0.58.0 became `var(--lig, none)` and `body.ligatures { --lig: normal }` turns it on (the rule still comes after the `font:` shorthand, which would reset the value).
- The new part `parts/js/12b-font-settings.js` holds opening the window, the check box, remembering and the fixed texts. Closing the window uses the common part of v0.61.0 (`wireTableDialog`). Choosing the font and the font size will be added to this window in later versions.
- 4 new translation keys (`fontTitle`, `fontTip`, `fontLigatures`, `fontLigaturesDesc`) in the 10 languages, 228 keys each. **All translations are Claude drafts and not yet checked by native speakers.**
- Tested: with Cascadia Code, off shows `!=`, `->` and `=>` as typed and on joins them (seen on the preview line). When on, `.code`, `.tj-root`, `.md pre` and `.md code` all follow it; it is remembered after reload; the check box is right when the window opens; clicking the name toggles it; 3 ways of closing (the close button, outside, Esc); the window texts are not empty in all 10 languages; the `Language` and `Supported file types` windows still work; no errors. The gear button is 34px high like the other buttons (the header bar stays 49px at 1300px width).
- The file grows by 7,507 bytes (403,009 → 410,516 bytes: 40 translated texts, the window code, the gear icon).

## v0.62.0 (2026-10-23)

### source-viewer.html

- **`Language` window** (the language select box in the header bar is now a button): the button shows a globe icon made for this project (SVG, 264 bytes, `currentColor` so it follows the theme) and the document language's own name (e.g. `English`). It opens a table window with the columns `Name` (in the current screen language, from `Intl.DisplayNames`), `Original name` (the language's own name) and `Code`. The new part `parts/js/12a-language-picker.js` uses the common part from v0.61.0 (`11a-dialog-table.js`: filter, open, close). The old `langName()` and `drawLangs()` moved there from `11-list-width-and-helpers.js`.
- Choosing: click a row, or Enter/Space with the focus on a row, or Enter when the filter leaves one row. The current language row is highlighted (background, bold, left bar) and scrolled into view when the window opens. Choosing the same language only closes the window. The choice is remembered in `sv-lang` only when chosen by hand (as before).
- Filter: the same rule as the `Supported file types` window (start of a word). It searches the name in the current screen language, the original name and the code (`pt`, `port` and `포르` find Portuguese, `zh` finds both Chinese rows). Chinese is asked as `zh-Hans`/`zh-Hant` so it reads as Simplified/Traditional instead of "Chinese (China)".
- The list is the same as before: the 10 built-in screen languages plus the document languages of the opened folder (e.g. `zh`, which only has `name.zh.md` files, appears as `Chinese | 中文 | zh`, and choosing it changes only the document language).
- 8 new translation keys (`langTitle`, `langFilterHint`, `langFilterTip`, `langNone`, `langColName`, `langColOwn`, `langColCode`, `langCurrent`) in the 10 languages, 224 keys each. **All translations are Claude drafts and not yet checked by native speakers.**
- Header bar: the language box shrinks from 162px to 86-100px (ko 86, en 92, es 96, fr 100), so English at 1300px width goes from two lines (83px) to one line (49px). The button is 34px high like the other buttons (the select box was 29px), so at widths where the bar wraps (Spanish and French at 1300px, etc.) the height can grow by 5px.
- Tested: the button text, opening the window, the number of rows, the name column, 7 filter inputs, Enter, clicking a row, choosing the same language, 3 ways of closing, the keyboard, remembering after reload, the window texts not empty in all 10 languages, and a document-only `zh` all work with no errors. The light and dark themes were checked by screenshot. The `Supported file types` window still works.
- The file grows by 8,870 bytes (394,139 → 403,009 bytes: 80 translated texts, the window code, the icon).

## v0.61.0 (2026-10-23)

### source-viewer.html

- **Moved the common part of the `Supported file types` window into its own part** (so the next version's `Language` window can share it; the screen and behavior are the same): the new part `parts/js/11a-dialog-table.js` holds the filter (`filterTableRows`), opening the window (`openTableDialog`: clear the filter → draw the table → open → focus the filter → scroll to the current row) and closing (`wireTableDialog`: the close button and clicking outside the window). `12-supported-types.js` keeps only what belongs to this window (the columns, building the words from extensions, file names and the language, the syntax checker names).
- CSS names: the table frame and the current-row highlight are now `.dlg-table`, `.dlg-none` and `.dlg-note` (from `.types-table`, `.types-none` and `.types-note`); things only this table has, such as the column width and the `code` font, stay in `.types-table`.
- Tested: in the 10 languages the table HTML, the results of 8 filter inputs, both ways of closing and the focus on the filter at opening are the same as v0.60.0, and the table styles (computed values, including the current-row highlight) are the same in the light and dark themes. No errors.
- The file grows by 1,035 bytes (393,104 → 394,139 bytes: the common function names and comments).

## v0.60.0 (2026-10-23)

### source-viewer.html

- **Changed `글자` to `문자` / `소스 코드` in the Korean screen** (when `글자` means a character, the usual word is `문자`; the same messages already use `영문자` and `문자열`). 7 places in 6 lines of `01-strings-ko.js`: `tomlT002h` `다른 글자는` → `다른 문자는`, `tomlT006` `알 수 없는 글자가` → `알 수 없는 문자가`, `tomlT006h` `남는 글자를` → `남는 문자를`, `jsonJ009` `올바르지 않은 글자` → `올바르지 않은 문자`, `jsonJ010` `값 뒤에 글자가` → `값 뒤에 문자가`, `typesFilterTip` `입력한 글자로` → `입력한 문자로`, `typesColColorTip` `소스 글자를` → `소스 코드를`.
- The `글자색` in `테마 (글자·문법 색)` is the usual expression, so it is unchanged. No other language changed.
- Tested: all 10 language files still have the same 216 keys and load without errors; the joined file keeps the same size (393,104 bytes, because the replaced words have the same byte length).

## v0.59.0 (2026-10-23)

### source-viewer.html

- **Changed "글자 파일" to "텍스트 파일" in the Korean screen** (`텍스트` is the usual word, as Notepad calls it `텍스트 문서`): the `.txt` description `일반 글자 파일` → `일반 텍스트 파일`, and the message for a file that is not a text file (a file containing 0 bytes) `글자 파일이 아니라 보여 줄 수 없습니다.` → `텍스트 파일이 아니라서 보여 줄 수 없습니다.` (two places in `01-strings-ko.js` only. The other languages already say `text file`, `texte`, etc., so they are unchanged).
- The remaining `글자` that means a character (`알 수 없는 글자`, `올바르지 않은 글자` and 3 more in error messages) and `소스 글자` mean something different, so they are not changed in this version (TODO).
- Tested in the Korean screen: opened `bin.txt` (with a NUL byte) to see the new message, and opened a `.txt` file and then `Supported file types` to see the new description in the `*.txt` row. No errors.
- The file grows by 9 bytes (393,095 → 393,104 bytes).
- Branch `text-file-wording`.

## v0.58.0 (2026-10-23)

### source-viewer.html

- **Turned off ligatures in the code font**: fonts such as `Cascadia Code` draw `-->`, `->`, `!=`, `<=` and `&&` as a single shape (`⟶`, `→`, `≠`, `≤`), so an HTML comment `<!-- … -->` looked like `<!— … —>`. Now the text is shown exactly as written (the file content was never changed, only how it was drawn). `font-variant-ligatures: none` is applied to the source view (`.code`), the JSON tree view (`.tj-root`), code in Markdown (`.md code`, `.md pre`) and the extensions in the `Supported file types` table (`01-style.css`). It is placed after those rules because the `font:` shorthand resets this value.
- The font list (`--mono`) is unchanged. On PCs where a font without ligatures (`Cascadia Mono`, `Consolas`, `D2Coding`) is picked, nothing changes.
- A `Font settings` window that lets the user turn ligatures on and off stays in the TODO (user choice, off by default).
- Tested: the ligature value is `none` in every code text box of the merged file, and with the real `Cascadia Code` the shapes differ between ligatures on and off (on: `⟶ ≠ → ≤ ≥`, off: `--> != -> <= >=`). A side-by-side of both shapes inside the viewer could not be made (the test environment does not join them even when on), so this still needs a check on a PC with a ligature font installed. No errors.
- The file grows by about 0.3KB (392,759 → 393,095 bytes).
- Branch `ligatures-off`.

## v0.57.0 (2026-10-23)

### source-viewer.html

- **Added source-view coloring for `.html` and `.htm`**: tag names, attribute names, attribute values (quoted or not), comments `<!-- -->`, `<!doctype>`, `<![CDATA[` and `<?xml`, and entities such as `&amp;`. Multi-line tags and unclosed quotes are handled (`htmlTag()`, `RULES.html`, `03-highlight.js`).
- The inside of `<script>` and `<style>` is shown without coloring (there are no JS or CSS colorers yet; the text up to the closing tag is skipped as a whole so that something like `a<b` is not mistaken for a tag).
- Added one `html` line to `FILE_TYPES` and the `desc_html` description (10 languages), so a `*.html *.htm` row appears in the `Supported file types` window and `.html` files now appear in the folder list.
- ```` ```html ```` code blocks in Markdown are colored with the same rules.
- The part of `highlight()` that skips uncolored text in one go no longer skips `<` and `&` (HTML rules start with them). The coloring of the other languages is unchanged: C++, Rust, TOML, JSON, BAT and shell samples color character for character the same as before.
- Tested with the new sample `tests/samples/project/html/page.html` (tags, attributes, entities, comments, `a<b` inside `<script>`, multi-line tags, an unclosed quote), and a 1.5MB HTML file colors in about 0.5 seconds (about 0.4 seconds for C++ of the same size). No errors.
- The file grows by about 2KB (390,682 → 392,759 bytes).
- Branch `html-highlight`.

## v0.56.0 (2026-10-23)

### source-viewer.html

- **The `Supported file types` window highlights the row of the type of the file you have open**: background, bold text and a left bar (not color alone). When the window opens, that row is scrolled into view, and hovering it shows the tooltip "Type of the open file" (one new UI string key, `typesCurrent`, added to all 10 languages).
- Added `typeOf(path)` to `02-file-kinds.js`: it finds the `FILE_TYPES` entry in the same order as `langOf()` (file name, then compound extensions such as `ui.log`, then the last extension). `foo.ui.log` highlights the `*.ui.log` row, not `*.log`.
- No highlight on the start screen (no file open) or for a file whose type is not in the table. If the filter hides the row, the highlight is hidden too and returns when the filter is cleared.
- Tested: `.cpp`, `Makefile`, `.ui.log`, `.ui`, `.log`, the start screen, light and dark screens, Korean and English. No errors.
- The file grows by about 2KB (388,692 → 390,682 bytes).
- Branch `types-current-row`.

## v0.55.0 (2026-10-22)

### source-viewer.html

- **Added Portuguese (`pt`) screen strings** (`01-strings-pt.js`, 214 keys, including the 33 `desc_<id>` descriptions). Written in **Brazilian** Portuguese (infinitives for buttons, imperative in sentences). Draft translated by Claude, not yet checked by native speakers. Added `pt: "Português"` to `LANG_NAMES` (the list shows `Português (pt)`).
- **One `pt` only, not split into `pt-br` and `pt-pt`** (decided 2026-10-22): a browser language of `pt-BR` or `pt-PT` both open `pt` (the `langCodeOf` rule is unchanged). If European Portuguese wording (`ficheiro`, `ecrã`, …) is needed, a native speaker can add `pt-pt` later.
- Portuguese plurals follow `Intl.PluralRules` (v0.52.0), which treats 0 and 1 as singular (`0 linha`, `1 linha`, `2 linhas`).
- Tested with the browser language set to `pt-BR`, `pt-PT` and `pt`: start language, language list, `.toml` error messages and status lines. The 214 keys match English and every `{0}` placeholder matches. No errors.
- File size grew by about 15 KB (373,450 → 388,692 bytes).
- Branch `lang-pt`.

## v0.54.0 (2026-10-22)

### source-viewer.html

- **Added Spanish (`es`) screen strings** (`01-strings-es.js`, 214 keys, including the 33 `desc_<id>` descriptions). Written in neutral Spanish (infinitives for buttons, `usted` in sentences). Draft translated by Claude, not yet checked by native speakers.
- If the browser's preferred language is Spanish (`es`, `es-ES`, `es-MX`, …), the viewer now starts in Spanish. The language list shows `Español (es)` (it was already in `LANG_NAMES`).
- Spanish plurals use the `Intl.PluralRules` support from v0.52.0 (`0 líneas`, `1 línea`, `2 líneas`).
- Tested with the browser language set to `es-ES`: start language, language list, `.toml` error messages, status lines for `.json` and `.cpp`, and the `Supported file types` window. The 214 keys match English and every `{0}` placeholder matches. No errors.
- File size grew by about 15 KB (358,039 → 373,450 bytes).
- Branch `lang-es`.

## v0.53.0 (2026-10-22)

### source-viewer.html

- **A file of 0 bytes now shows `Empty file` in the status line instead of a line count** (for example `Empty file · 0 B · UTF-8`). Before, it showed `1 line · 0 B`, which made it look as if the file had one line. Only 0 bytes counts: files with just spaces or blank lines (`1 line · 2 B` and so on) still show the line count.
- Added one screen string, `emptyFile`, to all 8 languages (214 keys each): `빈 파일`, `Empty file`, `空のファイル`, `空文件`, `空白檔案`, `Fichier vide`, `Leere Datei`, `File vuoto`. Draft translated by Claude, not yet checked by native speakers.
- Tested: 0-byte `.txt` and `.md`, a 2-line `.txt`, a `.txt` with only spaces, and a `.json` containing `[]`, each opened in all 8 languages. No errors.
- Branch `empty-file`.

## v0.52.0 (2026-10-22)

### source-viewer.html

- **Plural forms now follow each language's rules**: `{0|form1|form2|…}` in `t()` picks the form with `Intl.PluralRules` (UI language). With 2 forms, `one` uses the first and everything else the second (so French 0 now reads "0 fichier"). With 3 or more forms, the language's categories (`zero one two few many other`) are put in that order and matched to the forms in the same order (Russian `{0|файл|файла|файлов}`: 1 → файл, 2 → файла, 5 and 11 → файлов, 21 → файл, 22 → файла, 25 → файлов, 101 → файл, 111 → файлов). If forms are missing, the last one is used.
- Existing language files are unchanged. All 3,624 existing `{n|…|…}` texts in the 8 languages (numbers 0 to 150) were compared with the old behavior, and only French 0 differs (intended).
- No translations were mixed in (new languages such as `ru` come in later versions).
- Branch `plural-rules`.

## v0.51.0 (2026-10-22)

### source-viewer.html

- **Added a `Description` column to the `Supported file types` table** (after Language): one line saying what each file is (e.g. `*.rc` → "Windows resource script (icons, menus, dialogs, version info)"). All 33 types, all 8 languages (33 `desc_<id>` strings + 2 column strings). Drafts translated by Claude, not yet checked by native speakers.
- Every type in `FILE_TYPES` now has an `id` (used for the description string key). Checked that the extension / file name → highlighting tables are identical to before.
- The filter does not search descriptions (only extensions, file names and language names), so words inside descriptions cannot make a check like `.py` wrong.
- **The table header row now has the panel background** and a stronger bottom line, so it stands out while scrolling (follows every theme automatically).
- The extension list now wraps and the headers stay on one line (the table still fits the window at 820px with the extra column). On very narrow screens (about 420px) the table scrolls sideways.
- The file grew by about 18KB because of the description strings (about 339KB → 357KB).
- Branch `types-description`.

## v0.50.0 (2026-10-22)

### source-viewer.html

- **Added a filter box to the `Supported file types` window**: typing in the box above the table keeps only the rows whose extension, file name or language name **starts with** the text. `py`, `.py`, `*.py`, `makefile` and `C++` all work the same way, and case is ignored. If no row matches, it says "“.py”: not a supported type". The cursor goes to the box when the window opens, and the box is empty every time. The `×` on the right and the first Esc clear the text.
- Text in the middle of a word does not match (a test showed `py` wrongly matching `copying` (License); fixed).
- Added 3 screen strings (`typesFilterHint`, `typesFilterTip`, `typesNone`) to all 8 languages. Drafts translated by Claude, not yet checked by native speakers.
- Branch `types-filter`.

## v0.49.0 (2026-10-22)

### source-viewer.html

- **Added the `Supported file types` button and table window**: the button next to the theme box in the header opens a modal window with a table. Columns: `Extension · File name` / `Language` / `Syntax highlighting` / `Syntax checker`. It reads `FILE_TYPES` (v0.47.0~), so adding a file type to the table adds it to this window too. Highlighting is read from the highlight rule table (`RULES`) and the checker from the `check` column. A note below says that files with extensions not in the table do not appear in the list.
- The window is a `<dialog>`: the page behind it cannot be clicked while it is open, and it closes with Esc, `Close`, or a click outside. The button is also visible on the start screen (before a folder is opened).
- Added 15 screen strings (`types*`) to all 8 languages. Drafts translated by Claude, not yet checked by native speakers.
- File names without an extension (`Makefile`, `LICENSE`, …) are now written in `FILE_TYPES` as shown on screen (with their case) and lower-cased only when matching (behavior unchanged).
- The description column (what each file is) comes in the next version.
- Branch `types-dialog`.

## v0.48.0 (2026-10-22)

### source-viewer.html

- **Added the syntax checker column `check` to `FILE_TYPES`** (`02-file-kinds.js`): `ui` for `.ui`, `toml` for `.toml` and `Cargo.lock`, `json` for the JSON family (`.json`, `.jsonc`, `.jsonl`, `.ndjson`, `.json5`), empty for everything else. `.ini`, `.cfg` and `.editorconfig` are highlighted as TOML but are not TOML, so they are not checked and stay empty. The `Supported file types` screen will read this column to show whether a checker exists (next version).
- Behavior is unchanged. Checked that `check` matches the real checker selection (`isTomlFile`, `isJsonFile`, `.ui`) for every extension and file name (53 paths).
- Branch `check-column`.

## v0.47.0 (2026-10-22)

### source-viewer.html

- **Added the file type table `FILE_TYPES`** (`02-file-kinds.js`): every extension and file name now has a language name (e.g. `ps1` → PowerShell) and a highlighting kind in one table. `LANG_BY_EXT` and `LANG_BY_NAME` are built from it, so a new file type is one line in the table. The `Supported file types` button (next version) will read this table.
- Behavior is unchanged: the same extensions get the same highlighting and the same files appear in the tree (checked that all 45 extensions and 7 file names match the old tables). New extensions such as `.py` and `.cs` are not added in this version.
- Branch `info-table`.

## v0.46.0 (2026-10-21)

### source-viewer.html

- **Added Italian (`it`) screen strings** (`01-strings-it.js`, 160 keys). Draft translated by Claude, not yet checked by a native speaker. It is picked automatically when the browser language is `it-IT`, `it-CH` and the like. Uses “ ” quotes and the imperative (Scegli …).
- Theme names and `.ui` error descriptions are still not translated (TODO).
- Added a note to `src/README`: right-to-left languages (Arabic, …) need screen layout support in addition to a translation file.
- Branch `lang-it`.

## v0.45.0 (2026-10-21)

### source-viewer.html

- **Added German (`de`) screen strings** (`01-strings-de.js`, 160 keys). Draft translated by Claude, not yet checked by a native speaker. It is picked automatically when the browser language is `de-DE`, `de-AT`, `de-CH` and the like. Uses „ “ quotes and the formal "Sie".
- Theme names and `.ui` error descriptions are still not translated (TODO).
- Branch `lang-de`.

## v0.44.0 (2026-10-21)

### source-viewer.html

- **Added French (`fr`) screen strings** (`01-strings-fr.js`, 160 keys). Draft translated by Claude, not yet checked by a native speaker. It is picked automatically when the browser language is `fr-FR`, `fr-CA` and the like. Uses « » quotes and a space before colons.
- Known limit: plural forms are singular only when the number is 1, so 0, which is singular in French, shows as "0 fichiers" (TODO).
- Theme names and `.ui` error descriptions are still not translated (TODO).
- Branch `lang-fr`.

## v0.43.0 (2026-10-21)

### source-viewer.html

- **Added Traditional Chinese (`zh-tw`) screen strings** (`01-strings-zh-tw.js`, 160 keys). Not a character conversion of the Simplified table: translated separately with Taiwan terms (資料夾, 檔案, 原始碼, 版面配置, …). Draft translated by Claude, not yet checked by a native speaker. It is picked automatically when the browser language is `zh-TW`, `zh-HK`, `zh-MO` or `zh-Hant`.
- Theme names and `.ui` error descriptions are still not translated (TODO).
- Branch `lang-zh-tw`.

## v0.42.0 (2026-10-21)

### source-viewer.html

- **Added Simplified Chinese (`zh-cn`) screen strings** (`01-strings-zh-cn.js`, 160 keys). Draft translated by Claude, not yet checked by a native speaker. The language box now shows `中文(简体) (zh-cn)`, and it is picked automatically when the browser language is `zh-CN` and similar. (`zh-TW` and `zh-HK` stay English until a `zh-tw` table exists.)
- Theme names and `.ui` error descriptions are still not translated (TODO).
- Branch `lang-zh-cn`.

## v0.41.0 (2026-10-21)

### source-viewer.html

- **Added Japanese (`ja`) screen strings** (`01-strings-ja.js`, 160 keys). Draft translated by Claude, not yet checked by a native speaker. The language box now shows `日本語 (ja)`, and it is picked automatically when the browser language is Japanese.
- The `.ui` error description table (`05-ui-messages.js`) is Korean only, so those messages stay in English on the Japanese screen (TODO).
- Branch `lang-ja`.

## v0.40.0 (2026-10-21)

### source-viewer.html

- **The language chosen in the language box is remembered** (browser storage key `sv-lang`, one value for all folders, like the theme). At start it is used before the browser language. It is saved only when the language is picked in the box, and only languages with a screen text table are used (a document-only language, or an unknown value, is ignored). When the storage is blocked the viewer works as before.
- There is no "back to automatic" item yet (TODO).
- Branch `lang-remember`.

## v0.39.0 (2026-10-21)

### source-viewer.html

- **The screen language at start follows the browser's preferred languages**: the list is read from the front and the first language that has a screen text table is used (`zh-TW`, `zh-HK` and `zh-Hant` map to `zh-tw`, any other `zh` to `zh-cn`; `ja-JP` becomes `ja`), otherwise `en`. Languages added later work without changing the rule. The chosen language is still not remembered.
- Branch `lang-auto-select`.

## v0.38.0 (2026-10-21)

### source-viewer.html

- **The language box shows each language's own name with its code**: `한국어 (ko)`, `English (en)`, `日本語 (ja)`, `Français (fr)`, `中文(简体) (zh-cn)`. The names are no longer translated into the screen language, so a language can be found even when the screen language cannot be read.
- The `langName_<code>` keys are removed from the screen texts; the names come from `LANG_NAMES` only.
- Branch `lang-own-names`.

## v0.37.2 (2026-10-21)

### source-viewer.html

- **The language box is a plain select box again** (it behaves like the theme and subfolder boxes): the column styling of v0.37.0 (`appearance: base-select`) and the explicit list position of v0.37.1 are removed. The position, keyboard and click-outside behavior are the browser's own, so the list can no longer cover the closed box.
- Each item shows only the name in the screen language (for example `중국어(간체)`). The names still come from the `langName_<code>` keys.
- Branch `lang-plain-select`.

## v0.37.1 (2026-10-21)

### source-viewer.html

- **The language list opens right below the closed box**: in the user's Edge and Chrome the list opened over the closed box and hid it. The position is now set explicitly with CSS anchor positioning (`anchor-name`, `position-anchor`, `position-area: block-end span-inline-end`, flips if there is no room). It was not reproducible in the test Chromium 141, so the fix is confirmed there only (no regression); confirmation in Edge and Chrome is up to the user.
- Branch `lang-list-position`.

## v0.37.0 (2026-10-21)

### source-viewer.html

- **Items of the language list box are lined up in columns**: each item shows `name in the screen language | the language's own name | code` with even spacing (for example `일본어  日本語  ja`, and `Japanese  日本語  ja` on an English screen). The own-name cell is left empty on the line of the screen language. The closed box shows only the name of the chosen language. The translated names are the `langName_<code>` keys in `01-strings-ko.js` and `01-strings-en.js` (the language's own name is used when a key is missing).
- It uses the styling of select boxes in new Chrome and Edge (135 or later, `appearance: base-select`). Other browsers show a plain list with names only; it works the same.
- Branch `lang-columns`.

## v0.36.0 (2026-10-21)

### source-viewer.html

- **Language buttons became a list box**: the `한국어` and `English` buttons in the header are one list box now. It always lists the built-in screen languages together with the document languages of the opened folder (`name.<code>.md`); before, it showed only document languages and only when there were two or more. It can be used on the start screen too. Language names are not translated: each is written in its own language (`한국어`, `English`, `日本語`, `中文(简体)`, `中文(繁體)`, `Français`, `Deutsch`, `Italiano`, `Español`), in the order of the name table (`LANG_NAMES`). The tooltip is "Show the screen and documents in this language".
- **Documents without the chosen language**: choosing `한국어` on a document that exists only in English did nothing visible. Now the document that exists (the English one) is opened, the status line says `No "한국어" document; showing the "English" document`, and the chosen language stays. (Cause: every time a document was opened, the document and screen language were overwritten by the language of the opened file.) Going straight to a document of another language (a link, for example) still switches to that language as before.
- Added `zh-cn`, `zh-tw`, `fr`, `de`, `it` and `es` to `LANG_NAMES` (this also fixes `zh-cn` being shown as plain text). Choosing a language that has no screen text table changes only the document language; the screen texts stay as they are.
- Branch `lang-select`.

## v0.35.0 (2026-10-21)

### source-viewer.html

- **Screen texts split into one file per language**: Korean and English, which shared `01-strings.js`, are now `01-strings-ko.js` (`UI.ko`) and `01-strings-en.js` (`UI.en`); `01-strings.js` keeps only the empty `UI` table, the language names and `t()`. A new language is one more file (see "Adding a language" in `src/README`).
- Behavior is unchanged: the `UI` table has exactly the same content as before (159 texts each in Korean and English, compared with Node). The joined HTML is a few lines longer because of the header comments.
- Branch `strings-split`.

## v0.34.0 (2026-10-21)

### source-viewer.html

- **Removed reading language packs from the folder**: the feature (v0.14.0) that read `language/<language>/ui-check.json5` from the opened folder and put it before the built-in translation is gone. `.ui` error descriptions now use only the built-in table (`UI_MSG`). Also removed: the folder language-pack reader (`12-language-pack.js`), the small JSON5 reader only it used (`04-json5.js`), and the red status-line notices ("cannot read language pack", "translations ignored") with their texts. A new language is now added in the source (`.js`); the next version splits the files per language.
- Nothing changes on screen: `.ui` error descriptions are the same as before in Korean (with the English original) and English (checked on screen).
- Removed the sample `tests/samples/project/language/ko/ui-check.json5` (`main.json5` stays as the JSON5 coloring sample).
- Branch `lang-pack-remove`.

## v0.33.0 (2026-10-21)

### source-viewer.html

- **Choose the JSON syntax**: when a JSON or JSON5 file is open, the file bar has a `Syntax: auto / JSON / JSON5 / JSON Lines` box. The file is checked again with the chosen syntax, and the tree view reads it the same way. Opening another file goes back to auto (the choice is not remembered per extension).
  - **auto**: as before: JSON5 rules, and files with one value per line are recognized as JSON Lines.
  - **JSON**: strict JSON. New errors J013 (comments), J014 (trailing comma), J015 (single quotes), J016 (unquoted key), J017 (JSON5 numbers: `+1`, `.5`, `1.`, hex, Infinity, NaN, leading zeros), J018 (escapes JSON does not have, such as `\x`), J019 (control character in a string).
  - **JSON5**: JSON5 rules. More than one value is an error (J010), not JSON Lines.
  - **JSON Lines**: one strict JSON value per line. Every bad line is reported (a comment line is an error too).
- Sample `tests/samples/project/json/json5-in-json.json` (extension `.json`, content JSON5).
- Branch `json-syntax`.

## v0.32.0 (2026-10-20)

### source-viewer.html

- **File count in front of the path**: `upload folder (55 files) / samples/test.ko.md`, or `name v0.28.0 folder (55 files) / ...` when the folder has a project version. The number is the files in the list (supported types only; skipped folders and levels beyond the chosen one are not counted). It follows reading the folder again and changing the subfolder level. The tooltip explains this.
- Branch `file-count`.

## v0.31.0 (2026-10-20)

### source-viewer.html

- **File list highlight is fast with many files**: hovering a row was slow with thousands of files because the browser walked every row of the list each time. Rows are now grouped 200 at a time, and groups outside the screen are not drawn (`content-visibility: auto`). Test with 20,000 rows: the cost of one hover went from about 106 ms to about 3 ms. Looks and behavior are the same.
- Branch `nav-hover`.

## v0.30.0 (2026-10-20)

### source-viewer.html

- **Opening a file no longer redraws the whole file list**: it only moves the highlight of the current file (and the "contains the current file" mark of closed folders). The list is still redrawn when a folder is opened up for the file, when the document or screen language changes, and when the folder is read again. Test with 60,000 files: a click used to redraw the list (about 5 s) and now takes about 0.1-0.4 s, almost all of it reading the file.
- Branch `nav-select`.

## v0.29.0 (2026-10-20)

### source-viewer.html

- **File list width is no longer calculated**: the list uses a fixed default width (230px) and you drag the edge to change it. Double-clicking the edge now goes back to the default width (it used to fit the longest name). Fitting measured every row, which made opening a file take seconds with thousands of files: redrawing the list took 2.25 s for 1,500 files and now takes 0.13 s.
- Not changed: `docs-viewer.html` still has the old width fitting.
- Branch `nav-width`.

## v0.28.0 (2026-10-20)

### source-viewer.html

- **Reading indicator and cancel**: while a folder is being read (File System Access), the header shows `Reading folder... N files · 3.2 s` with a `Cancel` button. It appears only after 0.4 s, so quick reads do not flicker. Choosing another folder or level is disabled while reading.
- **Cancel goes back to the previous list**: the folder, the list and the open file stay as they were; a cancelled level change restores the old level. A new folder is saved only after reading finishes.
- Not for the `webkitdirectory` way (the browser hands over the whole list at once). The quiet re-read on window focus has no indicator and is skipped while a read is running.
- The scan now pauses for a moment every 30 ms, so the page (Cancel button, elapsed time) keeps responding even with tens of thousands of files. Without it the page froze while reading a very large folder.
- Branch `folder-reading`.

## v0.27.0 (2026-10-20)

### source-viewer.html

- **Same height for the header bar and the button row**: both rows now use one shared height (`--row`, 49px) with their contents centered, so the top and bottom spacing match. Before, the header was about 52px and the button row 41px with tighter spacing.
- Branch `toolbar-height`.

## v0.26.0 (2026-10-20)

### source-viewer.html

- **Subfolder levels**: a new select in the header (next to `Change folder`) with `2 / 4 / 6 / 8 subfolder levels` and `All subfolder levels` (default 4, the same as the old fixed value). Changing it reads the list again; the open file stays if it is still in range, otherwise the first file opens. The choice is remembered in the browser. `All subfolder levels` shows a tooltip warning that it can take a long time for big folders.
- Both ways of reading a folder (File System Access and `webkitdirectory`) follow the same level.
- Not in this version (candidate for later): a "reading..." indicator and cancel.
- Branch `folder-depth`.

## v0.25.0 (2026-10-20)

### source-viewer.html

- **Word wrap** button, added to the button bar. When on, long lines in the source view are wrapped to the window width (no horizontal scroll); when off, each line stays on one long line. The line number appears only on the first row of a wrapped line, and error underlines and diagnostic lines stay aligned. The choice is remembered in the browser (default: off). Shown in the source view and the raw Markdown view only; hidden in the tree view and the rendered document view.
- Branch `word-wrap`.

## v0.24.0 (2026-10-20)

### source-viewer.html

- **Button bar**: the buttons that depend on the open file (`Source` / `Tree`, the error-details toggle, the Markdown mode and the layout preview) moved from the top header to a fixed bar right above the content. Language, theme and folder stay in the header. The bar stays when a file with no such buttons is open, so the content does not jump, and it is hidden on the start screen. Layout only; nothing else changed.
- Fixed an empty box left behind by the hidden `Source | Tree` switch.
- Branch `toolbar-layout`.

## v0.23.0 (2026-10-20)

### source-viewer.html

- JSON / JSON5 / JSON Lines support, brought over from the `feature_notes` test bed (its v0.0.9–v0.0.36) as one version, on the `json-tree` branch.
  - **Tree view** for `.json`, `.jsonc`, `.json5`, `.jsonl` and `.ndjson`: a `Source` / `Tree` switch, branch lines, value dots colored by type, and line highlight with jump between the two views. For broken files the tree is shown up to the error.
  - **Syntax check** (J001 and up): the first error is underlined with an explanation in the screen language. JSON Lines are checked line by line (up to 100 wrong lines). Opening a file scrolls to the first error.
  - Switching the screen language now redraws any open file at once (JSON, TOML, compiler output, `.ui`).
  - English wording cleanup (`1 error` / `2 errors`) and the error red is kept apart from the theme colors.
- New samples: `tests/samples/project/json/` (`ok.json`, `sample.json5`, `error.json`, `lines.jsonl`).
- Version comment at the top v0.23.0.

## v0.22.1 (2026-10-20)

### tools

- The joining tool is now a small C++ program, `tools/merge-parts.cpp`, instead of `tools/merge-parts.py`. Only `g++` is needed (no Python): `g++ -std=c++23 -O2 -o tools/merge-parts tools/merge-parts.cpp` (Windows with MinGW: add `-static`, checked with GCC 16.2.0). The built program is not kept in the repository (`.gitignore`).
  - Same use as before: `tools/merge-parts src source-viewer.html [--check file]`. The result is byte for byte the same as the Python tool's.
  - Errors (missing `parts.txt`, missing part, output not writable) are reported with exit code 2.
- `source-viewer.html` is not changed in this version, so its version comment stays v0.22.0.

## v0.22.0 (2026-10-20)

### source-viewer.html

- The source is now kept as 26 parts in `src/` (see [`src/README.md`](src/README.md)) and joined into `source-viewer.html` with `tools/merge-parts.py`. Users still get and copy one file.
  - No change in behavior: the joined file differs from v0.21.0 only in the version comment.
  - Edit the parts, not the joined file.
- Version comment at the top v0.22.0.

## v0.21.0 (2026-10-20)

### source-viewer.html

- GCC compiler messages (`build.log`) now get an explanation in the screen language. For 17 common messages (undeclared names, missing `;`, missing include file, no matching function, `const` problems, unused variable/parameter, sign compare, missing return, uninitialized variable) the Korean screen shows the translated message and a `help:` line, with the English original in the tooltip. The English screen shows the original plus an English `help:` line. Other messages stay as they are.
  - `did you mean 'x'?` from GCC is shown as a `help:` line.
  - Switching the screen language redraws an open file that has compiler messages.
  - Needs English compiler output (`LANG=C`), because the explanations match the English text.
  - Not in this version: `cargo.json` (Rust), language pack files for these messages, linker errors (`undefined reference`), the "Hide details" button for compiler results.
- Sample: `src/messages.cpp` and more lines in `build.log`.
- Version comment at the top v0.21.0.

## v0.20.0 (2026-10-20)

### source-viewer.html

- Switching the screen language now redraws an open TOML file right away, like `.ui` (before, the file had to be clicked again to get the new language).
  - The "Hide details" choice and the scroll position are kept.
  - Compiler result files (`build.log`, `cargo.json`) are not changed in this version.
- Version comment at the top v0.20.0.

## v0.19.0 (2026-10-13)

### source-viewer.html

- The "Hide details / Show details" button is now also shown for TOML files (`*.toml`, `Cargo.lock`), so a whole file can be read without the diagnostic lines. Underlines and tooltips stay, as with `.ui`.
  - The choice is shared with `.ui` and remembered per folder.
  - Compiler result files (`build.log`, `cargo.json`) are not changed in this version.
- Version comment at the top v0.19.0.

## v0.18.0 (2026-10-13)

### source-viewer.html

- TOML syntax check: `*.toml` files (for example `Cargo.toml`) and `Cargo.lock` are checked for TOML 1.0 syntax errors. Errors get a red wavy underline and a diagnostic line, the same way as the `.ui` check.
  - Codes T001-T010: string not closed, invalid or missing key, expected `=`, invalid table header, invalid value, unexpected text after value, invalid escape, duplicate key, duplicate or conflicting table, array or inline table not closed.
  - Only syntax errors are checked. Unknown Cargo keys and required `[package]` fields are not (maybe a later version).
  - Messages follow the screen language (Korean or English); the English text is also in the tooltip.
  - `.ini`, `.cfg` and `.editorconfig` are not TOML and are not checked.
  - After one error in a statement, the rest of that line is skipped and checking goes on, so later errors are still found.
- Example `tests/samples/project/toml/errors.toml` (12 errors).
- Version comment at the top v0.18.0.

## v0.17.0 (2026-10-13)

### source-viewer.html

- Compiler output (Rust): if the opened folder has `cargo.json` at its top (`cargo build --message-format=json > cargo.json`), the `compiler-message` lines are shown on the source lines, the same way as `build.log` (GCC).
  - `error` gets a red wavy underline, `warning` an orange one. The code is shown as `error[E0599]` / `warning[unused_variables]`.
  - The underline covers the primary span (exact start and end column). The span label and the `help` messages are shown on the `help:` line.
  - Spans inside macros follow the call site; lines for files that are not in the project (for example the cargo registry) are ignored.
  - `build.log` and `cargo.json` can be used together in one folder. Both are read again when they change (auto refresh, v0.16.0).
- Example `tests/samples/project/cargo.json`, and `build.bat` there now writes it.
- Version comment at the top v0.17.0.

## v0.16.0 (2026-10-13)

### source-viewer.html

- Compiler output auto refresh: when `build.log` changes (for example after running `build.bat`), the diagnostics on the opened source are drawn again within about one second. If `build.log` is removed or emptied, they disappear.
  - Works in the same way as the file auto refresh (browsers with the folder picker only; the folder-upload fallback has no auto refresh).
  - Only the opened file is redrawn; other files read the new log when opened.
- Version comment at the top v0.16.0.

## v0.15.0 (2026-10-13)

### source-viewer.html

- Compiler output (GCC): if the opened folder has `build.log` at its top (for example `g++ ... 2> build.log` in `build.bat`), the `file:line:col: error/warning/note: message` lines are shown on the source lines of that file, the same way as the `.ui` check.
  - `error` (and `fatal error`) get a red wavy underline, `warning` an orange one, and `note` only the grey line under the source. A `[-Wflag]` at the end of the message is shown as the code (`warning[-Wunused-variable]`).
  - The status line shows the error and warning counts for the file. The underline length is the word at the column (or the `"string"` / `<header>`).
  - The log path is matched with the end of the project path, so absolute paths, `\` and `./` in the log work. Color codes (`-fdiagnostics-color`) are removed, the same message at the same place is shown once, and lines for files that are not in the project are ignored.
  - The log is read when the folder is opened and when a file is opened (again if `build.log` changed). It is not refreshed automatically yet (next version).
- `*.log` files are listed and shown as plain text (so `build.log` is in the tree).
- Example `tests/samples/project/build.log`, and `build.bat` there now writes it (`2> build.log`).
- Version comment at the top v0.15.0.

## v0.14.0 (2026-10-13)

### source-viewer.html

- Language pack for `.ui` messages: if the opened folder has `language/<screen language>/ui-check.json5` (Korean screen: `language/ko/ui-check.json5`), its `"ui-check"` section is used for the messages under the source and the underline tooltips, before the built-in `UI_MSG` table.
  - A message that is not in the file (or is `""`) uses the built-in translation, then the English original.
  - A translation with a different number of `{}` than the original is ignored. The status line says in red how many were ignored.
  - If the file cannot be read (syntax error), the built-in translation is used and the status line says in red where (`line N: ...`).
  - The file is read again when it changes (the next time a `.ui` file is drawn). Switching the language button uses that language's pack.
- A small JSON5 reader (`json5Parse`) for it: comments, keys without quotes, single-quoted strings, trailing commas, escapes (`\n`, `\uXXXX`, `\xXX`, line continuation), hex numbers, `Infinity`, `NaN`. Compared with `JSON.parse` on JSON input, and the three files in tile_font_editor_cpp `language\ko` are read (159 + 44 + 3 entries).
- Version comment at the top v0.14.0.

### tests

- `tests/samples/project/language/ko/ui-check.json5`: a pack with three messages (used, empty, different `{}` count) to see each case.

## v0.13.0 (2026-10-13)

### source-viewer.html, docs-viewer.html

- The project version is shown next to the project name at the top: `source_lens_html v0.13.0 / source/tests/...`. The version is the first `## vX.Y.Z` in `CHANGELOG.md` of the opened folder (`CHANGELOG.ko.md` if there is no English one). With no changelog or no version, the name is shown as before.
- The version is read again when the file list is refreshed.
- Version comments at the top: source-viewer v0.13.0, docs-viewer v0.13.0 (docs-viewer now follows the project version).

## v0.12.0 (2026-10-13)

### source-viewer.html

- Syntax colors for JSON5 (`.json5`): comments (`//`, `/* */`), keys without quotes, single-quoted strings (and line continuation `\` at the end of a line), hex numbers (`0x1F`), `+2.`, `.5`, `Infinity`, `NaN`, and trailing commas. Keys are colored as keys, with or without quotes.
- `json5` is its own language (`.json` and `.jsonc` are unchanged). A code block marked ` ```json5 ` in a `.md` file is colored too.
- A `+` sign in front of a number is now part of the number in TOML and JSON5 (it was left uncolored before).
- Version comment at the top v0.12.0.

### tests

- `tests/samples/project/language/ko/main.json5`: a JSON5 sample with every kind above.

## v0.11.0 (2026-10-13)

### source-viewer.html

- `.ui` error and warning messages in Korean: when the screen language is Korean, the lines under the source and the underline tooltips show Korean (codes like `error[E003]` stay the same).
  - The tooltip also shows the English original (the same as `ui-check`) under a line.
  - Switching the language (한국어 / English) redraws the messages in that language.
- The translations (159 messages, help lines and words) are built in as the `UI_MSG` table. The original is `language\ko\ui-check.json5` in tile_font_editor_cpp. A missing or empty translation shows the English original.
- The `ui-check` style output and the check results are the same as v0.10.0 (compared with `tests/ui` and the samples).
- Version comment at the top v0.11.0.

## v0.10.0 (2026-10-13)

### source-viewer.html

- `.ui` element names with clear behavior and meaning (follows ui-guideline document 0.9):
  - `edit` → `text_field`, `number` → `number_field`, `dropdown` → `menu_button`
- The old names are still read and give warning W104 (`'edit' is an old name` / `help: use 'text_field' instead`), the same as the 0.8 names. They cannot be element names (E013), and suggestions (`did you mean`) only give new names.
- Messages use the new names: `'menu_button' needs menu=<menu name>`, `a menu_button opens it`, `defaults work for: label, button, text_field, number_field, menu_button, ...`, and kind names in E004, E010 and other messages.
- Everything else gives the same results as v0.9.0 (compared with the 33 files in `tests/ui`: only W104, the new names and `UI 0.9` differ; layout results are the same).
- Preview: element boxes and view mode use the new names (`menu_button` opens its menu).
- Version comment at the top v0.10.0, `UI_DOC_VERSION` 0.9.
- Note: the C++ `ui-check` (uilayout.cppm) is still at document 0.7.

### tests

- Sample `.ui` files use the new names. `old_names.ui` also has `edit`, `number` and `dropdown` (18 W104 warnings).
- Added `tests\samples\ui\w104_old_names.ui` (every old name, 11 W104, no errors) and `w104_mixed.ui` (old and new name together → E006, old name with an error → no W104, old kind as a name → E013).

## v0.9.0 (2026-10-12)

### source-viewer.html

- `.ui` names changed to the most common ones (follows ui-guideline document 0.8):
  - Elements: `check` → `checkbox`, `item` → `menu_item`
  - Attributes: `tip` → `tooltip`, `disabled_tip` → `disabled_tooltip`, `hint` → `placeholder`, `gap` → `spacing`, menu item `check` → `checkable`
  - `edit`, `number`, `dropdown` and the other names stay the same.
- Old names are still read (legacy) and give an orange warning W104 `'tip' is an old name` / `help: use 'tooltip' instead` (automatic fix class).
  - An old name and its new name are the same attribute: writing both on one line makes the later one E006.
  - W104 for an attribute only when that attribute has no other error. Old kind names (`check`, `item`) cannot be element names (E013). Suggestions (`did you mean`) only give new names.
- Kind names and attribute lists in messages use the new names too (W103 `has no tooltip`, E016 `'checkable' and 'radio'`, etc.). Everything else gives the same results as v0.8.0 (compared with the 33 files in `tests/ui`).
- Preview: draws `checkbox` and `menu_item`; tooltips come from `tooltip` and `disabled_tooltip`.
- Version comment at the top v0.9.0, `UI_DOC_VERSION` 0.8.
- Note: the C++ `ui-check` (uilayout.cppm) is still at document 0.7, so W104 and the changed messages are only in the viewer for now.

### tests

- Sample `.ui` files use the new names. Added `tests\samples\ui\old_names.ui` (only old names, 14 W104 warnings).

## v0.8.0 (2026-10-12)

### source-viewer.html

- `.ui` view mode tooltips: hover a box and, after 0.5 s, the program's tooltip appears below the cursor.
  - Text: `tip` (`disabled_tip` for a disabled element, or `tip` if it has none). `\n` breaks the line.
  - Elements without `tip`, with `tip=""`, or hidden show nothing (same as the real program).
  - Drawn in the app theme colors. It can go outside the preview pane and moves inward or above the cursor near the right or bottom edge of the screen.
  - Closes when the mouse leaves the box, on click (including opening a dropdown menu), wheel, Esc, or redraw.
  - View mode no longer shows the box position and size (browser title); layout mode is unchanged.
- Version in the top comment: v0.8.0.

## v0.7.0 (2026-10-12)

### tests

- `.ui` layout samples in `tests/samples/ui` (each one a complete screen; the viewer code is unchanged):
  - `positions.ui`: find and replace dialog — positions in a group (left, right, top, bottom, right_of, below, gap, padding).
  - `rows_columns.ui`: settings window — nested row and column, spacer, align, defaults.
  - `all_elements.ui`: tile editor screen — every element kind, hidden and disabled, three menus (radio groups, check, submenus).
  - `errors_recover.ui`: seven errors on purpose — the preview leaves out the wrong elements.
  - `errors_cannot.ui`: no `#ui 1` header (E001) — the preview shows that it cannot draw.

## v0.6.0 (2026-10-12)

### source-viewer.html

- `.ui` menu preview: `Layout | View` mode buttons in the preview bar (remembered in the browser).
  - Layout mode: as before, click a box to go to its source line.
  - View mode: click a dropdown to open the menu linked by `menu=` as a pull-down.
    Shows item, separator, the checked state of radio (●) and check (✓) items, and inner menus as submenus (▸, open on hover).
    Closes on outside click, Esc or an item click. Radio items and checkboxes are view only (clicking does not change them).
  - Menu entry tooltips show kind, name and line. An empty menu shows "(empty menu)".

### tests

- `tests/samples/project/ui/menu.ui`: sample for the menu preview (radio, check, separator, submenu, empty menu).

## v0.5.0 (2026-10-12)

### source-viewer.html

- `.ui` layout preview ↔ source line (step 3, part 1):
  click a box in the preview to scroll the source to its line and highlight that line (address `#path:L12`).
  Clicking a line number also highlights the box of that line (thick border + selection background).
- Box tooltip now shows the line number, plus "Click to go to this line in the source."

## v0.4.0 (2026-10-12)

### source-viewer.html

- `.ui` layout preview (step 2): when a `.ui` file is open, the screen is split into source (top) and layout (bottom).
  Drag the border to change the height. The "Hide layout" / "Show layout" button turns it off and on (on by default, remembered).
- Window size: 640×480, 800×600, 1024×768, 1280×720, "Fit to pane", or type the width and height. DPI scale 100-200%.
- Positions come from the v0.3.0 calculation; text widths are measured in the browser (12px font, line height 16, × scale).
- Simple real shapes: buttons, input boxes, ☐ check boxes, hatched canvases, dashed group/row/column outlines with their names.
  `hidden` elements are faded. Hover a box to see its kind, name, position and size.
- With errors, the wrong elements are left out ("Ignore") and a red note says so. Errors that cannot be recovered (E001, …) show a red message only.

 (2026-10-12)

### source-viewer.html

- `.ui` layout calculation (step 1 of the layout preview; nothing new on screen yet): `Layouter`, `compute()` and `recover()`
  from `tile_font_editor_cpp` (`src/uilayout.cppm`) were ported to JavaScript (`uiCheck.compute`, `uiCheck.recover`).
  With the test metrics (640×480 window, text width = code points × 7, line height 16, `// test:` line) it gives exactly the same
  output as the 5 `tests/ui/ok/*.expected` files and `tests/ui/recover/basic.expected`.
- Recovery ("Ignore"): elements with errors are left out together with their blocks; `right_of`/`below` naming a missing element
  become `left=0`/`top=0`. The original check result is not changed.

## v0.2.0 (2026-10-12)

### source-viewer.html

- Full `.ui` checker: the quick check (E002, E003, E013) is replaced by the same full check as `ui-check`:
  E001-E016, W101 and W103 (guideline 0.7). The checker in `tile_font_editor_cpp` (`src/uilayout.cppm`) was ported to JavaScript;
  it gives exactly the same output as the 21 `tests/ui/error/*.expected` files, and the same ranges and fix kinds as `tests/ui/fix`.
- Messages are the English originals, the same as `ui-check`.
- Warnings (W1xx) have their own orange wavy underline and `warning[...]` line. The status bar shows "N error(s) · M warning(s)" (or "check passed").
- Zero-length diagnostics (something missing at the end of a line, E001 for an empty file, …) are shown as diagnostic lines too.
- `.ui` files are read as UTF-8 only (never as EUC-KR). Invalid bytes show as `�` and are reported as E004 "invalid UTF-8".
- `.ui` code blocks in Markdown are only colored, not checked (they are example snippets).

### Repository

- `.gitattributes` line endings: `* text=auto eol=lf`, and `eol=crlf` for `*.bat` and `*.cmd`.

## v0.1.0 (2026-10-12)

First version as its own project (`source_lens_html`).

### source-viewer.html (new)

- Source files with syntax colors and line numbers: C++, Rust, TOML, JSON, BAT/CMD, shell / YAML / Makefile / `.gitignore`.
- Line numbers are not copied; clicking one marks the line and keeps `#path:L12` in the address.
- Markdown: document view / raw view, colored code blocks, links to source files (`file.rs#L12`).
- Encodings: UTF-8, EUC-KR (CP949), UTF-16.
- `.ui` layout files (guideline 0.7): colors, quick check E002 / E003 / E013 with `did you mean` suggestions,
  red wavy underlines, `error[...]` / `help:` lines under the error line (can be turned off, never copied), error count in the status bar.
- `.ui.log` files: colors for time, `line:column` and error codes.

### docs-viewer.html

- Document list is now a tree: folders collapse and expand (remembered), the folder of the open document expands by itself.
- Branch lines `├ └ │` in the tree.
- Narrow window: the list stays a vertical tree.

### Both

- Tree list with branch lines, resizable list width, themes, English / Korean switch, auto refresh (Chrome / Edge).
