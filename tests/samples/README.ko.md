# 샘플 파일

Source Lens를 시험하려고 만든 파일 모음입니다. `source-viewer.html`을 열고 이 `tests/samples` 폴더(또는 그 안의 폴더 하나)를 고르면 파일 종류마다 어떻게 보이는지 확인할 수 있습니다.

파일 종류마다 폴더 하나이고, 폴더 이름은 `지원 파일 형식` 표의 `id`입니다(예: `cpp_module`, `c_header`, `cargo_lock`). 문법 검사기가 있는 종류에는 정상(`ok`) 샘플과 오류(`error`) 샘플이 있습니다. 폴더 두 개(`project`, `compiler_output`)는 폴더 단위 기능을 시험하는 예제 프로젝트입니다. 이 샘플 전체를 빌드하거나 실행하려고 만든 것은 아닙니다.

## 알아 둘 것

- **크롬·Edge에서 폴더를 열면 `.ini`, `.cfg`, `.manifest` 파일이 목록에 안 나옵니다.** Chromium이 "위험한 확장자"를 웹 페이지에 주는 폴더 핸들에서 빼기 때문입니다([Chromium 이슈 380857453](https://issues.chromium.org/issues/380857453), 의도된 동작). 파일에는 문제가 없고, 다른 방법(폴더 목록 올리기)이나 다른 브라우저에서는 열립니다. 해당 샘플: `ini/settings.ini`, `manifest/sample.manifest`.
- `jsonc/error.jsonc`: 끝 쉼표 오류는 문법 상자를 `JSONC`로 골랐을 때만 나옵니다(`자동`은 JSONC를 JSON5 규칙으로 읽고, JSON5는 끝 쉼표를 허용합니다).
- `cargo_lock/error/Cargo.lock`: 파일 이름이 `Cargo.lock`이어야 알아보므로 오류 샘플은 하위 폴더에 있습니다.
- `toml/errors.toml`과 `ui/errors_*.ui`는 한 파일에 오류가 여러 개 있습니다. JSON·JSON5·`Cargo.lock` 샘플은 첫 오류만 보입니다.
- `cpp_module/greeting.cppm`은 GCC 16(`-fmodules-ts`, 파일 맨 위 주석)으로 빌드됩니다.
- `gitignore/.gitignore`와 `gitattributes/.gitattributes`는 자기 폴더 안에서만 적용됩니다.

## 폴더

| 폴더 | 파일 종류 | 파일 |
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
| `markdown` | Markdown | `README.md`, `README.ko.md`, `CHANGELOG.md`, `TODO.ko.md`, `docs/`(언어 쌍) |
| `html` | HTML | `page.html` |
| `text` | Text | `sample.txt` |
| `log` | Log | `sample.log` |
| `ui` | UI layout | `all_elements.ui`, `menu.ui`, `viewer.ui`, `errors_*.ui` 등 |
| `ui_log` | UI log | `viewer.ui.log` |
| `xml` | XML | `sample.xml` |
| `manifest` | Manifest | `sample.manifest` |
| `def` | Module definition | `sample.def` |
| `ld` | Linker script | `sample.ld` |
| `license` | License | `LICENSE` |
| `project` | (예제 프로젝트) | 손으로 만든 C++·Rust 프로젝트: 컴파일러 결과(`build.log`, `cargo.json`), 트리, 링크, 건너뛰는 폴더(`target/`), EUC-KR 파일(`old.cpp`) |
| `compiler_output` | (예제 프로젝트) | 작은 프로젝트의 실제 GCC·Rust 출력 |
