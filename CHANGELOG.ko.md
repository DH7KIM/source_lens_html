# 바뀐 점 (Changelog)

English: [CHANGELOG.md](CHANGELOG.md)

## v0.3.0 (2026-10-12)

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
