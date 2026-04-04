@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   PHP SQLite Enabler
echo ========================================
echo.

REM Find PHP location
set PHP_PATH=
where php >nul 2>nul && set PHP_PATH=php

if "%PHP_PATH%"=="" (
    echo ERROR: PHP not found in PATH!
    echo Please add PHP to your system PATH or enter the full path below.
    set /p "PHP_PATH=Enter full path to php.exe: "
    if not exist "!PHP_PATH!" (
        echo Error: File not found!
        pause
        exit /b 1
    )
)

echo Using PHP: %PHP_PATH%
echo.

REM Get php.ini location
echo Finding php.ini location...
for /f "tokens=2 delims=:" %%a in ('%PHP_PATH% --ini 2^>nul ^| findstr "Loaded Configuration File"') do set PHP_INI=%%a
set PHP_INI=%PHP_INI: =%

if "%PHP_INI%"=="" (
    echo Could not find php.ini automatically.
    echo Searching for php.ini in common locations...
    
    REM Try common locations
    if exist "C:\xampp\php\php.ini" set PHP_INI=C:\xampp\php\php.ini
    if exist "C:\wamp64\bin\php\php.ini" set PHP_INI=C:\wamp64\bin\php\php.ini
    if exist "C:\wamp\bin\php\php.ini" set PHP_INI=C:\wamp\bin\php\php.ini
    
    for %%p in (%PHP_PATH%) do (
        set PHP_DIR=%%~dp0
        if exist "!PHP_DIR!php.ini" set PHP_INI=!PHP_DIR!php.ini
    )
)

if "%PHP_INI%"=="" (
    echo.
    echo ERROR: Could not find php.ini file!
    echo.
    echo Please manually edit your php.ini file and add:
    echo   extension=pdo_sqlite
    echo   extension=sqlite3
    echo.
    pause
    exit /b 1
)

echo Found php.ini: %PHP_INI%
echo.

REM Check if file is writable
if not exist "%PHP_INI%" (
    echo ERROR: php.ini file does not exist!
    pause
    exit /b 1
)

echo Backing up php.ini...
copy "%PHP_INI%" "%PHP_INI%.backup" >nul
if %ERRORLEVEL% neq 0 (
    echo Warning: Could not create backup. Continuing anyway...
)

echo.
echo Enabling SQLite extensions...

REM Check if extensions are already enabled
findstr /i "extension=pdo_sqlite" "%PHP_INI%" >nul
if %ERRORLEVEL% equ 0 (
    echo - pdo_sqlite is already enabled
) else (
    echo - Enabling pdo_sqlite...
    REM Remove semicolon from commented line
    powershell -Command "(Get-Content '%PHP_INI%') -replace '^;extension=pdo_sqlite', 'extension=pdo_sqlite' | Set-Content '%PHP_INI%'"
    if %ERRORLEVEL% neq 0 (
        REM If line doesn't exist, add it
        echo extension=pdo_sqlite >> "%PHP_INI%"
    )
)

findstr /i "extension=sqlite3" "%PHP_INI%" >nul
if %ERRORLEVEL% equ 0 (
    echo - sqlite3 is already enabled
) else (
    echo - Enabling sqlite3...
    powershell -Command "(Get-Content '%PHP_INI%') -replace '^;extension=sqlite3', 'extension=sqlite3' | Set-Content '%PHP_INI%'"
    if %ERRORLEVEL% neq 0 (
        REM If line doesn't exist, add it
        echo extension=sqlite3 >> "%PHP_INI%"
    )
)

echo.
echo ========================================
echo   SQLite extensions enabled!
echo ========================================
echo.
echo IMPORTANT: Restart your PHP server for changes to take effect.
echo.
echo To restart:
echo   1. Close any running PHP server windows
echo   2. Run: run.bat
echo.

REM Verify the changes
echo Verifying installation...
%PHP_PATH% -r "if(in_array('sqlite', PDO::getAvailableDrivers())) { echo 'SUCCESS: SQLite is now enabled!' . PHP_EOL; } else { echo 'WARNING: SQLite may not be enabled. Restart PHP server.' . PHP_EOL; }"

echo.
pause
