# Hypertension Risk Prediction — ML Service

FastAPI microservice that trains a hypertension prediction model and serves predictions.

## Setup

```bash
cd ml-service
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
```

## Generate Data + Train Model

```bash
# From the project root
python scripts/generate-synthetic-data.py    # Creates data/raw/hypertension_lifestyle.csv

# From ml-service
python -m app.services.trainer               # Trains 5 models, saves best to artifacts/hypertension_model.pkl
```

## Run the Service

```bash
cd ml-service
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check |
| POST | `/predict` | Predict hypertension risk |

### Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"age":55,"bmi":32.5,"physicalActivity":"Low","smokingStatus":"Current","alcoholConsumption":"Heavy","dietQuality":"Poor","stressLevel":"High","familyHistory":true}'
```

### Example Response

```json
{
  "riskProbability": 82.5,
  "riskLevel": "High"
}
```

## Run Tests

```bash
cd ml-service
.venv\Scripts\activate
pytest tests/ -v
```
