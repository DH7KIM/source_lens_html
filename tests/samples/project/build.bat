@echo off
rem build
:: comment
set OUT=%~dp0bin
if not exist "%OUT%" mkdir "%OUT%"
g++ -std=c++23 main.cpp 2> build.log
cargo build --message-format=json > cargo.json
:end
