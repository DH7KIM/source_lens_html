# source-viewer 분리 소스

English version: [README.md](README.md)

`source-viewer.html`(파일 하나, 복사해서 그대로 씀)은 이 폴더의 파일들을 [`parts.txt`](parts.txt) 순서대로 위에서 아래로 이어 붙여 만듭니다.

## 규칙

- **`source-viewer.html`이 아니라 조각을 고칩니다.** 합친 파일을 직접 고치면 다음에 합칠 때 사라집니다.
- 고친 뒤에는 다시 합치고, 합친 파일로 시험합니다 (사용자에게 가는 것이 합친 파일입니다).
- 조각 하나 = 구획 하나. 시작 코드(`js/22-boot.js`)는 항상 맨 마지막에 둡니다. 먼저 실행되면 시작할 때 오류가 납니다.
- 새 조각은 실행돼야 할 자리에 `parts.txt` 줄을 넣고, 이름에는 비어 있는 다음 번호를 붙입니다.
- `.ui` 검사·색칠·배치 미리보기는 아직 `.ui` 형식 1(문서 0.9) 기준으로 `06-ui-check.js`, `07-ui-highlight.js`, `18`~`21`에 있습니다.

## 합치는 법 (Python 3)

`source` 폴더에서 실행합니다.

```text
python3 tools/merge-parts.py src source-viewer.html
```

합친 파일이 다른 파일과 바이트까지 같은지 확인하려면 (예: 아무것도 바뀌면 안 되는 고침 뒤):

```text
python3 tools/merge-parts.py src source-viewer.merged.html --check source-viewer.html
```

## 조각

| 조각 | 내용 |
|---|---|
| `parts/00-head.html` | `<!doctype>` ~ `<style>` |
| `parts/01-style.css` | CSS |
| `parts/02-body.html` | `</style>` ~ `<script>` |
| `parts/js/01-strings.js` | 화면 문자열 |
| `parts/js/02-file-kinds.js` | 파일 종류 |
| `parts/js/03-highlight.js` | 문법 색칠 |
| `parts/js/04-json5.js` | JSON5 읽기 (언어팩용) |
| `parts/js/05-ui-messages.js` | `.ui` 오류·경고 설명 번역 |
| `parts/js/06-ui-check.js` | `.ui` 검사기 |
| `parts/js/07-ui-highlight.js` | `.ui` 색칠 |
| `parts/js/08-markdown.js` | 마크다운 → HTML (`docs-viewer.html`과 같은 변환기) |
| `parts/js/09-source-folder.js` | 소스 폴더 (FSA 또는 파일 목록) |
| `parts/js/10-tree-list.js` | 트리 목록 |
| `parts/js/11-list-width-and-helpers.js` | 목록 폭, 읽기 도우미 |
| `parts/js/12-language-pack.js` | 언어팩 |
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
