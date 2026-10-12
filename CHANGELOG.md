# Changelog

Korean: [CHANGELOG.ko.md](CHANGELOG.ko.md)

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
