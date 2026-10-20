# source-viewer 분리 소스

English version: [README.md](README.md)

`source-viewer.html`(파일 하나, 복사해서 그대로 씀)은 이 폴더의 파일들을 [`parts.txt`](parts.txt) 순서대로 위에서 아래로 이어 붙여 만듭니다.

## 규칙

- **`source-viewer.html`이 아니라 조각을 고칩니다.** 합친 파일을 직접 고치면 다음에 합칠 때 사라집니다.
- 고친 뒤에는 다시 합치고, 합친 파일로 시험합니다 (사용자에게 가는 것이 합친 파일입니다).
- 조각 하나 = 구획 하나. 시작 코드(`js/22-boot.js`)는 항상 맨 마지막에 둡니다. 먼저 실행되면 시작할 때 오류가 납니다.
- 새 조각은 실행돼야 할 자리에 `parts.txt` 줄을 넣고, 이름에는 비어 있는 다음 번호를 붙입니다.
- `.ui` 검사·색칠·배치 미리보기는 아직 `.ui` 형식 1(문서 0.9) 기준으로 `06-ui-check.js`, `07-ui-highlight.js`, `18`~`21`에 있습니다.

## 합치는 법

합치는 도구는 작은 C++ 프로그램 [`tools/merge-parts.cpp`](../tools/merge-parts.cpp)입니다. `g++`만 있으면 됩니다. `source` 폴더에서 실행합니다.

한 번 컴파일합니다 (만든 프로그램은 저장소에 올리지 않습니다. Windows에서는 `tools/merge-parts.exe`가 만들어집니다). Windows의 MinGW에서는 `-static`을 붙입니다. 안 붙이면 GCC의 DLL이 `PATH`에 있어야 하고, 못 찾으면 아무 메시지 없이 끝납니다:

```text
g++ -std=c++23 -O2 -o tools/merge-parts tools/merge-parts.cpp
g++ -std=c++23 -O2 -static -o tools/merge-parts tools/merge-parts.cpp   (Windows, MinGW)
```

합치기:

```text
tools/merge-parts src source-viewer.html
```

합친 파일이 다른 파일과 바이트까지 같은지 확인하려면 (예: 아무것도 바뀌면 안 되는 고침 뒤):

```text
tools/merge-parts src source-viewer.merged.html --check source-viewer.html
```

끝날 때 코드는 0 = 끝남(비교하면 같음), 1 = 비교해서 다름, 2 = 오류(예: 조각이 없음)입니다. 이 도구는 일부러 C++ 모듈이 아니라 `#include`를 씁니다. 작은 파일 하나라서, `import std;`로 하면 준비 단계가 늘어나기 때문입니다.

## 조각

| 조각 | 내용 |
|---|---|
| `parts/00-head.html` | `<!doctype>` ~ `<style>` |
| `parts/01-style.css` | CSS |
| `parts/02-body.html` | `</style>` ~ `<script>` |
| `parts/js/01-strings.js` | 화면 문자열: 빈 `UI` 표, 언어 이름, `t()` |
| `parts/js/01-strings-ko.js` | 화면 문자열, 한국어 (`UI.ko`) |
| `parts/js/01-strings-en.js` | 화면 문자열, 영어 (`UI.en`, 원문) |
| `parts/js/02-file-kinds.js` | 파일 종류 |
| `parts/js/03-highlight.js` | 문법 색칠 |
| `parts/js/05-ui-messages.js` | `.ui` 오류·경고 설명 번역 |
| `parts/js/06-ui-check.js` | `.ui` 검사기 |
| `parts/js/07-ui-highlight.js` | `.ui` 색칠 |
| `parts/js/08-markdown.js` | 마크다운 → HTML (`docs-viewer.html`과 같은 변환기) |
| `parts/js/09-source-folder.js` | 소스 폴더 (FSA 또는 파일 목록) |
| `parts/js/10-tree-list.js` | 트리 목록 |
| `parts/js/11-list-width-and-helpers.js` | 목록 폭, 읽기 도우미 |
| `parts/js/13-compiler-output.js` | 컴파일러 결과 (`build.log`, `cargo.json`) |
| `parts/js/14-toml-check.js` | TOML 검사 |
| `parts/js/15-open-file-and-events.js` | 파일 열기, 이벤트 |
| `parts/js/16-start.js` | 시작 |
| `parts/js/17-themes.js` | 테마 |
| `parts/js/18-ui-preview.js` | `.ui` 배치 미리보기 |
| `parts/js/19-preview-menu.js` | 미리보기: 메뉴 |
| `parts/js/20-preview-tooltip.js` | 미리보기: 풍선 도움말 |
| `parts/js/21-preview-events.js` | 미리보기: 상자, 클릭, 크기 조절 |
| `parts/js/22-boot.js` | 머리 막대 높이, 시작 (맨 마지막에 실행) |
| `parts/99-tail.html` | `</script>` ~ `</html>` |

`docs-viewer.html`은 아직 나누지 않았습니다.

## 새 언어 넣기

화면 글자는 언어마다 파일이 하나라서, 새 언어는 파일 하나를 더하면 됩니다.

1. `parts/js/01-strings-en.js`를 `parts/js/01-strings-<코드>.js`로 복사하고 (예: `01-strings-ja.js`), `UI.en`을 `UI.<코드>`(`UI.ja`)로 바꿉니다.
2. 값을 번역합니다. 키와 `{0}` `{1}` 자리는 그대로 둡니다. 빠진 글자는 영어로 보이니 일부만 번역해도 됩니다. `langName_<코드>`는 언어 목록 상자에 나오는 언어 이름(화면 언어로 적음)이고, 빠지면 `LANG_NAMES`의 그 언어 자신의 이름이 보입니다.
3. `parts.txt`에서 `parts/js/01-strings-en.js` 바로 뒤에 그 파일을 적습니다.
4. `parts/js/01-strings.js`의 `LANG_NAMES`에 언어 이름을 넣습니다.
5. 조각을 합칩니다: `tools/merge-parts src source-viewer.html`.

6. 언어 목록 상자에는 화면 글자 표가 있거나 연 폴더에 문서(`이름.<코드>.md`)가 있는 언어가 모두 나오고, 순서는 `LANG_NAMES`의 순서입니다. 이름은 각 언어 자신의 말로 적습니다.

지금의 한계: 화면 언어는 브라우저 언어로 `ko`·`en`만 자동으로 고르고, 고른 언어를 기억하지 않습니다. `.ui` 오류 설명(`05-ui-messages.js`)은 따로 있는 표이고 한국어뿐입니다.
