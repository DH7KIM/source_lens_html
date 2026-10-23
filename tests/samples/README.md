# Sample files

Test files for Source Lens. Open `source-viewer.html`, choose this `tests/samples` folder (or one folder in it), and check how each file type is shown.

One folder per file type: the folder name is the `id` in the `Supported file types` table (for example `cpp_module`, `c_header`, `cargo_lock`). A type with a syntax checker has an OK sample and an `error` sample. Two folders (`project`, `compiler_output`) are whole sample projects for folder-level features. These samples are not meant to be built or run as a whole.

## Notes

- **`.ini`, `.cfg`, `.manifest` do not appear when you open a folder in Chrome or Edge.** Chromium blocks these "dangerous" extensions in the folder handle it gives to web pages ([Chromium issue 380857453](https://issues.chromium.org/issues/380857453), intended behavior). The files are fine; they open by other means (folder list upload) and in other browsers. Affected samples: `ini/settings.ini`, `manifest/sample.manifest`.
- `jsonc/error.jsonc`: its trailing comma is reported only when the syntax box is set to `JSONC` (`Auto` reads JSONC as JSON5, which allows trailing commas).
- `cargo_lock/error/Cargo.lock`: the error sample sits in a sub folder because the file must be named `Cargo.lock` to be recognized.
- `toml/errors.toml` and the `ui/errors_*.ui` files hold many errors in one file; JSON, JSON5 and `Cargo.lock` samples show only the first error.
- `cpp_module/greeting.cppm` builds with GCC 16 (`-fmodules-ts`, see the comment at the top of the file).
- `gitignore/.gitignore` and `gitattributes/.gitattributes` only apply inside their own folder.

## Folders

| Folder | File type | Files |
| --- | --- | --- |
| `c` | C | `sample.c` |
| `c_header` | C/C++ header | `sample.h`, `sample_use.c` |
| `cpp` | C++ | `sample.cpp` |
| `cpp_module` | C++ module | `greeting.cppm`, `use_greeting.cpp` |
| `rc` | Windows resource | `sample.rc`, `resource.h` |
| `rust` | Rust | `sample.rs` |
| `toml` | TOML | `errors.toml` |
| `cargo_lock` | Cargo lock | `Cargo.lock`, `error/Cargo.lock` |
| `ini` | INI | `settings.ini` |
| `editorconfig` | EditorConfig | `.editorconfig` |
| `json` | JSON | `ok.json`, `error.json`, `json5-in-json.json` |
| `jsonc` | JSON with comments | `ok.jsonc`, `error.jsonc` |
| `jsonl` | JSON Lines | `ok.jsonl`, `error.jsonl` |
| `json5` | JSON5 | `main.json5`, `error.json5` |
| `json5` | JSON5 | `main.json5`, `error.json5` |
| `batch` | Batch | `sample.bat` |
| `shell` | Shell | `sample.sh` |
| `powershell` | PowerShell | `sample.ps1` |
| `yaml` | YAML | `sample.yaml` |
| `cmake` | CMake | `CMakeLists.txt` |
| `makefile` | Makefile | `Makefile` |
| `dockerfile` | Dockerfile | `Dockerfile` |
| `gitignore` | Git ignore | `.gitignore` |
| `gitattributes` | Git attributes | `.gitattributes` |
| `markdown` | Markdown | `README.md`, `README.ko.md`, `CHANGELOG.md`, `TODO.ko.md`, `docs/` (language pairs) |
| `html` | HTML | `page.html` |
| `text` | Text | `sample.txt` |
| `log` | Log | `sample.log` |
| `ui` | UI layout | `all_elements.ui`, `menu.ui`, `viewer.ui`, `errors_*.ui`, … |
| `ui_log` | UI log | `viewer.ui.log` |
| `xml` | XML | `sample.xml` |
| `manifest` | Manifest | `sample.manifest` |
| `def` | Module definition | `sample.def` |
| `ld` | Linker script | `sample.ld` |
| `license` | License | `LICENSE` |
| `project` | (sample project) | hand-made C++ and Rust project: compiler output (`build.log`, `cargo.json`), tree, links, skipped folder (`target/`), EUC-KR file (`old.cpp`) |
| `compiler_output` | (sample project) | real GCC and Rust output for a small project |
