@echo off
rem Builds this sample and saves the compiler output next to this file (errors are expected).
cd /d "%~dp0"
set LC_ALL=C
g++ -std=c++20 -Wall -Wextra -fdiagnostics-color=never -c src/main.cpp src/util.cpp 2> build.log
cargo build --message-format=json > cargo.json
del /q main.o util.o 2>nul
