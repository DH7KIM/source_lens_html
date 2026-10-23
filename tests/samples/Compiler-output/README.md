# Compiler-output sample

Korean: [README.ko.md](README.ko.md)

A small project to try the `Compiler output` feature of Source Viewer. Open this folder (`Compiler-output`) in Source Viewer, then open a file under `src`: the errors, warnings and notes from `build.log` (GCC) and `cargo.json` (Rust) are drawn on the source lines.

- `build.log` — real GCC output (`g++ -Wall -Wextra`, English messages) for `src/main.cpp` and `src/util.cpp`: 3 errors, 4 warnings, 1 note. The messages also show how the explanation in the screen language looks.
- `cargo.json` — real output of `cargo build --message-format=json` for `src/main.rs`: 2 errors (E0308, E0599) and 1 warning.
- `build.bat` — makes both files again (needs `g++` and `cargo` in PATH). The build fails on purpose, so the compiler output is there to see.
- The line numbers in the two result files match the sources. If you edit a source file, the lines no longer match until you run `build.bat` again.
