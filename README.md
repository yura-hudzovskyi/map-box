# Mapbox marker editor

A small SPA for adding, editing, moving, importing, and exporting scored map markers.

## Architecture

- `frontend/src/domain` contains marker types and score definitions.
- `frontend/src/services` contains the static HTTP and JSON services.
- `frontend/src/hooks/useMarkers.ts` owns marker state and actions.
- `frontend/src/components` contains focused UI components.
- `frontend/src/map` isolates Mapbox marker creation.
- `backend/app/main.py` contains only the HTTP layer.
- `backend/app/services.py` creates markers and randomly rejects 30% of requests.

Markers are intentionally stored in browser memory because the task does not require a database.

## First-time setup

Backend (Python 3.10+):

```powershell
cd backend
py -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
```

Frontend (Node.js 20+):

```powershell
cd frontend
Copy-Item .env.example .env
# Add your Mapbox public token to .env
npm install
```

## Start

From the project root, use the script for your shell.

PowerShell or Command Prompt:

```powershell
.\start.cmd
```

Bash (Git Bash, WSL, Linux, or macOS):

```bash
bash ./start.sh
```

`bash ./start.cmd` is also supported and delegates to `start.sh`.

Both scripts start the API and UI, then open <http://localhost:5173>. With
`start.cmd`, close the two server terminals to stop the project. With `start.sh`,
press `Ctrl+C` in the current terminal. Pass `--no-browser` to the Bash script
when you do not want it to open the page automatically.

## Interaction

1. Optionally select **Show my city** and allow browser location access.
2. Choose a score in the top-left panel.
3. Click the map to create a marker.
4. Click a marker to change its score or delete it.
5. Drag a marker to change its position.

Each create request has a 30% chance to fail. A failed marker is not added to the map.

## Verify

Frontend:

```powershell
cd frontend
npm run check
```

Backend:

```powershell
cd backend
.venv\Scripts\python -m pytest
```
