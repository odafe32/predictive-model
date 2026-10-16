/**
 * ML Service Client
 * Communicates with the Python FastAPI ML service for hypertension predictions.
 */

// Normalize: strip trailing slashes so `${URL}/predict` never becomes `//predict`
const ML_SERVICE_URL = (
  process.env.ML_SERVICE_URL || "http://localhost:8001"
).replace(/\/+$/, "");

// Render free tier sleeps after inactivity — first request can take ~60s.
const FETCH_TIMEOUT_MS = 90_000;
const RETRIES = 2;

export interface LifestyleInput {
  age: number;
  bmi: number;
  physicalActivity: string;
  smokingStatus: string;
  alcoholConsumption: string;
  dietQuality: string;
  stressLevel: string;
  familyHistory: boolean;
  saltIntake: string;
  sleepHours: number;
  caffeineIntake: string;
}

export interface PredictionResult {
  riskProbability: number;
  riskLevel: string;
}

export interface HealthCheck {
  status: string;
  model_loaded: boolean;
}

/**
 * Check if the ML service is healthy and the model is loaded.
 */
export async function checkMLHealth(): Promise<HealthCheck> {
  const res = await fetch(`${ML_SERVICE_URL}/health`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`ML service health check failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Send lifestyle data to the ML service and get a prediction.
 */
export async function getPrediction(
  input: LifestyleInput
): Promise<PredictionResult> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`ML service prediction failed: ${res.status} ${error}`);
      }

      return res.json();
    } catch (err) {
      lastError = err;
      // Retry only on network/timeout errors (Render cold start), not HTTP errors
      if (err instanceof Error && err.message.startsWith("ML service prediction failed")) {
        throw err;
      }
      if (attempt < RETRIES) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Get health recommendations based on the risk level and lifestyle data.
 */
export function getRecommendations(
  riskLevel: string,
  input: LifestyleInput
): string[] {
  const recommendations: string[] = [];

  // General recommendations based on risk level
  if (riskLevel === "Low") {
    recommendations.push(
      "Your risk is low. Maintain your healthy lifestyle to keep it that way."
    );
  } else if (riskLevel === "Moderate") {
    recommendations.push(
      "Your risk is moderate. Consider making lifestyle changes to reduce your risk."
    );
  } else {
    recommendations.push(
      "Your risk is high. Please consult a healthcare professional for a thorough check-up."
    );
  }

  // Specific recommendations based on lifestyle factors
  if (input.bmi > 30) {
    recommendations.push(
      "Your BMI is in the obese range. Aim for a healthy weight through balanced diet and regular exercise."
    );
  } else if (input.bmi > 25) {
    recommendations.push(
      "Your BMI is in the overweight range. Consider losing a few kilograms to reach a healthier weight."
    );
  }

  if (input.physicalActivity === "Low") {
    recommendations.push(
      "Increase your physical activity. Aim for at least 30 minutes of moderate exercise 5 days a week."
    );
  }

  if (input.smokingStatus === "Current") {
    recommendations.push(
      "Quitting smoking is one of the most important steps you can take to reduce your hypertension risk."
    );
  } else if (input.smokingStatus === "Former") {
    recommendations.push(
      "Great job quitting smoking! Stay smoke-free to keep your risk low."
    );
  }

  if (input.alcoholConsumption === "Heavy" || input.alcoholConsumption === "Frequent") {
    recommendations.push(
      "Reduce your alcohol consumption. Limit to no more than 1-2 drinks per day."
    );
  }

  if (input.dietQuality === "Poor") {
    recommendations.push(
      "Improve your diet. Eat more fruits, vegetables, and whole grains. Reduce salt and processed foods."
    );
  } else if (input.dietQuality === "Average") {
    recommendations.push(
      "Your diet is average. Try to include more fresh fruits and vegetables in your meals."
    );
  }

  if (input.stressLevel === "High") {
    recommendations.push(
      "Manage your stress through relaxation techniques, exercise, or meditation."
    );
  }

  if (input.familyHistory) {
    recommendations.push(
      "Since you have a family history of hypertension, regular blood pressure monitoring is especially important."
    );
  }

  if (input.age > 55) {
    recommendations.push(
      "As you are over 55, your risk increases with age. Get your blood pressure checked at least once a year."
    );
  }

  // Salt intake
  if (input.saltIntake === "High") {
    recommendations.push(
      "Reduce your salt intake. Aim for less than 5 grams (1 teaspoon) of salt per day. Avoid processed foods."
    );
  } else if (input.saltIntake === "Moderate") {
    recommendations.push(
      "Keep an eye on your salt intake. Try to season food with herbs and spices instead of salt."
    );
  }

  // Sleep
  if (input.sleepHours < 5) {
    recommendations.push(
      "You are getting too little sleep. Aim for 7-9 hours of sleep per night to help regulate blood pressure."
    );
  } else if (input.sleepHours > 9) {
    recommendations.push(
      "Excessive sleep can also be a risk factor. Aim for 7-9 hours of quality sleep per night."
    );
  }

  // Caffeine
  if (input.caffeineIntake === "Heavy") {
    recommendations.push(
      "Reduce your caffeine intake. Limit coffee to 1-2 cups per day and avoid energy drinks."
    );
  } else if (input.caffeineIntake === "Moderate") {
    recommendations.push(
      "Monitor your caffeine intake. Too much caffeine can temporarily spike blood pressure."
    );
  }

  return recommendations;
}
