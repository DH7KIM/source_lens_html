# Changelog

Korean: [CHANGELOG.ko.md](CHANGELOG.ko.md)

## v0.3.0 (2026-10-12)

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
