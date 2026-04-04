@echo off
echo ========================================
echo   PHP SQLite Setup Checker
echo ========================================
echo.

REM Find PHP
set PHP_PATH=
where php >nul 2>nul && set PHP_PATH=php

if "%PHP_PATH%"=="" (
    echo ERROR: PHP not found in PATH
    pause
    exit /b 1
)

echo Checking PHP extensions...
echo.
%PHP_PATH% -m | findstr /i "sqlite"
echo.
%PHP_PATH% -m | findstr /i "pdo"
echo.

echo ========================================
echo Full PHP configuration check:
echo ========================================
%PHP_PATH% -i | findstr /i "pdo_sqlite sqlite3"
echo.

REM Check if SQLite is enabled
%PHP_PATH% -r "if(in_array('sqlite', PDO::getAvailableDrivers())) { echo 'SQLite is ENABLED - OK!' . PHP_EOL; } else { echo 'SQLite is NOT enabled!' . PHP_EOL; }" 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================
    echo   SQLite is NOT enabled!
    echo ========================================
    echo.
    echo To enable SQLite:
    echo.
    echo 1. Find your php.ini file:
    echo    %PHP_PATH% --ini
    echo.
    echo 2. Open php.ini in a text editor
    echo.
    echo 3. Find and uncomment these lines (remove the ; at the start):
    echo    extension=pdo_sqlite
    echo    extension=sqlite3
    echo.
    echo 4. If the lines don't exist, add them to the [PHP] section
    echo.
    echo 5. Restart your PHP server
    echo.
    echo For XAMPP users:
    echo - Edit: C:\xampp\php\php.ini
    echo - Make sure these DLLs exist in C:\xampp\php\ext\:
    echo   php_sqlite3.dll
    echo   php_pdo_sqlite.dll
    echo.
) else (
    echo.
    echo SQLite is enabled! You're ready to run the application.
    echo.
    echo Run: run.bat
)

echo.
pause
