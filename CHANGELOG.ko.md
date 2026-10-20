# 바뀐 점 (Changelog)

English: [CHANGELOG.md](CHANGELOG.md)

## v0.33.0 (2026-10-21)

### source-viewer.html

- **JSON 문법 고르기**: JSON·JSON5 파일을 열면 단추 줄에 `문법: 자동 / JSON / JSON5 / JSON Lines` 선택 상자가 생김. 고르면 그 파일을 그 문법으로 다시 검사하고 계층 보기도 같은 문법으로 읽음. 다른 파일을 열면 자동으로 돌아감 (확장자별 기억은 하지 않음).
  - **자동**: 지금까지처럼 JSON5 규칙으로 읽고, 줄마다 값 하나인 파일은 JSON Lines로 알아봄.
  - **JSON**: 엄격한 JSON. 새 오류 J013(주석), J014(끝 쉼표), J015(작은따옴표), J016(따옴표 없는 키), J017(JSON5 숫자: `+1`·`.5`·`1.`·16진수·Infinity·NaN·앞자리 0), J018(JSON에 없는 이스케이프 `\x` 등), J019(문자열 안 제어 문자).
  - **JSON5**: JSON5 규칙. 값이 여러 개면 JSON Lines로 알아보지 않고 오류(J010)로 알림.
  - **JSON Lines**: 줄마다 엄격한 JSON 값 하나. 틀린 줄을 모두 알림 (주석 줄도 오류).
- 예제 `tests/samples/project/json/json5-in-json.json` (확장자는 `.json`, 내용은 JSON5).
- 갈래 `json-syntax`.

## v0.32.0 (2026-10-20)

### source-viewer.html

- **경로 앞에 파일 수 표시**: `업로드 폴더 (55개 파일) / 샘플/test.ko.md`, 프로젝트 버전이 있는 폴더는 `이름 v0.28.0 폴더 (55개 파일) / ...`. 숫자는 목록에 올라온 파일 수(지원하는 형식만, 건너뛰는 폴더와 고른 단계 밖은 안 셈). 폴더를 다시 읽거나 하위 폴더 단계를 바꾸면 따라 바뀜. 풍선 도움말에 설명이 나옴.
- 갈래 `file-count`.

## v0.31.0 (2026-10-20)

### source-viewer.html

- **파일이 많아도 목록 줄 강조가 빠름**: 파일이 수천 개면 마우스를 올릴 때마다 브라우저가 목록의 모든 줄을 훑어서 느렸음. 이제 줄을 200개씩 묶고, 화면 밖 묶음은 그리지 않음(`content-visibility: auto`). 줄 2만 개 시험: 마우스를 한 번 올릴 때 드는 시간이 약 106ms → 약 3ms. 모양과 동작은 그대로.
- 갈래 `nav-hover`.

## v0.30.0 (2026-10-20)

### source-viewer.html

- **파일을 열 때 목록 전체를 다시 그리지 않음**: 현재 파일 강조(와 접힌 폴더의 "현재 파일이 들어 있음" 표시)만 옮김. 파일 때문에 폴더가 펼쳐질 때, 문서·화면 언어가 바뀔 때, 폴더를 다시 읽을 때는 예전처럼 다시 그림. 파일 6만 개 시험: 클릭할 때마다 목록을 다시 그리던 시간(약 5초)이 없어지고 0.1~0.4초(대부분 파일 읽는 시간)로 줄었음.
- 갈래 `nav-select`.

## v0.29.0 (2026-10-20)

### source-viewer.html

- **파일 목록 폭을 계산하지 않음**: 정해 둔 기본 폭(230px)으로 시작하고, 경계를 끌어서 바꿈. 경계를 두 번 클릭하면 이제 기본 폭으로 돌아감(전에는 가장 긴 이름에 맞췄음). 폭 맞춤이 줄마다 크기를 재서, 파일이 수천 개면 파일을 열 때마다 몇 초씩 걸렸음: 목록 다시 그리기가 1,500개에서 2.25초 → 0.13초.
- 이번에 안 한 것: `docs-viewer.html`은 아직 예전 폭 맞춤.
- 갈래 `nav-width`.

## v0.28.0 (2026-10-20)

### source-viewer.html

- **폴더 읽는 중 표시와 취소**: 폴더를 읽는 동안(FSA 방식) 머리 막대에 `폴더 읽는 중… 파일 N개 · 3.2초`와 `취소` 단추가 나옴. 0.4초가 지나야 나타나서 빨리 끝나면 깜빡이지 않음. 읽는 중에는 다른 폴더·단계를 고를 수 없음.
- **취소하면 이전 목록으로 돌아감**: 폴더·목록·열어 둔 파일이 그대로 남고, 단계를 바꾸다 취소하면 이전 단계로 돌아감. 새 폴더는 읽기가 끝난 뒤에만 저장함.
- 폴더 선택 창(`webkitdirectory`) 방식에는 없음 (브라우저가 목록을 한꺼번에 넘겨 줌). 창 포커스 때 조용히 다시 읽을 때는 표시가 없고, 읽는 중에는 건너뜀.
- 읽기 반복이 30ms마다 잠깐 쉬어서, 파일이 수만 개여도 화면(취소 단추·경과 시간)이 계속 반응함. 쉬지 않으면 아주 큰 폴더를 읽는 동안 화면이 멈췄음.
- 갈래 `folder-reading`.

## v0.27.0 (2026-10-20)

### source-viewer.html

- **머리 막대와 단추 줄 높이를 같게**: 두 줄이 하나의 높이 변수(`--row`, 49px)를 함께 쓰고 안의 내용을 가운데 맞춰, 위아래 여백이 같아짐. 전에는 머리 막대가 약 52px, 단추 줄이 41px이고 여백이 좁았음.
- 갈래 `toolbar-height`.

## v0.26.0 (2026-10-20)

### source-viewer.html

- **하위 폴더 단계 고르기**: 머리 막대(`폴더 바꾸기` 옆)에 `하위 2단계 / 4단계 / 6단계 / 8단계 / 하위 제한 없음` 선택 상자를 추가함 (기본 4단계, 예전 고정값과 같음). 바꾸면 목록을 다시 읽고, 열어 둔 파일이 새 범위 안에 있으면 그대로, 밖이면 첫 파일을 엶. 고른 값은 브라우저에 기억함. `하위 제한 없음`은 폴더가 많으면 오래 걸릴 수 있다는 풍선 도움말이 나옴.
- 폴더 읽기 방식(FSA)과 폴더 선택 방식(`webkitdirectory`) 모두 같은 단계 값을 따름.
- 이번에 안 한 것(다음 버전 후보): 읽는 중 표시와 취소.
- 갈래 `folder-depth`.

## v0.25.0 (2026-10-20)

### source-viewer.html

- **자동 줄바꿈** 단추: 단추 줄에 추가. 켜면 소스 보기에서 긴 줄을 화면 너비에서 접어 보이고(가로 스크롤 없음), 끄면 한 줄로 길게 보임. 줄 번호는 접힌 줄의 첫 줄에만 나오고, 오류 밑줄과 진단 줄은 그대로 맞음. 선택은 브라우저에 기억함(기본: 끔). 소스 보기와 마크다운 원문 보기에서만 보이고 계층 보기·문서 보기에서는 숨김.
- 갈래 `word-wrap`.

## v0.24.0 (2026-10-20)

### source-viewer.html

- **단추 줄**: 파일마다 달라지는 단추(`소스 보기` / `계층 보기`, `오류 설명 끄기/켜기`, 마크다운 모드, `배치 보기`)를 머리 막대에서 빼서 본문 바로 위 고정 줄로 옮김. 언어·테마·폴더 단추는 머리 막대에 그대로 둠. 파일을 열면 단추가 없는 파일에서도 줄을 두어 본문이 흔들리지 않고, 시작 화면에서는 숨김. 배치만 바꿨고 기능은 그대로.
- 숨겨진 `소스 보기 | 계층 보기` 묶음이 빈 상자로 남던 것을 고침.
- 갈래 `toolbar-layout`.

## v0.23.0 (2026-10-20)

### source-viewer.html

- JSON·JSON5·JSON Lines 지원을 `feature_notes` 시험 소스(v0.0.9~v0.0.36)에서 한 버전으로 가져옴. `json-tree` 갈래에서 만들어 합침.
  - `.json`, `.jsonc`, `.json5`, `.jsonl`, `.ndjson`의 **계층 보기**: `소스 보기` / `계층 보기` 전환, 가지 연결선, 값 종류별 색 점, 두 보기 사이 줄 강조·이동. 틀린 파일은 오류까지만 계층을 보여 줌.
  - **문법 검사** (J001~): 첫 오류 하나를 밑줄 + 화면 언어 설명으로 알림. JSON Lines는 줄마다 따로 검사 (틀린 줄 최대 100개). 파일을 열면 첫 오류 줄로 스크롤.
  - 화면 언어를 바꾸면 열려 있는 파일이 바로 바뀜 (JSON, TOML, 컴파일러 결과, `.ui`).
  - 영어 문구 정리(`1 error` / `2 errors`), 오류 빨강을 테마 색과 분리.
- 새 예제: `tests/samples/project/json/` (`ok.json`, `sample.json5`, `error.json`, `lines.jsonl`).
- 맨 위 버전 주석 v0.23.0.

## v0.22.1 (2026-10-20)

### tools

- 합치는 도구를 `tools/merge-parts.py`에서 작은 C++ 프로그램 `tools/merge-parts.cpp`로 바꿈. `g++`만 있으면 됨 (Python 필요 없음): `g++ -std=c++23 -O2 -o tools/merge-parts tools/merge-parts.cpp` (Windows의 MinGW에서는 `-static`을 붙임, GCC 16.2.0으로 확인). 만든 프로그램은 저장소에 올리지 않음(`.gitignore`).
  - 쓰는 법은 그대로: `tools/merge-parts src source-viewer.html [--check 파일]`. 결과는 Python 도구와 바이트까지 같음.
  - 오류(`parts.txt` 없음, 조각 없음, 출력 파일을 못 씀)는 끝날 때 코드 2로 알림.
- `source-viewer.html`은 이번에 바뀌지 않아서 버전 주석은 v0.22.0 그대로.

## v0.22.0 (2026-10-20)

### source-viewer.html

- 소스를 `src/`의 조각 26개로 나눠 두고(설명: [`src/README.ko.md`](src/README.ko.md)) `tools/merge-parts.py`로 `source-viewer.html`에 합침. 사용자가 받는 것은 지금처럼 파일 하나.
  - 동작 변화 없음: 합친 파일은 v0.21.0과 버전 주석만 다름.
  - 합친 파일이 아니라 조각을 고침.
- 맨 위 버전 주석 v0.22.0.

## v0.21.0 (2026-10-20)

### source-viewer.html

- GCC 컴파일러 결과(`build.log`)의 오류·경고에 화면 언어로 설명이 붙음. 자주 나오는 메시지 17개(선언 안 됨, `;` 빠짐, 포함 파일 없음, 맞는 함수 없음, `const` 문제, 안 쓴 변수·매개변수, 부호 비교, return 빠짐, 초기화 안 한 변수)는 한국어 화면에서 번역한 메시지와 `help:` 줄을 보이고, 풍선에 영어 원문도 보임. 영어 화면은 원문 + 영어 `help:` 줄. 표에 없는 메시지는 그대로.
  - GCC가 준 `did you mean 'x'?` 힌트는 `help:` 줄로 보임.
  - 화면 언어를 바꾸면 컴파일러 결과가 있는 열린 파일도 바로 다시 그림.
  - 설명이 영어 원문에 맞춰져 있어서 컴파일러를 영어 출력(`LANG=C`)으로 빌드해야 함.
  - 이번에 안 한 것: `cargo.json`(Rust), 이 설명의 언어팩 파일 읽기, 링커 오류(`undefined reference`), 컴파일러 결과의 "오류 설명 끄기" 버튼.
- 예제: `src/messages.cpp`와 `build.log` 줄 추가.
- 맨 위 버전 주석 v0.21.0.

## v0.20.0 (2026-10-20)

### source-viewer.html

- 화면 언어를 바꾸면 열려 있는 toml 파일도 `.ui`처럼 바로 다시 그림 (전에는 파일을 한 번 더 클릭해야 새 언어로 바뀜).
  - `오류 설명 끄기/켜기` 선택과 스크롤 위치는 그대로 유지됨.
  - 컴파일러 결과 파일(`build.log`·`cargo.json`)은 이번에 바꾸지 않음.
- 맨 위 버전 주석 v0.20.0.

## v0.19.0 (2026-10-13)

### source-viewer.html

- toml 파일(`*.toml`, `Cargo.lock`)에서도 `오류 설명 끄기/켜기` 버튼이 보임. 오류 설명 줄 없이 전체 코드를 훑어볼 수 있음. 밑줄과 풍선 도움말은 `.ui`처럼 그대로 남음.
  - 선택은 `.ui`와 같이 쓰고, 폴더마다 기억함.
  - 컴파일러 결과 파일(`build.log`·`cargo.json`)은 이번에 바꾸지 않음.
- 맨 위 버전 주석 v0.19.0.

## v0.18.0 (2026-10-13)

### source-viewer.html

- toml 문법 검사: `*.toml`(예: `Cargo.toml`)과 `Cargo.lock`에서 TOML 1.0 문법 오류를 찾아, `.ui` 검사와 같은 방식으로 빨간 물결 밑줄과 진단 줄로 보여 줌.
  - 코드 T001~T010: 문자열이 안 닫힘, 키가 없거나 잘못됨, `=` 빠짐, 표 머리 오류, 잘못된 값, 값 뒤에 남는 글자, 잘못된 이스케이프, 키 중복, 표 중복·충돌, 배열·인라인 표가 안 닫힘.
  - 문법 오류만 검사. Cargo의 모르는 키와 `[package]` 필수 항목은 검사하지 않음 (나중 버전에서 할 수도 있음).
  - 설명은 화면 언어(한국어·영어)를 따르고, 풍선 도움말에는 영어 원문도 같이 보임.
  - `.ini`·`.cfg`·`.editorconfig`는 TOML이 아니라서 검사하지 않음.
  - 한 문장에서 오류가 나면 그 줄의 나머지는 건너뛰고 계속 검사해서, 뒤의 오류도 찾음.
- 예제 `tests/samples/project/toml/errors.toml` (오류 12개).
- 맨 위 버전 주석 v0.18.0.

## v0.17.0 (2026-10-13)

### source-viewer.html

- 컴파일러 결과 보기 (Rust): 연 폴더 맨 위에 `cargo.json`이 있으면(`cargo build --message-format=json > cargo.json`), `compiler-message`를 `build.log`(GCC)와 같은 방식으로 소스 줄에 보여 줌.
  - `error`는 빨간 물결 밑줄, `warning`은 주황 밑줄. 코드는 `error[E0599]` / `warning[unused_variables]`로 보임.
  - 밑줄은 주된 구간(primary span)의 시작·끝 칸 그대로. 구간 설명(label)과 `help` 메시지는 `help:` 줄에 보임.
  - 매크로 안의 구간은 부른 곳으로 따라가고, 프로젝트에 없는 파일(예: cargo 레지스트리)의 줄은 무시.
  - 한 폴더에 `build.log`와 `cargo.json`을 같이 써도 됨. 둘 다 바뀌면 다시 읽음 (v0.16.0 자동 새로 고침).
- 예제 `tests/samples/project/cargo.json`, 그 폴더의 `build.bat`이 이것도 만들도록 함.
- 맨 위 버전 주석 v0.17.0.

## v0.16.0 (2026-10-13)

### source-viewer.html

- 컴파일러 결과 자동 새로 고침: `build.log`가 바뀌면(예: `build.bat` 실행 뒤) 열려 있는 소스의 진단을 약 1초 안에 다시 그림. `build.log`를 지우거나 비우면 진단도 사라짐.
  - 파일 자동 새로 고침과 같은 방식 (폴더 선택 창을 쓰는 브라우저만, 폴더 올리기 방식은 자동 새로 고침 없음).
  - 열려 있는 파일만 다시 그리고, 다른 파일은 열 때 새 로그를 읽음.
- 맨 위 버전 주석 v0.16.0.

## v0.15.0 (2026-10-13)

### source-viewer.html

- 컴파일러 결과 보기 (GCC): 연 폴더 맨 위에 `build.log`가 있으면(예: `build.bat`의 `g++ ... 2> build.log`), 그 로그의 `파일:줄:칸: error/warning/note: 메시지`를 해당 파일의 소스 줄에 `.ui` 검사와 같은 방식으로 보여 줌.
  - `error`(`fatal error` 포함)는 빨간 물결 밑줄, `warning`은 주황 밑줄, `note`는 밑줄 없이 소스 아래 회색 줄만. 메시지 끝의 `[-Wflag]`는 코드로 보임 (`warning[-Wunused-variable]`).
  - 상태 줄에 그 파일의 오류·경고 개수. 밑줄 길이는 그 칸의 낱말(또는 `"문자열"`·`<헤더>`).
  - 로그의 경로는 프로젝트 경로의 끝부분과 맞춰 찾음: 로그에 절대 경로, `\`, `./`가 있어도 됨. 색 코드(`-fdiagnostics-color`)는 떼고, 같은 곳의 같은 메시지는 한 번만, 프로젝트에 없는 파일의 줄은 무시.
  - 로그는 폴더를 열 때와 파일을 열 때 읽음 (`build.log`가 바뀌었으면 다시). 자동 새로 고침은 아직 없음 (다음 버전).
- `*.log` 파일도 목록에 넣고 일반 글로 보여 줌 (`build.log`가 트리에 보이게).
- 예제 `tests/samples/project/build.log`, 같은 곳의 `build.bat`가 이제 이 파일을 만듦 (`2> build.log`).
- 맨 위 버전 주석 v0.15.0.

## v0.14.0 (2026-10-13)

### source-viewer.html

- `.ui` 메시지 언어팩: 연 폴더에 `language/<화면 언어>/ui-check.json5`(한국어 화면이면 `language/ko/ui-check.json5`)가 있으면 그 `"ui-check"` 섹션을 소스 아래 설명과 밑줄 풍선에 내장 `UI_MSG` 표보다 먼저 씀.
  - 파일에 없거나 `""`인 메시지는 내장 번역, 그것도 없으면 영어 원문.
  - `{}` 개수가 원문과 다른 번역은 무시하고, 상태 줄에 빨간 글자로 몇 개를 무시했는지 알림.
  - 파일을 읽을 수 없으면(문법 오류) 내장 번역을 쓰고, 상태 줄에 빨간 글자로 위치(`N번 줄: ...`)를 알림.
  - 파일이 바뀌면 다시 읽음(다음에 `.ui`를 그릴 때). 언어 버튼을 바꾸면 그 언어의 언어팩을 씀.
- 이를 위한 작은 JSON5 읽기 함수(`json5Parse`): 주석, 따옴표 없는 키, 작은따옴표, 끝 쉼표, 이스케이프(`\n`, `\uXXXX`, `\xXX`, 줄 잇기), 16진수, `Infinity`, `NaN`. JSON 입력은 `JSON.parse`와 같은 결과이고, tile_font_editor_cpp `language\ko`의 파일 3개를 읽음 (159 + 44 + 3개).
- 맨 위 버전 주석 v0.14.0.

### tests

- `tests/samples/project/language/ko/ui-check.json5`: 번역 3개(쓰임, 빈 글, `{}` 개수 다름)로 경우마다 확인하는 언어팩 예제.

## v0.13.0 (2026-10-13)

### source-viewer.html, docs-viewer.html

- 맨 위 프로젝트 이름 옆에 프로젝트 버전 표시: `source_lens_html v0.13.0 / source/tests/...`. 버전은 연 폴더 `CHANGELOG.md`의 첫 `## vX.Y.Z` (영어판이 없으면 `CHANGELOG.ko.md`). 변경 기록이 없거나 버전이 없으면 전과 같이 이름만 표시.
- 파일 목록을 다시 읽을 때 버전도 다시 읽음.
- 맨 위 버전 주석: source-viewer v0.13.0, docs-viewer v0.13.0 (docs-viewer도 이제 프로젝트 버전을 따름).

## v0.12.0 (2026-10-13)

### source-viewer.html

- JSON5(`.json5`) 문법 색칠: 주석(`//`, `/* */`), 따옴표 없는 키, 작은따옴표 문자열(줄 끝 `\`로 이어지는 줄 포함), 16진수(`0x1F`), `+2.`, `.5`, `Infinity`, `NaN`, 끝 쉼표. 키는 따옴표가 있든 없든 키 색으로.
- `json5`는 따로 둔 언어 (`.json`·`.jsonc`는 그대로). `.md`의 ` ```json5 ` 코드 블록도 색칠됨.
- TOML·JSON5에서 숫자 앞 `+` 부호도 숫자에 포함해 색칠 (전에는 색이 안 칠해졌음).
- 맨 위 버전 주석 v0.12.0.

### tests

- `tests/samples/project/language/ko/main.json5`: 위 문법을 모두 넣은 JSON5 예제.

## v0.11.0 (2026-10-13)

### source-viewer.html

- `.ui` 오류·경고 설명을 한국어로: 화면 언어가 한국어이면 소스 아래 진단 줄과 밑줄 풍선 도움말이 한국어로 나옴 (`error[E003]` 같은 코드는 그대로).
  - 풍선 도움말에는 구분선 아래에 영어 원문(`ui-check`와 같음)도 나옴.
  - 언어(한국어 / English)를 바꾸면 설명도 그 언어로 다시 그림.
- 번역(메시지·help·낱말 159개)은 `UI_MSG` 표로 내장. 원본은 tile_font_editor_cpp의 `language\ko\ui-check.json5`. 번역이 없거나 빈 글이면 영어 원문.
- `ui-check`와 같은 출력과 검사 결과는 v0.10.0과 같음 (`tests/ui`·샘플로 비교).
- 맨 위 주석 버전 v0.11.0.

## v0.10.0 (2026-10-13)

### source-viewer.html

- `.ui` 요소 이름을 동작·의미가 확실한 것으로 (ui-guideline 문서 0.9를 따름):
  - `edit` → `text_field`, `number` → `number_field`, `dropdown` → `menu_button`
- 옛 이름도 계속 읽고 경고 W104 (`'edit' is an old name` / `help: use 'text_field' instead`), 0.8의 옛 이름과 같음. 요소 이름으로 쓸 수 없음(E013), 추천(`did you mean`)은 새 이름만.
- 메시지도 새 이름으로: `'menu_button' needs menu=<menu name>`, `a menu_button opens it`, `defaults work for: label, button, text_field, number_field, menu_button, ...`, E004·E010 등의 종류 이름.
- 그 밖의 결과는 v0.9.0과 같음 (`tests/ui` 33개로 비교: W104, 새 이름, `UI 0.9`만 다르고 배치 결과는 같음).
- 미리보기: 상자와 보기 모드도 새 이름으로 (`menu_button`을 클릭하면 메뉴가 펼쳐짐).
- 맨 위 주석 버전 v0.10.0, `UI_DOC_VERSION` 0.9.
- 참고: C++ `ui-check`(uilayout.cppm)는 아직 문서 0.7.

### tests

- 샘플 `.ui`를 새 이름으로 바꿈. `old_names.ui`에 `edit`·`number`·`dropdown`도 넣음 (W104 18개).
- `tests\samples\ui\w104_old_names.ui`(옛 이름 전부, W104 11개, 오류 없음), `w104_mixed.ui`(옛·새 이름 함께 → E006, 오류 있는 옛 이름 → W104 없음, 옛 종류 이름을 요소 이름으로 → E013) 추가.

## v0.9.0 (2026-10-12)

### source-viewer.html

- `.ui` 이름을 가장 많이 쓰는 것으로 (ui-guideline 문서 0.8을 따름):
  - 요소: `check` → `checkbox`, `item` → `menu_item`
  - 속성: `tip` → `tooltip`, `disabled_tip` → `disabled_tooltip`, `hint` → `placeholder`, `gap` → `spacing`, 메뉴 항목 `check` → `checkable`
  - `edit`, `number`, `dropdown`과 나머지 이름은 그대로.
- 옛 이름도 계속 읽음 (레거시): 쓰면 주황 밑줄 경고 W104 `'tip' is an old name` / `help: use 'tooltip' instead` (자동 수정 분류).
  - 옛 이름과 새 이름은 같은 속성: 한 줄에 둘 다 쓰면 뒤의 것이 E006.
  - 속성의 W104는 그 속성에 다른 오류가 없을 때만. 옛 종류 이름(`check`, `item`)은 요소 이름으로 쓸 수 없음(E013). 추천(`did you mean`)은 새 이름만.
- 오류 설명의 종류 이름·속성 목록도 새 이름으로 (W103 `has no tooltip`, E016 `'checkable' and 'radio'` 등). 그 밖의 결과는 v0.8.0과 같음 (`tests/ui` 33개로 비교).
- 미리보기: `checkbox`·`menu_item` 그리기, 풍선 도움말은 `tooltip`·`disabled_tooltip`.
- 맨 위 주석 버전 v0.9.0, `UI_DOC_VERSION` 0.8.
- 참고: C++ `ui-check`(uilayout.cppm)는 아직 문서 0.7이라, W104와 바뀐 메시지는 뷰어에만 있음.

### tests

- 샘플 `.ui`를 새 이름으로 바꿈. `tests\samples\ui\old_names.ui` 추가 (옛 이름만 써서 W104 14개).

## v0.8.0 (2026-10-12)

### source-viewer.html

- `.ui` 보기 모드 풍선 도움말: 상자에 마우스를 올리면 0.5초 뒤 커서 아래에 프로그램의 풍선 도움말이 뜸.
  - 글: `tip` (disabled 요소는 `disabled_tip`, 없으면 `tip`). `\n`은 줄 바꿈.
  - `tip`이 없거나 `tip=""`인 요소, hidden 요소는 아무것도 안 보임 (실제 프로그램과 같음).
  - 앱 테마 색으로 직접 그림. 미리보기 칸 밖으로도 나가고, 화면 오른쪽·아래가 모자라면 안쪽·커서 위로 옮김.
  - 상자를 떠나거나, 클릭(dropdown 메뉴 열기 포함)·휠·Esc·다시 그리기 때 닫힘.
  - 보기 모드에서는 상자의 위치·크기 설명(브라우저 title)을 띄우지 않음. 배치 모드는 그대로.
- 맨 위 주석 버전 v0.8.0.

## v0.7.0 (2026-10-12)

### tests

- `.ui` 레이아웃 샘플 `tests/samples/ui` (각각 하나의 완성된 화면, 뷰어 코드는 바뀌지 않음):
  - `positions.ui`: 찾기·바꾸기 대화상자 — group 안 위치(left·right·top·bottom, right_of·below, gap, padding).
  - `rows_columns.ui`: 설정 창 — row·column 중첩, spacer, align, defaults.
  - `all_elements.ui`: 타일 에디터 화면 — 모든 요소 종류, hidden·disabled, 메뉴 3개(radio 묶음, check, 하위 메뉴).
  - `errors_recover.ui`: 일부러 넣은 오류 7개 — 틀린 요소를 빼고 그리는 모습.
  - `errors_cannot.ui`: 머리 줄 `#ui 1` 없음(E001) — 그릴 수 없다는 안내.

## v0.6.0 (2026-10-12)

### source-viewer.html

- `.ui` 메뉴 미리보기: 미리보기 머리에 `배치 | 보기` 모드 버튼 (브라우저에 기억).
  - 배치 모드: 지금처럼 상자 클릭 → 소스 줄 이동.
  - 보기 모드: dropdown을 클릭하면 `menu=`로 연결된 menu가 풀다운으로 펼쳐짐.
    item, separator, radio(●)·check(✓)의 checked 상태, 안쪽 menu는 하위 메뉴(▸, 마우스를 올리면 펼침).
    바깥 클릭·Esc·항목 클릭으로 닫힘. radio·체크박스는 보기만 함 (클릭으로 바꾸지 않음).
  - 메뉴 항목 풍선 도움말에 종류·이름·줄 번호. 빈 메뉴는 "(빈 메뉴)".

### tests

- `tests/samples/project/ui/menu.ui`: 메뉴 미리보기 시험용 (radio, check, separator, 하위 메뉴, 빈 메뉴).

## v0.5.0 (2026-10-12)

### source-viewer.html

- `.ui` 배치 미리보기 ↔ 소스 줄 (3단계 중 첫 부분):
  미리보기 상자를 클릭하면 위 소스가 그 줄로 가고 줄을 강조함 (주소 `#경로:L12`).
  줄 번호를 클릭하면 그 줄의 상자도 강조됨 (굵은 테두리 + 선택 배경).
- 상자 풍선 도움말에 줄 번호와 "클릭하면 소스의 이 줄로 갑니다." 추가.

## v0.4.0 (2026-10-12)

### source-viewer.html

- `.ui` 배치 미리보기 (2단계): `.ui` 파일을 열면 화면을 위(소스) / 아래(배치)로 나눔. 경계를 끌어 높이를 바꿈.
  "배치 숨기기" / "배치 보기" 버튼으로 끄고 켬 (기본은 켬, 브라우저에 기억).
- 창 크기: 640×480, 800×600, 1024×768, 1280×720, "아래 칸에 맞춤", 너비·높이 직접 입력. DPI 배율 100~200%.
- 위치는 v0.3.0의 계산을 쓰고, 글자 너비는 브라우저에서 잼 (글꼴 12px, 줄 높이 16, × 배율).
- 간단한 실제 모양: 버튼, 입력칸, ☐ 체크, 빗금 canvas, 점선 테두리 + 이름의 group·row·column. `hidden`은 흐리게.
  상자에 마우스를 올리면 종류·이름·위치·크기가 보임.
- 오류가 있으면 틀린 요소를 빼고("무시") 그리고 빨간 안내. 복구할 수 없는 오류(E001 등)는 빨간 안내만.

 (2026-10-12)

### source-viewer.html

- `.ui` 위치 계산 (배치 미리보기 1단계, 화면은 아직 그대로): `tile_font_editor_cpp`의 `src/uilayout.cppm`에서
  `Layouter`·`compute()`·`recover()`를 JavaScript로 옮김 (`uiCheck.compute`, `uiCheck.recover`).
  시험 값(창 640×480, 글자 너비 = 코드 포인트 × 7, 줄 높이 16, `// test:` 줄)으로 `tests/ui/ok/*.expected` 5개와
  `tests/ui/recover/basic.expected`와 글자 하나까지 같은 결과.
- 오류 복구("무시"): 오류가 있는 요소는 묶음째 빼고, 가리키는 요소가 없는 `right_of`·`below`는 `left=0`·`top=0`으로. 원래 검사 결과는 바꾸지 않음.

## v0.2.0 (2026-10-12)

### source-viewer.html

- `.ui` 전체 검사기: 간단 검사(E002·E003·E013)를 `ui-check`와 같은 전체 검사로 바꿈.
  E001~E016, W101·W103 (가이드라인 0.7). `tile_font_editor_cpp`의 `src/uilayout.cppm`(검사기)을 JavaScript로 옮겨,
  `tests/ui/error/*.expected` 21개와 글자 하나까지 같은 결과, `tests/ui/fix`의 오류 범위·수정 분류도 같음.
- 오류 설명은 `ui-check`와 같은 영어 원문.
- 경고(W1xx)는 주황 물결 밑줄과 `warning[...]` 줄로 따로 보여 줌. 상태줄에 "오류 N개 · 경고 M개" (없으면 "검사 통과").
- 길이 0인 진단(줄 끝에서 빠진 것, 빈 파일의 E001 등)도 진단 줄로 보여 줌.
- `.ui` 파일은 UTF-8로만 읽음 (EUC-KR로 바꿔 읽지 않음). 틀린 바이트는 `�`로 보이고 E004 "invalid UTF-8"로 알림.
- 마크다운 코드 블록 안의 `.ui`는 색칠만 함 (예제 조각이라 검사하지 않음).

### 저장소

- `.gitattributes` 줄 끝 정리: `* text=auto eol=lf`, `*.bat`·`*.cmd`는 `eol=crlf`.

## v0.1.0 (2026-10-12)

따로 프로젝트(`source_lens_html`)로 만든 첫 버전.

### source-viewer.html (새로 만듦)

- 문법 색칠과 줄 번호가 붙은 소스 파일 보기: C++, Rust, TOML, JSON, BAT/CMD, 셸·YAML·Makefile·`.gitignore`.
- 줄 번호는 복사되지 않음. 줄 번호를 누르면 그 줄을 표시하고 주소에 `#경로:L12`를 남김.
- 마크다운: 문서 보기 / 원문 보기, 코드 블록 색칠, 소스 파일로 가는 링크(`file.rs#L12`).
- 인코딩: UTF-8, EUC-KR(CP949), UTF-16.
- `.ui` 레이아웃 파일 (가이드라인 0.7): 색칠, E002·E003·E013 간단 검사와 `did you mean` 추천,
  빨간 물결 밑줄, 오류 줄 아래의 `error[...]` / `help:` 줄 (끌 수 있음, 복사 안 됨), 상태줄에 오류 개수.
- `.ui.log` 파일: 시각, `줄:칸`, 오류 코드 색칠.

### docs-viewer.html

- 문서 목록을 트리로: 폴더 접기·펼치기(기억됨), 연 문서가 든 폴더는 저절로 펼쳐짐.
- 트리에 가지 연결선 `├ └ │`.
- 좁은 창에서도 목록이 세로 트리로 유지됨.

### 두 뷰어 공통

- 가지 연결선이 있는 트리 목록, 목록 폭 조절, 테마, 한국어 / 영어 전환, 자동 새로 고침 (Chrome·Edge).
