# Source Lens

English: [README.md](README.md)

프로젝트 폴더(C++·Rust 소스와 마크다운 문서)를 브라우저에서 바로 보는 단일 HTML 뷰어 모음입니다.
설치할 것도, 외부 라이브러리도 없습니다. Chrome·Edge를 권장합니다.

| 파일 | 누구용 | 보여 주는 것 |
|---|---|---|
| `source-viewer.html` | 개발자 | 문법 색칠·줄 번호가 붙은 소스 파일, 마크다운 문서, 검사가 붙은 `.ui` 레이아웃 파일 |
| `docs-viewer.html` | 문서를 읽는 사람 | 마크다운(`.md`) 문서만 |

## 쓰는 법

1. 보려는 폴더에 뷰어를 복사합니다. (예: `tile_font_editor_cpp\source`)
2. Chrome·Edge로 열고 그 폴더를 한 번 고릅니다.
   "방문할 때마다 허용"을 고르면 다음부터 바로 열립니다.
3. 트리에서 파일을 누릅니다. 파일을 저장하면 1초 안에 화면이 바뀝니다.

## 기능

- **트리 목록**: 폴더 접기·펼치기(기억됨), 가지 연결선 `├ └ │`, 폭 조절(경계를 두 번 누르면 이름에 맞춤).
- **문법 색칠 + 줄 번호** (`source-viewer`): C++(`.cpp .cppm .ixx .h .hpp` …), Rust, TOML, JSON, BAT/CMD, 셸·YAML·Makefile·`.gitignore`.
  줄 번호는 복사되지 않습니다. 줄 번호를 누르면 그 줄이 표시되고 주소에 `#경로:L12`가 남습니다.
- **마크다운**: 문서 보기 / 원문 보기, 영어 `이름.md` / 한국어 `이름.ko.md` 전환, 다른 파일로 가는 링크(`file.rs#L12`는 12번 줄로).
- **`.ui` 레이아웃 파일** (UI 레이아웃 형식 1, 가이드라인 0.7): 색칠과 `ui-check`와 같은 전체 검사(E001~E016, W101·W103).
  오류는 빨간 물결 밑줄, 경고는 주황 물결 밑줄, 줄 아래의 `error[...]` / `warning[...]` / `help:` 줄로 보여 줍니다. 설명은 `ui-check`와 같은 영어 원문입니다.
- **인코딩**: UTF-8, EUC-KR(CP949), UTF-16을 알아서 읽습니다. (`.ui`는 UTF-8만)
- **테마**: 밝은 테마·어두운 테마 (GitHub, Solarized, Gruvbox, Nord, Dracula 등).

건너뛰는 폴더: `obj`, `gcm.cache`, `.git`, `target`, `node_modules`, `bin`, `build`, 점(`.`)으로 시작하는 폴더.

## 시험

`tests/samples/`에 예제 폴더(`project`, `docs`)가 있습니다. 뷰어를 열고 그중 하나를 고르면 모든 파일 종류, 트리, `.ui` 오류 표시를 확인할 수 있습니다.
`.ui` 검사 결과는 `tile_font_editor_cpp`의 `tests/ui/error/*.expected`와 글자 하나까지 같아야 합니다.

## 라이선스

MIT License, KIM DONG HAN. [LICENSE](LICENSE)를 보세요.
