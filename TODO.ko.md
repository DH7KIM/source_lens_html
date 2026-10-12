# Source Viewer TODO

## 완료

- [x] 소스 파일 목록을 트리 구조로 (폴더 접기·펼치기) — 2026.10.12
- [x] 트리에 가지 연결선 (├ └ │), docs-viewer에도 같은 트리 — 2026.10.12
- [x] .ui 오류 줄 아래에 오류 코드·설명·추천(help) 표시, 켜기/끄기 버튼 (지금 있는 E002·E003·E013 검사로) — 2026.10.12
- [x] `.gitattributes` 줄 끝 정리 (`* text=auto eol=lf`, `.bat`·`.cmd`는 `eol=crlf`) — 2026.10.12 (v0.2.0)
- [x] .ui 전체 검사기: E001~E016, W101·W103. `tests/ui/error/*.expected` 21개와 글자 하나까지 같음 — 2026.10.12 (v0.2.0)
- [x] .ui 위치 계산: `Layouter`·`compute()`·`recover()` 이식. `tests/ui/ok` 5개 + `recover` 1개와 글자 하나까지 같음 — 2026.10.12 (v0.3.0)
- [x] .ui 배치 미리보기 화면: 위(소스) / 아래(배치), 경계 끌기, 창 크기(목록 + 직접 입력)·배율, 간단한 실제 모양, 오류는 "무시"처럼 빼고 그림 — 2026.10.12 (v0.4.0)
- [x] 미리보기 상자 ↔ 소스 줄 서로 이동: 상자 클릭 → 소스 줄 이동·강조, 줄 번호 클릭 → 상자 강조, 풍선에 줄 번호 — 2026.10.12 (v0.5.0)
- [x] .ui 레이아웃 샘플 `tests\samples\ui`: positions, rows_columns, all_elements(모든 요소 + 메뉴), errors_recover, errors_cannot — 2026.10.12 (v0.7.0)
- [x] 메뉴 미리보기: `배치 | 보기` 모드. 보기 모드에서 dropdown 클릭 → menu 풀다운(item·separator·radio ●·check ✓·하위 메뉴 ▸), 바깥 클릭·Esc로 닫기. radio·체크박스는 보기만 (클릭으로 안 바꿈) — 2026.10.12 (v0.6.0)

## 다음 버전 (순서대로)

- [ ] 보기 모드에서 툴팁 확인: 상자에 마우스를 올리면 `tip`(disabled면 `disabled_tip`) 글을 프로그램 풍선 도움말처럼 보여 주기 — 2026.10.12 요청

- [ ] .ui 오류 설명 한국어로 보기: 번역은 tile_font_editor_cpp 언어팩(`language\ko\*.json5`, 영어 원문이 키)에 한 번만 만들고 뷰어에 내장. 연 폴더에 언어팩이 있으면 그것을 우선. 오류 코드·ui-check 출력은 영어 그대로 — 2026.10.12 요청
- [ ] json5 지원: 색칠(따옴표 없는 키, 작은따옴표 문자열, 16진수, Infinity·NaN, 끝 쉼표) + 언어팩 읽기 (한국어 오류 설명에 필요) — 2026.10.12 요청
- [ ] 컴파일러 결과 보기 (GCC 먼저): 빌드 출력을 파일로 저장(예: `build.bat`에서 `2> build.log`)하면, 그 로그의 `파일:줄:칸: error/warning: ...`를 읽어 해당 소스 줄에 밑줄 + 진단 줄 표시 (.ui 진단 표시 재사용, 자동 새로 고침과 함께). Rust는 `cargo build --message-format=json` 다음 단계 — 2026.10.12 요청
- [ ] toml 검사 (`Cargo.toml` 등): 문법이 작아 .ui처럼 정확히 검사 가능 — 2026.10.12 요청
- [ ] `.rc`(리소스 스크립트) 검사기: GCC `windres`를 기준으로, `tests/rc`에 windres 결과를 `.expected`로 모아 맞춤 (DIALOG·MENU·STRINGTABLE·BEGIN/END·#include 등) — 2026.10.12 요청
- [ ] 시험 샘플: Source Lens가 지원하는 확장자를 전부 `tests\samples`에 넣기 (`LANG_BY_EXT`·`LANG_BY_NAME` 기준, 빠진 것 채우기) — 2026.10.12 요청 (v0.6.0 작업 중)
  - 샘플은 조각이 아니라 **하나의 완성된 예제**로 만들기 (예: C++ — `#include`·`import` → `int main(...)` → `printf(...)` → `return 0;` 까지 컴파일되는 모양) — 2026.10.12 요청
- 참고: C++·Rust 컴파일 오류를 브라우저에서 직접 검사하는 것은 컴파일러를 다시 만드는 일이라 하지 않음 (컴파일러 결과 보기로 대신)

## 나중에 (후보)

- [ ] `.ui` 이름을 통상적인 것으로 바꾸면 따라가기 (`tip` → `tooltip`, `disabled_tip` → `disabled_tooltip` 등): ui-guideline 문서가 먼저 바뀐 뒤 `UI_ATTRS`·검사기·샘플 고치기 — 2026.10.12

- [ ] uilayout.cppm이 바뀌면 뷰어 검사기도 맞추기 (문서 버전이 오를 때) — 지금은 문서 0.7
- [ ] 검사기 버전 어긋남 알림: 연 폴더에 `tests/ui`가 있으면 `.expected`와 뷰어 검사 결과를 비교해서, 다르면 "검사기가 문서 0.x와 맞지 않음" 빨간 경고 — 2026.10.12 생각
- [ ] 문법 정의를 바깥 파일로: 기본 문법은 HTML 안에 데이터 표로 두고, 연 폴더에 `syntax\<언어>.syntax`가 있으면 그것을 우선 사용 (.ui의 내장 + 바깥 파일 우선 방식). `.syntax` 오류는 .ui처럼 줄·칸·오류 코드로 알림 — 2026.10.12 생각
- [ ] .ui 검사·미리보기 방식을 다른 파일에도 응용 (예: 언어팩 json5 검사, Cargo.toml 등) — 2026.10.12 생각, 무엇에 적용할지 정하기
- [ ] GitHub 공개 (연습 겸 첫 저장소): README에 스크린샷, GitHub Pages 켜고 주소를 README에 적기 — 2026.10.12 이야기
