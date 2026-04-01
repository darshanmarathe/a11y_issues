@echo off
echo ========================================
echo   Todo App - ASP.NET Core with AdminLTE
echo ========================================
echo.

cd /d "%~dp0TodoApp"

echo Restoring packages...
dotnet restore

echo.
echo Building application...
dotnet build --no-restore

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Build failed! Please check the errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================
echo   Starting Todo App...
echo   Open your browser to: http://localhost:5000
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

dotnet run --urls=http://0.0.0.0:5000

pause
