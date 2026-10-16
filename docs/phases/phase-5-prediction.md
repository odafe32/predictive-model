# Phase 5 — Prediction Feature

**Goal:** User fills lifestyle form, gets prediction with risk score + recommendations.

**Status:** Not started

---

## Tasks

### 5.1 Config & types
- [ ] `config/constants.ts`
  - `RISK_THRESHOLDS = { low: 0.33, moderate: 0.66 }`
  - `FEATURE_OPTIONS` — dropdown values for each categorical field:
    - physicalActivity: ["Low", "Moderate", "High"]
    - smokingStatus: ["Never", "Former", "Current"]
    - alcoholConsumption: ["None", "Occasional", "Frequent", "Heavy"]
    - dietQuality: ["Poor", "Average", "Good"]
    - stressLevel: ["Low", "Moderate", "High"]
- [ ] `types/lifestyle.ts` — `LifestyleInput` interface
- [ ] `types/prediction.ts` — `PredictionResult` interface

### 5.2 ML client
- [ ] `lib/ml-client.ts`
  - `predictLifestyle(input: LifestyleInput): Promise<PredictionOutput>`
  - POST to `${ML_SERVICE_URL}/predict`
  - Return `{ riskProbability, riskLevel }`
  - Throw on error

### 5.3 Recommendations
- [ ] `lib/recommendations.ts`
  - `getRecommendations(riskLevel: string): string[]`
  - Low → ["Maintain healthy lifestyle", "Exercise regularly", ...]
  - Moderate → ["Reduce salt intake", "Increase physical activity", ...]
  - High → ["Consult a healthcare provider", "Monitor blood pressure regularly", ...]

### 5.4 API route
- [ ] `app/api/predict/route.ts`
  - POST handler
  - Auth required (read JWT, get userId)
  - Validate body with zod
  - Call `ml-client.predictLifestyle`
  - Save `LifestyleData` row via Prisma
  - Save `PredictionResult` row via Prisma (link to lifestyleId)
  - Log to `SystemLog` (activity: "prediction", status: "Success")
  - Return `{ riskProbability, riskLevel, recommendations }`

### 5.5 Lifestyle form
- [ ] `components/forms/LifestyleForm.tsx`
  - react-hook-form with 8 fields:
    - age (number input, 18–90)
    - bmi (number input, 15–45)
    - physicalActivity (select)
    - smokingStatus (select)
    - alcoholConsumption (select)
    - dietQuality (select)
    - stressLevel (select)
    - familyHistory (checkbox)
  - Validation: all required, numeric ranges
  - Submit → POST `/api/predict`
  - Show loading state
  - On success → pass result to parent

### 5.6 Risk gauge
- [ ] `components/charts/RiskGauge.tsx`
  - recharts RadialBarChart or custom gauge
  - Shows probability 0–100%
  - Color: green (Low), yellow (Moderate), red (High)

### 5.7 Predict page
- [ ] `app/(dashboard)/predict/page.tsx`
  - Two-column layout:
    - Left: `LifestyleForm`
    - Right: Result card (appears after prediction)
      - Risk level badge (color-coded)
      - `RiskGauge` showing probability
      - Recommendations list
  - "Take Another Assessment" button after result

### 5.8 Hook
- [ ] `hooks/usePredict.ts`
  - SWR mutation or simple fetch wrapper
  - `trigger(input)` → POST `/api/predict` → return result
  - Loading + error state

---

## File Tree (new files)

```
config/
└── constants.ts
types/
├── lifestyle.ts
└── prediction.ts
lib/
├── ml-client.ts
└── recommendations.ts
hooks/
└── usePredict.ts
components/
├── forms/LifestyleForm.tsx
└── charts/RiskGauge.tsx
app/
├── api/predict/route.ts
└── (dashboard)/predict/page.tsx
```

---

## Deliverable

- User fills 8-field lifestyle form
- Form validates input
- API calls ML service, stores result in DB
- UI shows risk level badge, probability gauge, recommendations
- Prediction logged to SystemLog

---

## Next Phase

→ [Phase 6 — History & Profile](phase-6-history-profile.md)
