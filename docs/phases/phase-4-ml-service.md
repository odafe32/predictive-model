# Phase 4 — Python ML Service

**Goal:** FastAPI microservice that trains a hypertension prediction model and serves predictions.

**Status:** Not started

---

## Tasks

### 4.1 Directory structure
- [ ] Create `ml-service/` with subfolders (see README Section 2)
- [ ] Write `ml-service/requirements.txt`

### 4.2 Virtual environment
- [ ] `cd ml-service`
- [ ] `python -m venv .venv`
- [ ] `.venv\Scripts\activate` (Windows)
- [ ] `pip install -r requirements.txt`

### 4.3 Synthetic data generator
- [ ] Write `scripts/generate-synthetic-data.py`
  - Generate ~5,000 rows of Nigerian-adult lifestyle data
  - Columns: age (18–90), bmi (15–45), physicalActivity, smokingStatus, alcoholConsumption, dietQuality, stressLevel, familyHistory, hypertension (0/1)
  - Use numpy random with realistic distributions
  - Hypertension label = weighted sum of risk factors (age +BMI + smoking + alcohol + stress + family history + low activity + poor diet) + noise
  - Output: `ml-service/data/raw/hypertension_lifestyle.csv`
- [ ] Run it, verify CSV has ~5,000 rows

### 4.4 Config & schemas
- [ ] `ml-service/app/core/config.py` — Pydantic BaseSettings: `MODEL_PATH`, `CORS_ORIGINS`
- [ ] `ml-service/app/models/schemas.py` — Pydantic models:
  - `LifestyleInput` (8 fields matching the form)
  - `PredictionOutput` (riskProbability: float, riskLevel: str)

### 4.5 Preprocessor
- [ ] `ml-service/app/services/preprocessor.py`
  - Build a `Pipeline` with:
    - `OrdinalEncoder` for categorical columns (physicalActivity, smokingStatus, alcoholConsumption, dietQuality, stressLevel)
    - `StandardScaler` for numeric columns (age, bmi)
    - `familyHistory` passed through as 0/1
  - Returns fitted pipeline + column order

### 4.6 Trainer
- [ ] `ml-service/app/services/trainer.py`
  - Load CSV from `data/raw/hypertension_lifestyle.csv`
  - Split into X (features) and y (hypertension)
  - Train/test split (80/20, stratify=y)
  - Fit preprocessor on training data
  - Train 5 models:
    1. LogisticRegression
    2. DecisionTreeClassifier
    3. RandomForestClassifier
    4. SVC (probability=True)
    5. MLPClassifier
  - Evaluate each: accuracy, precision, recall, f1, roc_auc
  - Print comparison table
  - Pick best by ROC-AUC
  - Bundle (preprocessor + best model) into a single `Pipeline` or dict
  - Save with joblib to `artifacts/hypertension_model.pkl`
  - Print summary: which model won, its metrics
- [ ] Run `python app/services/trainer.py`
- [ ] Verify `artifacts/hypertension_model.pkl` exists

### 4.7 Predictor
- [ ] `ml-service/app/services/predictor.py`
  - `ModelService` class:
    - `__init__` loads `.pkl` with joblib
    - `predict(input: LifestyleInput) -> PredictionOutput`
    - Transform input through preprocessor
    - Call `model.predict_proba` → get probability of class 1
    - Map probability to risk level:
      - `< 0.33` → "Low"
      - `0.33–0.66` → "Moderate"
      - `> 0.66` → "High"
    - Return `{ riskProbability, riskLevel }`

### 4.8 API endpoints
- [ ] `ml-service/app/api/health.py` — `GET /health` → `{ "status": "ok" }`
- [ ] `ml-service/app/api/predict.py` — `POST /predict`
  - Accept `LifestyleInput` JSON body
  - Call `ModelService.predict`
  - Return `PredictionOutput`
- [ ] `ml-service/app/main.py`
  - Create FastAPI app
  - Add CORS middleware (origins from config)
  - Include routers (health, predict)
  - Load model on startup

### 4.9 Test
- [ ] `ml-service/tests/test_predict.py` — pytest:
  - Test `/health` returns 200
  - Test `/predict` with valid input returns probability + level
  - Test `/predict` rejects invalid input
- [ ] Start: `uvicorn app.main:app --reload --port 8000`
- [ ] Manual test with curl:
  ```bash
  curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"age\":45,\"bmi\":30,\"physicalActivity\":\"Low\",\"smokingStatus\":\"Current\",\"alcoholConsumption\":\"Heavy\",\"dietQuality\":\"Poor\",\"stressLevel\":\"High\",\"familyHistory\":true}"
  ```

---

## File Tree (new files)

```
ml-service/
├── requirements.txt
├── README.md
├── app/
│   ├── main.py
│   ├── core/
│   │   └── config.py
│   ├── api/
│   │   ├── predict.py
│   │   └── health.py
│   ├── models/
│   │   └── schemas.py
│   └── services/
│       ├── preprocessor.py
│       ├── trainer.py
│       └── predictor.py
├── data/
│   └── raw/
│       └── hypertension_lifestyle.csv (generated)
├── tests/
│   └── test_predict.py
└── artifacts/
    └── hypertension_model.pkl (generated)
scripts/
└── generate-synthetic-data.py
```

---

## Deliverable

- ML service running on http://localhost:8000
- `GET /health` returns 200
- `POST /predict` returns `{ riskProbability, riskLevel }` for any valid input
- Trained model saved as `.pkl`
- 5 models compared, best selected by ROC-AUC

---

## Next Phase

→ [Phase 5 — Prediction Feature](phase-5-prediction.md)
