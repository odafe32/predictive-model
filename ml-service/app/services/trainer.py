"""Model training and evaluation.

Trains 5 models on the hypertension dataset, compares them by ROC-AUC,
and saves the best model + preprocessor as a single .pkl artifact.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
)

# Add parent dirs to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.services.preprocessor import build_preprocessor, ALL_FEATURES
from app.core.config import settings


def load_data():
    """Load the raw dataset and return X, y."""
    data_path = os.path.join(settings.DATA_RAW, "hypertension_lifestyle.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError(
            f"Dataset not found at {data_path}. "
            "Run: python scripts/generate-synthetic-data.py first."
        )

    df = pd.read_csv(data_path)
    print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

    X = df[ALL_FEATURES].copy()
    X["familyHistory"] = X["familyHistory"].astype(int)
    y = df["hypertension"].values

    return X, y


def train_and_evaluate():
    """Train all 5 models, evaluate, and save the best one."""
    X, y = load_data()

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Fit preprocessor on training data
    preprocessor = build_preprocessor()
    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    # Define models
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(max_depth=10, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "SVM": SVC(probability=True, random_state=42),
        "Neural Network": MLPClassifier(
            hidden_layer_sizes=(64, 32),
            max_iter=500,
            random_state=42,
        ),
    }

    # Train and evaluate each model
    results = []
    trained_models = {}

    print("\n" + "=" * 80)
    print(f"{'Model':<25} {'Accuracy':<12} {'Precision':<12} {'Recall':<12} {'F1':<12} {'ROC-AUC':<12}")
    print("=" * 80)

    for name, model in models.items():
        print(f"Training {name}...", end=" ")
        model.fit(X_train_processed, y_train)
        trained_models[name] = model

        y_pred = model.predict(X_test_processed)
        y_proba = model.predict_proba(X_test_processed)[:, 1]

        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, zero_division=0)
        recall = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        roc_auc = roc_auc_score(y_test, y_proba)

        results.append({
            "model": name,
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "roc_auc": roc_auc,
        })

        print(f"Done - ROC-AUC: {roc_auc:.4f}")
        print(
            f"{'':<25} {accuracy:<12.4f} {precision:<12.4f} {recall:<12.4f} {f1:<12.4f} {roc_auc:<12.4f}"
        )

    print("=" * 80)

    # Find best model by F1 score (more balanced than ROC-AUC for calibration)
    results_df = pd.DataFrame(results)
    best_idx = results_df["f1"].idxmax()
    best_name = results_df.iloc[best_idx]["model"]
    best_model = trained_models[best_name]

    print(f"\nBest model: {best_name} (F1: {results_df.iloc[best_idx]['f1']:.4f}, ROC-AUC: {results_df.iloc[best_idx]['roc_auc']:.4f})")
    print("\nFull results:")
    print(results_df.to_string(index=False))

    # Detailed report for best model
    y_pred_best = best_model.predict(X_test_processed)
    print(f"\nClassification report for {best_name}:")
    print(classification_report(y_test, y_pred_best, target_names=["No Hypertension", "Hypertension"]))

    # Save the artifact (preprocessor + best model bundled)
    os.makedirs(settings.ARTIFACTS, exist_ok=True)
    model_path = os.path.join(settings.ARTIFACTS, "hypertension_model.pkl")

    artifact = {
        "preprocessor": preprocessor,
        "model": best_model,
        "model_name": best_name,
        "feature_order": ALL_FEATURES,
        "metrics": results_df.to_dict(orient="records"),
    }

    joblib.dump(artifact, model_path)
    print(f"\nModel artifact saved to: {model_path}")
    print(f"Bundle: preprocessor + {best_name}")

    return best_model, results_df


if __name__ == "__main__":
    train_and_evaluate()
