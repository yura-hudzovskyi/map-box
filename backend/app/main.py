from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import Marker, MarkerCreate
from app.services import MarkerCreationRejected, MarkerService

app = FastAPI(title="Mapbox marker API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


@app.post("/api/markers", response_model=Marker, status_code=status.HTTP_201_CREATED)
def create_marker(marker: MarkerCreate) -> Marker:
    try:
        return MarkerService.create(marker)
    except MarkerCreationRejected as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        ) from error
