:; exec bash "$(dirname -- "$0")/start.sh" "$@"
@echo off
setlocal

set "PROJECT_ROOT=%~dp0"

start "Mapbox API" /D "%PROJECT_ROOT%backend" cmd.exe /k ".venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
start "Mapbox UI" /D "%PROJECT_ROOT%frontend" cmd.exe /k "npm.cmd run dev"

timeout /t 2 /nobreak >nul
start "" "http://localhost:5173"

endlocal
