@echo off
rem build
:: comment
set OUT=%~dp0bin
if not exist "%OUT%" mkdir "%OUT%"
g++ -std=c++23 main.cpp
:end
