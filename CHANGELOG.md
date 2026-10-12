# Changelog

Korean: [CHANGELOG.ko.md](CHANGELOG.ko.md)

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
