# Source Lens

Korean: [README.ko.md](README.ko.md)

Single-file HTML viewers for looking at a project folder (C++ / Rust sources and Markdown documents) right in the browser.
No install, no external libraries. Chrome or Edge recommended.

| File | For | What it shows |
|---|---|---|
| `source-viewer.html` | Developers | Source files with syntax colors and line numbers, Markdown documents, `.ui` layout files with a checker and a layout preview |
| `docs-viewer.html` | Anyone reading the docs | Markdown (`.md`) documents only |

## How to use

1. Copy the viewer into the folder you want to see (for example `tile_font_editor_cpp\source`).
2. Open it in Chrome or Edge and choose that folder once.
   Choose "Allow on every visit" so it opens directly next time.
3. Click a file in the tree. When you save a file, the view updates within a second.

## Features

- **Tree list**: folders collapse and expand (remembered), branch lines `├ └ │`, resizable width (double-click the edge to fit).
- **Syntax colors + line numbers** (`source-viewer`): C++ (`.cpp .cppm .ixx .h .hpp` …), Rust, TOML, JSON / JSON5, BAT/CMD, shell / YAML / Makefile / `.gitignore`.
  Line numbers are not copied. Click a line number to mark it (`#path:L12` in the address).
- **Markdown**: document view or raw view, English `name.md` / Korean `name.ko.md` switch, links to other files (`file.rs#L12` opens line 12).
- **`.ui` layout files** (UI layout format 1, guideline 0.9): colors and the same full check as `ui-check` (E001-E016, W101 and W103), plus warning W104 for old names (`tip` → `tooltip`, `check` → `checkbox`, `edit` → `text_field`, …), which are still read.
  Errors get a red wavy underline, warnings an orange one, plus `error[...]` / `warning[...]` / `help:` lines under the line. Messages follow the screen language (Korean or English); in Korean, the tooltip also shows the English original, the same as `ui-check`.
- **Compiler output (GCC)**: put the build output in `build.log` at the top of the opened folder (for example `g++ ... 2> build.log`) and the errors, warnings and notes are shown on the source lines of the files, the same way as the `.ui` check. The log is read when the folder or a file is opened, and again when it changes.
- **Compiler output (Rust)**: save `cargo build --message-format=json > cargo.json` at the top of the opened folder and the errors and warnings are shown the same way (exact underline, `help:` line). It can be used together with `build.log`.
- **`.ui` layout preview**: the lower pane draws where each element goes (drag the border to resize it). Choose the window size (640×480, …, fit to pane, or type it) and the DPI scale (100-200%). With errors, the wrong elements are left out, like "Ignore" in the program. Click a box to jump to its source line; click a line number to highlight its box. In `View` mode it works like the program: click a menu_button to open its menu, and hover a box to see its tooltip (`tooltip`, or `disabled_tooltip` when disabled).
- **Encodings**: UTF-8, EUC-KR (CP949) and UTF-16 are detected (`.ui` files: UTF-8 only).
- **Themes**: light and dark themes (GitHub, Solarized, Gruvbox, Nord, Dracula, …).

Skipped folders: `obj`, `gcm.cache`, `.git`, `target`, `node_modules`, `bin`, `build`, and folders starting with `.`.

## Tests

`tests/samples/` holds example folders (`project`, `docs`). Open a viewer and choose one of them to check every file type, the tree and the `.ui` errors.
The `.ui` check must give exactly the same output as `tests/ui/error/*.expected` in `tile_font_editor_cpp`.

## License

MIT License, KIM DONG HAN. See [LICENSE](LICENSE).
