# 바뀐 점 (Changelog)

English: [CHANGELOG.md](CHANGELOG.md)

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
