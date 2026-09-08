# Mapbox marker editor

A small SPA for adding, editing, moving, importing, and exporting scored map markers.

## Architecture

- `frontend/src/domain` contains marker types and score definitions.
- `frontend/src/services` contains the static HTTP and JSON services.
- `frontend/src/hooks/useMarkers.ts` owns marker state and actions.
- `frontend/src/components` contains focused UI components.
- `frontend/src/map` isolates Mapbox marker creation.
- `backend/app/main.py` contains only the HTTP layer.
- `backend/app/services.py` creates markers and rejects every third request.

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

From the project root:

```powershell
.\start.cmd
```

The script starts both servers and opens <http://localhost:5173>. Close the two
server terminals to stop the project.

## Interaction

1. Choose a score in the top-left panel.
2. Click the map to create a marker.
3. Click a marker to change its score or delete it.
4. Drag a marker to change its position.

Every third create request fails by design. A failed marker is not added to the map.
