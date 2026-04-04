@echo off
setlocal enabledelayedexpansion

REM Todo Kanban Board - PHP Application Launcher
set PHP_PATH=C:\tools\php85\php.exe

echo ========================================
echo   Todo Kanban Board Application
echo ========================================
echo.

REM Check if PHP exists
if not exist "%PHP_PATH%" (
    echo ERROR: PHP not found at %PHP_PATH%
    pause
    exit /b 1
)

echo Using PHP: %PHP_PATH%
echo.
%PHP_PATH% -v | findstr /C:"PHP"
echo.

REM Check SQLite
echo Checking SQLite...
%PHP_PATH% -r "if(in_array('sqlite', PDO::getAvailableDrivers())) { echo 'SQLite: ENABLED' . PHP_EOL; } else { echo 'SQLite: NOT ENABLED' . PHP_EOL; exit(1); }"
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: SQLite is not enabled!
    echo Run: enable_sqlite.bat
    pause
    exit /b 1
)
echo.

REM Create data directory if it doesn't exist
if not exist "data" mkdir data

REM Get the current directory
set SCRIPT_DIR=%~dp0

REM Start PHP built-in server
echo ========================================
echo Starting PHP built-in web server...
echo ========================================
echo.
echo Application URL: http://localhost:8080
echo.
echo The browser will open automatically.
echo Press Ctrl+C to stop the server.
echo.
echo Starting in 2 seconds...
timeout /t 2 /nobreak >nul

REM Open browser
start http://localhost:8080

REM Start server (this will keep running)
%PHP_PATH% -S localhost:8080 -t "%SCRIPT_DIR%"
