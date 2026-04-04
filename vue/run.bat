@echo off
echo ========================================
echo   Vue Todo Application Launcher
echo ========================================
echo.

cd /d "%~dp0vue-todo-app"

echo Checking for node_modules...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

echo Starting Vue Todo Application...
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

call npm run start

pause
