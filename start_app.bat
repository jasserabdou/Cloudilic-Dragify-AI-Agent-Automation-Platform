@echo off
echo ================================================
echo   Starting Cloudilic - AI Agent Application
echo ================================================
echo.

REM Start the backend in a new window
start cmd /k "cd %~dp0backend && python -m uvicorn main:app --reload"

REM Wait a moment for the backend to start
timeout /t 3 /nobreak > nul

REM Start the frontend in a new window
start cmd /k "cd %~dp0frontend && npm run dev"

echo Both backend and frontend services are starting...
echo You can close this window now.
