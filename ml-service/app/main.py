"""FastAPI application entrypoint for the Hypertension Risk Prediction ML service."""

import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the ml-service directory is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.api.predict import router as predict_router
from app.api.health import router as health_router
from app.services.predictor import model_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model on startup."""
    try:
        model_service.load()
        print(f"Model loaded successfully: {model_service.model_name}")
    except FileNotFoundError as e:
        print(f"Warning: {e}")
        print("The /predict endpoint will return 503 until the model is trained.")
    yield
    # Cleanup (nothing to do)


app = FastAPI(
    title="Hypertension Risk Prediction API",
    description="ML service for predicting hypertension risk from lifestyle data",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health_router, tags=["health"])
app.include_router(predict_router, tags=["prediction"])


@app.get("/")
async def root():
    """Root endpoint with service info."""
    return {
        "service": "Hypertension Risk Prediction API",
        "version": "1.0.0",
        "model_loaded": model_service.is_loaded,
        "model_name": model_service.model_name if model_service.is_loaded else None,
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
        },
    }
