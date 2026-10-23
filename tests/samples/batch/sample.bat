@echo off
rem Batch sample: variables, labels, conditions, loops
setlocal

set NAME=Source Lens
set /a COUNT=3

if "%1"=="" goto usage
if /i "%1"=="build" goto build
goto usage

:build
echo Building %NAME% ...
for %%f in (*.cpp) do echo   %%f
for /l %%i in (1,1,%COUNT%) do echo   step %%i
exit /b 0

:usage
echo usage: %~nx0 build
exit /b 1
