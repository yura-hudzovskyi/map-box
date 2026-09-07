from pydantic import BaseModel, Field


class MarkerCreate(BaseModel):
    longitude: float = Field(ge=-180, le=180)
    latitude: float = Field(ge=-90, le=90)
    score: int = Field(ge=0, le=5)


class Marker(MarkerCreate):
    id: str

