# Changelog

Korean: [CHANGELOG.ko.md](CHANGELOG.ko.md)

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
