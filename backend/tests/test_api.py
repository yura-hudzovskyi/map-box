from fastapi.testclient import TestClient

from app.main import app
from app.services import MarkerService


client = TestClient(app)
VALID_MARKER = {"longitude": 30.5234, "latitude": 50.4501, "score": 5}


def setup_function() -> None:
    MarkerService.reset()


def test_every_third_marker_request_fails() -> None:
    responses = [client.post("/api/markers", json=VALID_MARKER) for _ in range(3)]

    assert [response.status_code for response in responses] == [201, 201, 503]
    assert responses[0].json()["score"] == VALID_MARKER["score"]
    assert "id" in responses[0].json()


def test_invalid_score_is_rejected() -> None:
    response = client.post("/api/markers", json={**VALID_MARKER, "score": 6})

    assert response.status_code == 422

