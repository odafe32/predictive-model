-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lifestyle_data" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "bmi" DECIMAL(5,2) NOT NULL,
    "physical_activity" VARCHAR(50) NOT NULL,
    "smoking_status" VARCHAR(30) NOT NULL,
    "alcohol_consumption" VARCHAR(30) NOT NULL,
    "diet_quality" VARCHAR(50) NOT NULL,
    "stress_level" VARCHAR(30) NOT NULL,
    "family_history" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lifestyle_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prediction_results" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "lifestyle_id" INTEGER NOT NULL,
    "risk_probability" DECIMAL(5,2) NOT NULL,
    "risk_level" VARCHAR(20) NOT NULL,
    "prediction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prediction_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrators" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'Administrator',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "administrators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "activity" VARCHAR(255) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "log_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "prediction_results_lifestyle_id_key" ON "prediction_results"("lifestyle_id");

-- CreateIndex
CREATE UNIQUE INDEX "administrators_username_key" ON "administrators"("username");

-- AddForeignKey
ALTER TABLE "lifestyle_data" ADD CONSTRAINT "lifestyle_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prediction_results" ADD CONSTRAINT "prediction_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prediction_results" ADD CONSTRAINT "prediction_results_lifestyle_id_fkey" FOREIGN KEY ("lifestyle_id") REFERENCES "lifestyle_data"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
