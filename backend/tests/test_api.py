from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
VALID_MARKER = {"longitude": 30.5234, "latitude": 50.4501, "score": 5}


def test_marker_request_fails_for_random_values_below_30() -> None:
    with patch("app.services.secrets.randbelow", return_value=29) as randbelow:
        response = client.post("/api/markers", json=VALID_MARKER)

    assert response.status_code == 503
    randbelow.assert_called_once_with(100)


def test_marker_request_succeeds_for_random_values_from_30() -> None:
    with patch("app.services.secrets.randbelow", return_value=30) as randbelow:
        response = client.post("/api/markers", json=VALID_MARKER)

    assert response.status_code == 201
    assert response.json()["score"] == VALID_MARKER["score"]
    assert "id" in response.json()
    randbelow.assert_called_once_with(100)


def test_invalid_score_is_rejected() -> None:
    response = client.post("/api/markers", json={**VALID_MARKER, "score": 6})

    assert response.status_code == 422
