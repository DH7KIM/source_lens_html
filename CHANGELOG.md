# Changelog

Korean: [CHANGELOG.ko.md](CHANGELOG.ko.md)

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
