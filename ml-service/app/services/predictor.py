"""Predictor service — loads the trained model and makes predictions."""

import os
import joblib
import pandas as pd
from app.core.config import settings
from app.models.schemas import LifestyleInput, PredictionOutput


class ModelService:
    """Loads the trained model artifact and serves predictions."""

    def __init__(self):
        self.artifact = None
        self.preprocessor = None
        self.model = None
        self.model_name = None
        self.feature_order = None
        self._loaded = False

    def load(self):
        """Load the model artifact from disk."""
        model_path = settings.MODEL_PATH
        if not os.path.isabs(model_path):
            model_path = os.path.join(settings.ARTIFACTS, "hypertension_model.pkl")

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model artifact not found at {model_path}. "
                "Run: python app/services/trainer.py first."
            )

        self.artifact = joblib.load(model_path)
        self.preprocessor = self.artifact["preprocessor"]
        self.model = self.artifact["model"]
        self.model_name = self.artifact.get("model_name", "Unknown")
        self.feature_order = self.artifact.get("feature_order", [])
        self._loaded = True
        print(f"Model loaded: {self.model_name}")

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    def predict(self, input_data: LifestyleInput) -> PredictionOutput:
        """Make a prediction from lifestyle input data."""
        if not self._loaded:
            self.load()

        # Convert input to DataFrame
        data = input_data.model_dump()
        df = pd.DataFrame([data])
        df["familyHistory"] = df["familyHistory"].astype(int)

        # Ensure correct column order
        df = df[self.feature_order]

        # Preprocess
        processed = self.preprocessor.transform(df)

        # Predict
        probability = self.model.predict_proba(processed)[0, 1]
        probability_percent = round(float(probability) * 100, 2)

        # Map to risk level
        if probability < settings.RISK_LOW:
            risk_level = "Low"
        elif probability < settings.RISK_MODERATE:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        return PredictionOutput(
            riskProbability=probability_percent,
            riskLevel=risk_level,
        )


# Singleton instance
model_service = ModelService()
