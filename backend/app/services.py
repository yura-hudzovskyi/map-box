from threading import Lock
from uuid import uuid4

from app.schemas import Marker, MarkerCreate


class MarkerCreationRejected(Exception):
    pass


class MarkerService:
    FAILURE_INTERVAL = 3

    _request_count = 0
    _lock = Lock()

    @classmethod
    def create(cls, marker: MarkerCreate) -> Marker:
        with cls._lock:
            cls._request_count += 1
            should_fail = cls._request_count % cls.FAILURE_INTERVAL == 0

        if should_fail:
            raise MarkerCreationRejected("Marker could not be saved. Please try again.")

        return Marker(id=str(uuid4()), **marker.model_dump())

    @classmethod
    def reset(cls) -> None:
        with cls._lock:
            cls._request_count = 0

