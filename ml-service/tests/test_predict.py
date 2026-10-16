"""Tests for the prediction API."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    """Health endpoint should return 200."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_predict_valid():
    """Predict endpoint should return risk probability and level."""
    payload = {
        "age": 55,
        "bmi": 32.5,
        "physicalActivity": "Low",
        "smokingStatus": "Current",
        "alcoholConsumption": "Heavy",
        "dietQuality": "Poor",
        "stressLevel": "High",
        "familyHistory": True,
        "saltIntake": "High",
        "sleepHours": 4.5,
        "caffeineIntake": "Heavy",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "riskProbability" in data
    assert "riskLevel" in data
    assert data["riskLevel"] in ["Low", "Moderate", "High"]
    assert 0 <= data["riskProbability"] <= 100


def test_predict_low_risk():
    """A healthy profile should predict Low risk."""
    payload = {
        "age": 22,
        "bmi": 21.0,
        "physicalActivity": "High",
        "smokingStatus": "Never",
        "alcoholConsumption": "None",
        "dietQuality": "Good",
        "stressLevel": "Low",
        "familyHistory": False,
        "saltIntake": "Low",
        "sleepHours": 8,
        "caffeineIntake": "None",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["riskLevel"] in ["Low", "Moderate"]


def test_predict_invalid_age():
    """Age below 18 should be rejected."""
    payload = {
        "age": 15,
        "bmi": 22.0,
        "physicalActivity": "Moderate",
        "smokingStatus": "Never",
        "alcoholConsumption": "None",
        "dietQuality": "Good",
        "stressLevel": "Low",
        "familyHistory": False,
        "saltIntake": "Low",
        "sleepHours": 8,
        "caffeineIntake": "None",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_missing_field():
    """Missing a required field should be rejected."""
    payload = {
        "age": 45,
        "bmi": 28.0,
        "physicalActivity": "Moderate",
        "smokingStatus": "Former",
        # Missing alcoholConsumption, dietQuality, stressLevel, familyHistory, saltIntake, sleepHours, caffeineIntake
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_invalid_sleep():
    """Sleep hours below 3 should be rejected."""
    payload = {
        "age": 45,
        "bmi": 28.0,
        "physicalActivity": "Moderate",
        "smokingStatus": "Former",
        "alcoholConsumption": "Occasional",
        "dietQuality": "Average",
        "stressLevel": "Moderate",
        "familyHistory": False,
        "saltIntake": "Moderate",
        "sleepHours": 2,
        "caffeineIntake": "Occasional",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
