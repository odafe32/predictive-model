# Predictive Model for Hypertension Risk among Nigerian Adults Using Lifestyle Data

A machine learning–based web application that estimates an individual's risk of developing hypertension from readily obtainable lifestyle and demographic data. Built as a BSc Computer Science project by **Joseph Suel Godfrey**, Nasarawa State University, Keffi.

---

## 1. Overview

The system lets a user register, enter lifestyle/demographic information, and receive an instant hypertension risk classification (**Low / Moderate / High**) with a probability score and personalized health recommendations. An administrator manages users, monitors all predictions, and reviews system logs.

- **Frontend / Backend:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Database:** PostgreSQL (Neon serverless) via Prisma 5.22 ORM
- **ML Service:** Python + FastAPI + scikit-learn (separate microservice)
- **UI styling:** Bootstrap 5.3 + custom CSS animations
- **Charts:** Recharts
- **Auth:** JWT (jose) in httpOnly cookies, bcryptjs password hashing
- **Validation:** Zod (frontend + API), Pydantic (ML service)

---

## 2. Project Structure

```text
predictive-model/
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── middleware.ts                    # Route protection (JWT + role checks)
├── prisma/
│   ├── schema.prisma                # Prisma schema (5 tables)
│   ├── seed.ts                      # Admin + sample user seeding
│   └── migrations/
├── scripts/
│   └── generate-synthetic-data.py   # Builds Nigerian-adult lifestyle dataset
├── app/
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   ├── globals.css                  # Custom styles + animations
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Authenticated user shell
│   │   ├── dashboard/page.tsx       # User dashboard with stats
│   │   ├── dashboard/predict/page.tsx  # Prediction form + result
│   │   ├── dashboard/history/page.tsx # Prediction history
│   │   └── dashboard/profile/page.tsx  # Profile editing
│   ├── admin/
│   │   ├── layout.tsx               # Admin shell (role-protected)
│   │   ├── page.tsx                 # Admin dashboard with charts
│   │   ├── users/page.tsx           # User management
│   │   ├── predictions/page.tsx     # All predictions across users
│   │   └── logs/page.tsx            # System logs
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── predict/route.ts         # Calls ML service, stores result
│       ├── history/route.ts         # User's prediction history
│       ├── profile/route.ts         # Profile view/update
│       └── admin/
│           ├── stats/route.ts       # Admin dashboard stats
│           ├── users/route.ts       # User management API
│           ├── predictions/route.ts # All predictions API
│           └── logs/route.ts        # System logs API
├── components/
│   ├── forms/
│   │   ├── AuthForm.tsx
│   │   ├── PredictionForm.tsx
│   │   └── PredictionResult.tsx
│   ├── layout/
│   │   ├── Navbar.tsx               # Role-aware navbar with dropdown
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── LoadingButton.tsx
│       ├── Spinner.tsx
│       ├── Skeleton.tsx
│       └── Toast.tsx
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── auth.ts                      # JWT sign/verify, session
│   ├── password.ts                  # bcrypt hash/compare
│   ├── ml-client.ts                 # ML service client + recommendations
│   └── validators.ts                # Zod schemas
├── hooks/
│   └── useAuth.ts
├── stores/
│   └── authStore.ts                 # Zustand store
└── ml-service/                      # Python FastAPI ML microservice
    ├── requirements.txt
    ├── pyproject.toml
    ├── app/
    │   ├── main.py                  # FastAPI entrypoint
    │   ├── core/config.py           # Settings
    │   ├── api/
    │   │   ├── predict.py            # POST /predict
    │   │   └── health.py             # GET /health
    │   ├── models/schemas.py         # Pydantic models
    │   └── services/
    │       ├── preprocessor.py       # Encoding + scaling pipeline
    │       ├── trainer.py            # Model training + evaluation
    │       └── predictor.py          # Loads model, returns prediction
    ├── data/raw/hypertension_lifestyle.csv
    ├── tests/test_predict.py
    └── artifacts/hypertension_model.pkl
```

---

## 3. Database Schema (Prisma)

Implemented in `prisma/schema.prisma` against PostgreSQL.

| Table | Purpose | Key Fields |
|---|---|---|
| `User` | Registered users + admins | `id`, `fullName`, `email`, `passwordHash`, `gender`, `role`, `createdAt` |
| `LifestyleData` | Submitted lifestyle input | `id`, `userId`, `age`, `bmi`, `physicalActivity`, `smokingStatus`, `alcoholConsumption`, `dietQuality`, `stressLevel`, `familyHistory`, `saltIntake`, `sleepHours`, `caffeineIntake`, `createdAt` |
| `PredictionResult` | Prediction outcomes | `id`, `userId`, `lifestyleId`, `riskProbability`, `riskLevel`, `predictionDate` |
| `SystemLog` | Activity audit trail | `id`, `userId`, `activity`, `status`, `logTime` |

**Authentication design:** All accounts (users and admins) are stored in the `User` table. The `role` field distinguishes `"User"` from `"Admin"`. Both use the same login form. Admins redirect to `/admin`, regular users to `/dashboard`.

Relationships: `User 1—N LifestyleData`, `User 1—N PredictionResult`, `LifestyleData 1—1 PredictionResult`, `User 1—N SystemLog`.

---

## 4. Machine Learning Model

### 4.1 Features (input)

| Feature | Type | Example values |
|---|---|---|
| `age` | int | 18–90 |
| `bmi` | float | 10–60 |
| `physicalActivity` | categorical | Low / Moderate / High |
| `smokingStatus` | categorical | Never / Former / Current |
| `alcoholConsumption` | categorical | None / Occasional / Frequent / Heavy |
| `dietQuality` | categorical | Poor / Average / Good |
| `stressLevel` | categorical | Low / Moderate / High |
| `familyHistory` | boolean | true / false |
| `saltIntake` | categorical | Low / Moderate / High |
| `sleepHours` | float | 3–12 |
| `caffeineIntake` | categorical | None / Occasional / Moderate / Heavy |

### 4.2 Target

`hypertension` — binary (0 = no, 1 = yes) used during training; mapped to **Low / Moderate / High** at serving time using probability thresholds (`< 33%` Low, `33–66%` Moderate, `> 66%` High).

### 4.3 Algorithm

Five candidate models are compared during training:

- Logistic Regression
- Decision Tree
- Random Forest
- Support Vector Machine (SVM)
- Multi-layer Perceptron (Neural Network)

The best model is selected by F1 score. The trained model plus its preprocessing pipeline (OrdinalEncoder + StandardScaler) are serialized with `joblib` to `ml-service/artifacts/hypertension_model.pkl`.

**Current model:** SVM — F1: 0.7254, ROC-AUC: 0.8615, Accuracy: 0.782

### 4.4 Synthetic data

`scripts/generate-synthetic-data.py` generates a Nigerian-adult lifestyle dataset (5,000 rows) with realistic distributions and a rule-based hypertension label derived from weighted risk contributions of each feature. Output: `ml-service/data/raw/hypertension_lifestyle.csv`.

---

## 5. ML Service API (FastAPI)

Running separately on `http://localhost:8000`.

| Method | Path | Body | Returns |
|---|---|---|---|
| `GET` | `/health` | — | `{ "status": "ok", "model_loaded": true }` |
| `POST` | `/predict` | Lifestyle data (11 fields) | `{ "riskProbability": 56.0, "riskLevel": "Moderate" }` |

The Next.js API route `app/api/predict/route.ts` authenticates the user, validates input with Zod, forwards to the ML service, persists the lifestyle row + prediction to PostgreSQL via Prisma, logs to SystemLog, and returns the result + recommendations to the frontend.

---

## 6. Demo Credentials

**Regular user:**
```
Email: john@example.com
Password: password123
```

**Admin:**
```
Email: admin@healthpredict.com
Password: admin123
```

These are seeded by `prisma/seed.ts` and displayed on the login page.

---

## 7. Environment Variables

`.env` (do NOT commit this file — see `.env.example`):

```env
# Next.js
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="change-this-to-a-long-random-string"
ML_SERVICE_URL="http://localhost:8000"

# Python ML service
MODEL_PATH="artifacts/hypertension_model.pkl"
CORS_ORIGINS="http://localhost:3000"
```

---

## 8. Build & Run Steps

### 8.1 One-time setup

```bash
# 1. Install Node deps
npm install

# 2. Configure .env (copy .env.example and fill in your DATABASE_URL + JWT_SECRET)

# 3. Run Prisma migration + seed
npx prisma migrate dev --name init
npx prisma generate
npx tsx prisma/seed.ts

# 4. Python ML service
cd ml-service
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate      # macOS/Linux
pip install -r requirements.txt

# 5. Generate synthetic dataset
python ../scripts/generate-synthetic-data.py

# 6. Train model (writes artifacts/hypertension_model.pkl)
python -m app.services.trainer
```

### 8.2 Daily run

```bash
# Terminal 1 — ML service
cd ml-service
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 — Next.js app
npm run dev
```

Open <http://localhost:3000>.

### 8.3 Verification commands

```bash
# TypeScript check
npx tsc --noEmit

# Lint
npm run lint

# ML service tests
cd ml-service
.venv\Scripts\python.exe -m pytest tests/ -v
```

---

## 9. Features

### User Features
- Register and login with validation
- Take hypertension risk assessment (11 lifestyle inputs)
- View risk level, probability, and personalized recommendations
- View prediction history with filters and detail modal
- Edit profile (name, gender, change password)

### Admin Features
- Admin dashboard with stats cards and charts (risk distribution, gender split, daily predictions)
- User management (view, search, delete with confirmation modal)
- View all predictions across all users with filters and search
- View system logs with status filters

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Loading states (skeletons, spinners, loading buttons)
- Toast notifications on all forms
- Form validation (inline errors, field-level)
- Animations (fade-in, scale-in, heartbeat, hover effects)
- Role-aware navbar with profile dropdown
- Password visibility toggle on auth forms

### Security
- JWT in httpOnly cookies
- bcrypt password hashing
- Zod input validation on all API routes
- Pydantic validation on ML service
- Middleware route protection (auth + role checks)
- Admin layout client-side role verification
- Failed login attempt logging

---

## 10. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Bootstrap 5.3, Bootstrap Icons (CDN), custom CSS |
| Charts | Recharts |
| State | Zustand, React hooks |
| Forms | React Hook Form, Zod |
| Database | PostgreSQL (Neon), Prisma 5.22 |
| Auth | jose (JWT), bcryptjs |
| ML Service | Python, FastAPI, scikit-learn, pandas, NumPy |
| Model | SVM (serialized with joblib) |

---

## 11. Key Implementation Notes

- **Single login form:** Both users and admins authenticate through `/login`. The `role` field in the JWT determines redirect destination (`/dashboard` for users, `/admin` for admins).
- **Route protection:** Three layers — middleware (JWT + role), layout components (client-side role check), and API routes (session + role verification).
- **Prediction flow:** Form → `POST /api/predict` → Zod validation → `ml-client.ts` calls FastAPI `/predict` → result saved via Prisma → returned to UI with recommendations.
- **Model retraining:** Re-run `python -m app.services.trainer` after replacing the dataset; the `.pkl` is overwritten and the ML service picks it up on restart.
- **Logging:** Every auth event and prediction writes a row to `SystemLog` with `status` Success/Failed.

---

## 12. Scope

**Included:** Lifestyle-based risk prediction for Nigerian adults, web UI, admin panel, model training/evaluation, personalized recommendations, prediction history, profile management.

**Excluded:** Clinical diagnosis, real-time monitoring, hospital EMR integration, wearable device sync, lab/ECG/genetic inputs.

---

## 13. Author

**Joseph Suel Godfrey**  
BSc Computer Science Project  
Nasarawa State University, Keffi

---

## 14. References

See Chapter Three of the thesis document for the full reference list (WHO 2023; Adeloye et al. 2021; Mills et al. 2020; Krittanawong et al. 2020; Topol 2019; Pedregosa et al. 2011; etc.).
