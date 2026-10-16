"""Pydantic models for API request/response validation."""

from pydantic import BaseModel, Field


class LifestyleInput(BaseModel):
    """Input schema for hypertension prediction."""

    age: int = Field(..., ge=18, le=90, description="Age in years (18-90)")
    bmi: float = Field(..., ge=10, le=60, description="Body Mass Index (10-60)")
    physicalActivity: str = Field(..., description="Physical activity level: Low, Moderate, or High")
    smokingStatus: str = Field(..., description="Smoking status: Never, Former, or Current")
    alcoholConsumption: str = Field(..., description="Alcohol consumption: None, Occasional, Frequent, or Heavy")
    dietQuality: str = Field(..., description="Diet quality: Poor, Average, or Good")
    stressLevel: str = Field(..., description="Stress level: Low, Moderate, or High")
    familyHistory: bool = Field(..., description="Family history of hypertension")
    saltIntake: str = Field(..., description="Salt intake: Low, Moderate, or High")
    sleepHours: float = Field(..., ge=3, le=12, description="Average sleep hours per night (3-12)")
    caffeineIntake: str = Field(..., description="Caffeine intake: None, Occasional, Moderate, or Heavy")


class PredictionOutput(BaseModel):
    """Output schema for hypertension prediction."""

    riskProbability: float = Field(..., description="Predicted probability of hypertension (0-100)")
    riskLevel: str = Field(..., description="Risk level: Low, Moderate, or High")


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    model_loaded: bool
