"""Health check endpoint."""

from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.services.predictor import model_service

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check if the service is running and the model is loaded."""
    return HealthResponse(
        status="ok",
        model_loaded=model_service.is_loaded,
    )
