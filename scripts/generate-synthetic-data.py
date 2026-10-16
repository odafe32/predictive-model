"""
Synthetic Data Generator for Hypertension Risk Prediction
Generates a realistic Nigerian-adult lifestyle dataset (~5,000 rows)
with rule-based hypertension labels derived from weighted risk factors.
"""

import numpy as np
import pandas as pd
import os
import sys


def generate_synthetic_data(n_samples=5000, random_state=42):
    """Generate synthetic Nigerian-adult lifestyle data."""
    rng = np.random.RandomState(random_state)

    # --- Age (18-90, skewed toward 25-60) ---
    age = np.clip(rng.normal(45, 15, n_samples), 18, 90).astype(int)

    # --- BMI (15-45, centered around 25) ---
    bmi = np.clip(rng.normal(26, 5, n_samples), 15, 45).round(2)

    # --- Physical Activity ---
    physical_activity = rng.choice(
        ["Low", "Moderate", "High"],
        n_samples,
        p=[0.40, 0.45, 0.15],
    )

    # --- Smoking Status ---
    smoking_status = rng.choice(
        ["Never", "Former", "Current"],
        n_samples,
        p=[0.65, 0.20, 0.15],
    )

    # --- Alcohol Consumption ---
    alcohol_consumption = rng.choice(
        ["None", "Occasional", "Frequent", "Heavy"],
        n_samples,
        p=[0.35, 0.40, 0.15, 0.10],
    )

    # --- Diet Quality ---
    diet_quality = rng.choice(
        ["Poor", "Average", "Good"],
        n_samples,
        p=[0.30, 0.45, 0.25],
    )

    # --- Stress Level ---
    stress_level = rng.choice(
        ["Low", "Moderate", "High"],
        n_samples,
        p=[0.30, 0.50, 0.20],
    )

    # --- Family History ---
    family_history = rng.choice([True, False], n_samples, p=[0.35, 0.65])

    # --- Salt Intake ---
    salt_intake = rng.choice(
        ["Low", "Moderate", "High"],
        n_samples,
        p=[0.25, 0.45, 0.30],
    )

    # --- Sleep Hours (3-12, centered around 6.5) ---
    sleep_hours = np.clip(rng.normal(6.5, 1.5, n_samples), 3, 12).round(1)

    # --- Caffeine Intake ---
    caffeine_intake = rng.choice(
        ["None", "Occasional", "Moderate", "Heavy"],
        n_samples,
        p=[0.20, 0.35, 0.30, 0.15],
    )

    # --- Compute risk score (rule-based) ---
    risk_score = np.zeros(n_samples)

    # Age contribution (older = higher risk)
    risk_score += np.where(age > 60, 0.25, np.where(age > 45, 0.15, np.where(age > 30, 0.05, 0)))

    # BMI contribution (overweight/obese = higher risk)
    risk_score += np.where(bmi > 30, 0.20, np.where(bmi > 25, 0.10, 0))

    # Physical activity (Low = higher risk)
    risk_score += np.where(physical_activity == "Low", 0.15, np.where(physical_activity == "Moderate", 0.05, 0))

    # Smoking (Current = highest risk, Former = moderate)
    risk_score += np.where(smoking_status == "Current", 0.15, np.where(smoking_status == "Former", 0.07, 0))

    # Alcohol (Heavy = highest, Frequent = moderate)
    risk_score += np.where(alcohol_consumption == "Heavy", 0.15,
                           np.where(alcohol_consumption == "Frequent", 0.10,
                                    np.where(alcohol_consumption == "Occasional", 0.03, 0)))

    # Diet (Poor = higher risk)
    risk_score += np.where(diet_quality == "Poor", 0.12, np.where(diet_quality == "Average", 0.05, 0))

    # Stress (High = higher risk)
    risk_score += np.where(stress_level == "High", 0.15, np.where(stress_level == "Moderate", 0.07, 0))

    # Family history
    risk_score += np.where(family_history, 0.15, 0)

    # Salt intake (High = higher risk)
    risk_score += np.where(salt_intake == "High", 0.15, np.where(salt_intake == "Moderate", 0.07, 0))

    # Sleep hours (too little or too much = higher risk)
    risk_score += np.where(sleep_hours < 5, 0.12, np.where(sleep_hours > 9, 0.08, 0))

    # Caffeine (Heavy = higher risk)
    risk_score += np.where(caffeine_intake == "Heavy", 0.10,
                           np.where(caffeine_intake == "Moderate", 0.05,
                                    np.where(caffeine_intake == "Occasional", 0.02, 0)))

    # Add noise (larger to make the problem harder and probabilities more calibrated)
    risk_score += rng.normal(0, 0.15, n_samples)

    # Convert to binary label (threshold at 0.70 for ~40-50% positive rate)
    hypertension = (risk_score > 0.70).astype(int)

    # Build DataFrame
    df = pd.DataFrame({
        "age": age,
        "bmi": bmi,
        "physicalActivity": physical_activity,
        "smokingStatus": smoking_status,
        "alcoholConsumption": alcohol_consumption,
        "dietQuality": diet_quality,
        "stressLevel": stress_level,
        "familyHistory": family_history,
        "saltIntake": salt_intake,
        "sleepHours": sleep_hours,
        "caffeineIntake": caffeine_intake,
        "hypertension": hypertension,
    })

    return df


def main():
    print("Generating synthetic Nigerian-adult lifestyle dataset...")
    df = generate_synthetic_data(n_samples=5000, random_state=42)

    # Print stats
    print(f"\nDataset shape: {df.shape}")
    print(f"\nHypertension distribution:")
    print(df["hypertension"].value_counts())
    print(f"  Positive rate: {df['hypertension'].mean() * 100:.1f}%")
    print(f"\nFeature summary:")
    print(df.describe())

    # Save
    output_dir = os.path.join(os.path.dirname(__file__), "..", "ml-service", "data", "raw")
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "hypertension_lifestyle.csv")
    df.to_csv(output_path, index=False)
    print(f"\nSaved to: {output_path}")
    print(f"Total rows: {len(df)}")


if __name__ == "__main__":
    main()
