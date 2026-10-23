# 컴파일러 결과 샘플

English: [README.md](README.md)

Source Viewer의 `컴파일러 결과` 기능을 시험해 보는 작은 프로젝트입니다. Source Viewer에서 이 폴더(`compiler_output`)를 열고 `src` 아래 파일을 열면, `build.log`(GCC)와 `cargo.json`(Rust)의 오류·경고·note가 소스 줄에 보입니다.

- `build.log` — `src/main.cpp`, `src/util.cpp`를 `g++ -Wall -Wextra`(영어 메시지)로 컴파일한 실제 GCC 출력: 오류 3개, 경고 4개, note 1개. 화면 언어로 붙는 설명이 어떻게 보이는지도 볼 수 있습니다.
- `cargo.json` — `src/main.rs`를 `cargo build --message-format=json`으로 빌드한 실제 출력: 오류 2개(E0308, E0599), 경고 1개.
- `build.bat` — 두 파일을 다시 만듭니다 (`g++`와 `cargo`가 PATH에 있어야 함). 일부러 빌드가 실패하게 해 두어서 컴파일러 결과가 나옵니다.
- 두 결과 파일의 줄 번호는 소스와 맞춰져 있습니다. 소스를 고치면 `build.bat`를 다시 돌리기 전까지 줄이 어긋납니다.
