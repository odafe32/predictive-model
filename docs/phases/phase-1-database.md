# Phase 1 — Project Setup & Database

**Goal:** Next.js app, Prisma schema, MySQL connection, seed data.

**Status:** Not started

---

## Tasks

### 1.1 Scaffold Next.js app
- [x] Run `create-next-app` with TypeScript + App Router
- [x] Verify `npm run dev` works at http://localhost:3000

### 1.2 Install dependencies
- [ ] Runtime: `npm install @prisma/client bcryptjs jose zod zustand bootstrap react-bootstrap react-hook-form axios swr react-bootstrap-icons recharts`
- [ ] Dev: `npm install -D prisma tsx @types/bcryptjs @types/node`
- [ ] Verify with `npm list --depth=0`

### 1.3 Configure environment
- [ ] Edit `.env`:
  ```
  DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/hypertension_db"
  JWT_SECRET="generate-a-long-random-string"
  ML_SERVICE_URL="http://localhost:8000"
  NEXTAUTH_URL="http://localhost:3000"
  ```
- [ ] Create `.env.example` with the same keys but fake values (safe to commit)

### 1.4 Initialize Prisma
- [ ] Run `npx prisma init`
- [ ] Edit `prisma/schema.prisma` — set `provider = "mysql"`
- [ ] Write the 5 models (see schema below)

### 1.5 Create MySQL database
- [ ] Start MySQL server
- [ ] Run: `mysql -u root -p -e "CREATE DATABASE hypertension_db;"`

### 1.6 Run migration
- [ ] `npx prisma migrate dev --name init`
- [ ] Verify tables created: `npx prisma studio`

### 1.7 Write seed script
- [ ] Create `prisma/seed.ts`
- [ ] Seed default admin: username `admin`, password `admin123` (bcrypt hashed)
- [ ] Seed 3 sample users with fake lifestyle data
- [ ] Add `"prisma:seed": "tsx prisma/seed.ts"` to package.json scripts
- [ ] Run `npm run prisma:seed`

---

## Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id           Int         @id @default(autoincrement())
  fullName     String      @map("full_name") @db.VarChar(150)
  email        String      @unique @db.VarChar(150)
  passwordHash String      @map("password_hash") @db.VarChar(255)
  gender       String      @db.VarChar(10)
  createdAt    DateTime    @default(now()) @map("created_at")

  lifestyleData    LifestyleData[]
  predictionResults PredictionResult[]
  systemLogs       SystemLog[]

  @@map("users")
}

model LifestyleData {
  id                  Int      @id @default(autoincrement())
  userId              Int      @map("user_id")
  age                 Int
  bmi                 Float    @db.Decimal(5, 2)
  physicalActivity    String   @map("physical_activity") @db.VarChar(50)
  smokingStatus       String   @map("smoking_status") @db.VarChar(30)
  alcoholConsumption  String   @map("alcohol_consumption") @db.VarChar(30)
  dietQuality         String   @map("diet_quality") @db.VarChar(50)
  stressLevel         String   @map("stress_level") @db.VarChar(30)
  familyHistory       Boolean  @map("family_history")
  createdAt           DateTime @default(now()) @map("created_at")

  user              User              @relation(fields: [userId], references: [id])
  predictionResult  PredictionResult?

  @@map("lifestyle_data")
}

model PredictionResult {
  id              Int      @id @default(autoincrement())
  userId          Int      @map("user_id")
  lifestyleId     Int      @unique @map("lifestyle_id")
  riskProbability Float    @map("risk_probability") @db.Decimal(5, 2)
  riskLevel       String   @map("risk_level") @db.VarChar(20)
  predictionDate  DateTime @default(now()) @map("prediction_date")

  user         User          @relation(fields: [userId], references: [id])
  lifestyleData LifestyleData @relation(fields: [lifestyleId], references: [id])

  @@map("prediction_results")
}

model Administrator {
  id           Int      @id @default(autoincrement())
  username     String   @unique @db.VarChar(100)
  passwordHash String   @map("password_hash") @db.VarChar(255)
  role         String   @default("Administrator") @db.VarChar(50)
  createdAt    DateTime @default(now()) @map("created_at")

  @@map("administrators")
}

model SystemLog {
  id       Int      @id @default(autoincrement())
  userId   Int?     @map("user_id")
  activity String   @db.VarChar(255)
  status   String   @db.VarChar(30)
  logTime  DateTime @default(now()) @map("log_time")

  user User? @relation(fields: [userId], references: [id])

  @@map("system_logs")
}
```

---

## Deliverable

- Working MySQL database `hypertension_db` with 5 tables
- Default admin seeded (`admin` / `admin123`)
- 3 sample users seeded
- Prisma Studio can view all tables
- `.env` configured and `.env.example` committed

---

## Next Phase

→ [Phase 2 — Authentication](phase-2-authentication.md)
