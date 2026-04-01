@echo off
REM Todo Kanban Board - PHP Application Launcher
REM This script starts the PHP built-in web server

echo ========================================
echo   Todo Kanban Board Application
echo ========================================
echo.

REM Check if PHP is installed
where php >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: PHP is not installed or not in PATH
    echo Please install PHP from https://www.php.net/downloads
    pause
    exit /b 1
)

REM Check PHP version
echo Checking PHP version...
php -v | findstr /C:"PHP"
echo.

REM Create data directory if it doesn't exist
if not exist "data" mkdir data

REM Get the current directory
set SCRIPT_DIR=%~dp0

REM Start PHP built-in server
echo Starting PHP built-in web server...
echo Server will be available at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

php -S localhost:8080 -t "%SCRIPT_DIR%"
