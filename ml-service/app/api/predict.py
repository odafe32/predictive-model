"""Prediction endpoint."""

from fastapi import APIRouter, HTTPException
from app.models.schemas import LifestyleInput, PredictionOutput
from app.services.predictor import model_service

router = APIRouter()


@router.post("/predict", response_model=PredictionOutput)
async def predict(input_data: LifestyleInput):
    """Predict hypertension risk from lifestyle data."""
    try:
        result = model_service.predict(input_data)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
