import secrets
from uuid import uuid4

from app.schemas import Marker, MarkerCreate


class MarkerCreationRejected(Exception):
    pass


class MarkerService:
    FAILURE_CHANCE_PERCENT = 30

    @staticmethod
    def create(marker: MarkerCreate) -> Marker:
        if secrets.randbelow(100) < MarkerService.FAILURE_CHANCE_PERCENT:
            raise MarkerCreationRejected("Marker could not be saved. Please try again.")

        return Marker(id=str(uuid4()), **marker.model_dump())
