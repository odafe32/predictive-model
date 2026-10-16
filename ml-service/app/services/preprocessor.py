"""Data preprocessing pipeline for hypertension prediction."""

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OrdinalEncoder, StandardScaler


# Column definitions
NUMERIC_FEATURES = ["age", "bmi", "sleepHours"]
CATEGORICAL_FEATURES = [
    "physicalActivity",
    "smokingStatus",
    "alcoholConsumption",
    "dietQuality",
    "stressLevel",
    "saltIntake",
    "caffeineIntake",
]
BOOLEAN_FEATURES = ["familyHistory"]

# Order matters for ordinal encoding (risk increases left to right)
CATEGORY_ORDERS = {
    "physicalActivity": ["Low", "Moderate", "High"],          # Low = highest risk
    "smokingStatus": ["Never", "Former", "Current"],
    "alcoholConsumption": ["None", "Occasional", "Frequent", "Heavy"],
    "dietQuality": ["Poor", "Average", "Good"],
    "stressLevel": ["Low", "Moderate", "High"],
    "saltIntake": ["Low", "Moderate", "High"],
    "caffeineIntake": ["None", "Occasional", "Moderate", "Heavy"],
}

ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES + BOOLEAN_FEATURES


def build_preprocessor():
    """Build the preprocessing pipeline (ColumnTransformer).

    - Numeric features: StandardScaler
    - Categorical features: OrdinalEncoder with defined order
    - Boolean features: passed through as-is (0/1)
    """
    transformers = [
        ("numeric", StandardScaler(), NUMERIC_FEATURES),
        (
            "categorical",
            OrdinalEncoder(
                categories=[CATEGORY_ORDERS[f] for f in CATEGORICAL_FEATURES],
                handle_unknown="use_encoded_value",
                unknown_value=-1,
            ),
            CATEGORICAL_FEATURES,
        ),
        ("boolean", "passthrough", BOOLEAN_FEATURES),
    ]

    return ColumnTransformer(transformers=transformers, remainder="drop")


def prepare_dataframe(data: dict) -> pd.DataFrame:
    """Convert a single prediction input dict to a DataFrame row."""
    df = pd.DataFrame([data])
    # Ensure boolean is int
    df["familyHistory"] = df["familyHistory"].astype(int)
    return df[ALL_FEATURES]
