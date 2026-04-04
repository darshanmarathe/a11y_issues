@echo off
cls
echo.
echo ===============================================
echo     Todo App - ASP.NET Core with AdminLTE
echo ===============================================
echo.

cd /d "%~dp0TodoApp"

echo [1/2] Restoring packages...
dotnet restore

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Package restore failed! Please check the errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===============================================
echo     Starting Todo App...
echo     URL: http://localhost:5000
echo     Press Ctrl+C to stop the server
echo ===============================================
echo.

dotnet run --urls=http://localhost:5000

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Application failed to start!
    pause
)
