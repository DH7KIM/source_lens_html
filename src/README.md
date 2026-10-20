# source-viewer source parts

Korean: [README.ko.md](README.ko.md)

`source-viewer.html` (one file, copied and used as it is) is built by joining the files in this folder, from top to bottom, in the order of [`parts.txt`](parts.txt).

## Rules

- **Edit the parts, not `source-viewer.html`.** If you edit the joined file by hand, the next join erases the change.
- Join after every change, and test with the joined file (it is the file that users get).
- One part = one section. The start code (`js/22-boot.js`) must stay last; if it runs earlier, the viewer fails at start.
- A new part: add a line to `parts.txt` at the place where it should run, and give it the next free number in the name.
- `.ui` check, `.ui` colors and the layout preview are still in `06-ui-check.js`, `07-ui-highlight.js` and `18`-`21` for the `.ui` format 1 (guideline 0.9).

## How to join (Python 3)

Run in the `source` folder.

```text
python3 tools/merge-parts.py src source-viewer.html
```

To check that the joined file equals another file byte for byte (for example after a change that must not change anything):

```text
python3 tools/merge-parts.py src source-viewer.merged.html --check source-viewer.html
```

## Parts

| Part | Content |
|---|---|
| `parts/00-head.html` | `<!doctype>` to `<style>` |
| `parts/01-style.css` | CSS |
| `parts/02-body.html` | `</style>` to `<script>` |
| `parts/js/01-strings.js` | screen texts |
| `parts/js/02-file-kinds.js` | file kinds |
| `parts/js/03-highlight.js` | syntax colors |
| `parts/js/04-json5.js` | JSON5 reader (for language packs) |
| `parts/js/05-ui-messages.js` | `.ui` error and warning texts |
| `parts/js/06-ui-check.js` | `.ui` checker |
| `parts/js/07-ui-highlight.js` | `.ui` colors |
| `parts/js/08-markdown.js` | Markdown to HTML (same converter as `docs-viewer.html`) |
| `parts/js/09-source-folder.js` | source folder (FSA or file list) |
| `parts/js/10-tree-list.js` | tree list |
| `parts/js/11-list-width-and-helpers.js` | list width, reading helpers |
| `parts/js/12-language-pack.js` | language packs |
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
