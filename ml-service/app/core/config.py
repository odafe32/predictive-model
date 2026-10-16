"""Application configuration loaded from environment variables."""

import os


class Settings:
    """Settings for the ML service."""

    # Model artifact path
    MODEL_PATH: str = os.getenv("MODEL_PATH", "artifacts/hypertension_model.pkl")

    # CORS origins (comma-separated)
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")

    # Data paths
    DATA_RAW: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "raw")
    DATA_PROCESSED: str = os.path.join(os.path.dirname(__file__), "..", "..", "data", "processed")
    ARTIFACTS: str = os.path.join(os.path.dirname(__file__), "..", "..", "artifacts")

    # Risk thresholds
    RISK_LOW: float = 0.33
    RISK_MODERATE: float = 0.66

    @property
    def cors_origins_list(self):
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
