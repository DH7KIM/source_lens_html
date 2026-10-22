# source-viewer source parts

Korean: [README.ko.md](README.ko.md)

`source-viewer.html` (one file, copied and used as it is) is built by joining the files in this folder, from top to bottom, in the order of [`parts.txt`](parts.txt).

## Rules

- **Edit the parts, not `source-viewer.html`.** If you edit the joined file by hand, the next join erases the change.
- Join after every change, and test with the joined file (it is the file that users get).
- One part = one section. The start code (`js/22-boot.js`) must stay last; if it runs earlier, the viewer fails at start.
- A new part: add a line to `parts.txt` at the place where it should run, and give it the next free number in the name.
- `.ui` check, `.ui` colors and the layout preview are still in `06-ui-check.js`, `07-ui-highlight.js` and `18`-`21` for the `.ui` format 1 (guideline 0.9).

## How to join

The joining tool is a small C++ program, [`tools/merge-parts.cpp`](../tools/merge-parts.cpp). It needs only `g++`. Run in the `source` folder.

Build it once (the program is not kept in the repository; on Windows the output is `tools/merge-parts.exe`). On Windows with MinGW add `-static`, otherwise the program needs the GCC DLLs in `PATH` and ends without any message when it cannot find them:

```text
g++ -std=c++23 -O2 -o tools/merge-parts tools/merge-parts.cpp
g++ -std=c++23 -O2 -static -o tools/merge-parts tools/merge-parts.cpp   (Windows, MinGW)
```

Join:

```text
tools/merge-parts src source-viewer.html
```

To check that the joined file equals another file byte for byte (for example after a change that must not change anything):

```text
tools/merge-parts src source-viewer.merged.html --check source-viewer.html
```

The exit code is 0 when done (and equal), 1 when the check finds a difference, 2 on an error (for example a missing part). The tool uses plain `#include` and not C++ modules on purpose: it is one small file, and `import std;` would need an extra build step.

## Parts

| Part | Content |
|---|---|
| `parts/00-head.html` | `<!doctype>` to `<style>` |
| `parts/01-style.css` | CSS |
| `parts/02-body.html` | `</style>` to `<script>` |
| `parts/js/01-strings.js` | screen texts: the empty `UI` table, language names, `t()` |
| `parts/js/01-strings-ko.js` | screen texts, Korean (`UI.ko`) |
| `parts/js/01-strings-en.js` | screen texts, English (`UI.en`, the original) |
| `parts/js/02-file-kinds.js` | file kinds (the `FILE_TYPES` table) |
| `parts/js/03-highlight.js` | syntax colors |
| `parts/js/05-ui-messages.js` | `.ui` error and warning texts |
| `parts/js/06-ui-check.js` | `.ui` checker |
| `parts/js/07-ui-highlight.js` | `.ui` colors |
| `parts/js/08-markdown.js` | Markdown to HTML (same converter as `docs-viewer.html`) |
| `parts/js/09-source-folder.js` | source folder (FSA or file list) |
| `parts/js/10-tree-list.js` | tree list |
| `parts/js/11-list-width-and-helpers.js` | list width, reading helpers |
| `parts/js/11a-dialog-table.js` | common parts of table windows (filter, open, close) |
| `parts/js/12-supported-types.js` | `Supported file types` button and window (reads `FILE_TYPES`) |
| `parts/js/12a-language-picker.js` | `Language` button and window (language list, names, choosing) |
| `parts/js/12b-font-settings.js` | `Font settings` button and window (for now the ligature switch) |
| `parts/js/13-compiler-output.js` | compiler output (`build.log`, `cargo.json`) |
| `parts/js/14-toml-check.js` | TOML check |
| `parts/js/15-open-file-and-events.js` | open a file, events |
| `parts/js/16-start.js` | start |
| `parts/js/17-themes.js` | themes |
| `parts/js/18-ui-preview.js` | `.ui` layout preview |
| `parts/js/19-preview-menu.js` | preview: menus |
| `parts/js/20-preview-tooltip.js` | preview: tooltips |
| `parts/js/21-preview-events.js` | preview: boxes, clicks, resizing |
| `parts/js/22-boot.js` | header height, start (runs last) |
| `parts/99-tail.html` | `</script>` to `</html>` |

`docs-viewer.html` is not split yet.

## Adding a language

Screen texts live in one file per language, so a new language is one new file:

1. Copy `parts/js/01-strings-en.js` to `parts/js/01-strings-<code>.js` (for example `01-strings-ja.js`) and change `UI.en` to `UI.<code>` (`UI.ja`).
2. Translate the values. Keep the keys and the `{0}` `{1}` placeholders as they are. A text that is missing falls back to English, so a partial translation works. Plural texts `{0|form1|form2}` use as many forms as the language needs: 2 for English and similar (1 → first, the rest → second), 2 for French (0 and 1 → first), 3 for Russian and Polish (`one|few|many`).
3. Add the file to `parts.txt` right after `parts/js/01-strings-en.js`.
4. Add the language name to `LANG_NAMES` in `parts/js/01-strings.js`.
5. Join the parts: `tools/merge-parts src source-viewer.html`.

6. The language box lists every language that has a screen text table or a document (`name.<code>.md`) in the opened folder, in the order of `LANG_NAMES`; each item is shown as `own name (code)`, for example `한국어 (ko)`; the names there are written in each language itself.

Right-to-left languages (Arabic, …) need more than a translation file: the screen layout (button order, list position, …) must be supported separately. This is not supported yet; anyone who needs it is welcome to add it together with the translation.

Limits for now: at start the screen language is the one chosen in the language box if there is one (remembered in the browser, only for languages with a screen text table), otherwise it is picked automatically as the first language in the browser's preferred-language list that has a screen text table (`zh-TW`, `zh-HK` and `zh-Hant` map to `zh-tw`, any other `zh` to `zh-cn`, otherwise `en`), and a document-only language is not remembered. The `.ui` error descriptions (`05-ui-messages.js`) are a separate table and have Korean only.
