"use client";

import { useState } from "react";
import PredictionForm from "@/components/forms/PredictionForm";
import PredictionResult from "@/components/forms/PredictionResult";

interface PredictionResultData {
  id: number;
  riskProbability: number;
  riskLevel: string;
  lifestyleData: {
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
  };
  predictionDate: string;
}

export default function PredictPage() {
  const [result, setResult] = useState<PredictionResultData | null>(null);

  function handleResult(data: PredictionResultData) {
    setResult(data);
    // Scroll to top to show result
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
          Hypertension Risk Assessment
        </h2>
        <p className="text-secondary mb-0">
          {result
            ? "Your prediction result is ready below."
            : "Fill in the form below to get your personalized risk prediction."}
        </p>
      </div>

      {result ? (
        <PredictionResult result={result} onReset={handleReset} />
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <PredictionForm onResult={handleResult} />
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm bg-light">
              <div className="card-body">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-info-circle me-2 text-primary"></i>
                  How It Works
                </h6>
                <p className="small text-secondary mb-2">
                  Our AI model analyzes your lifestyle data to estimate your
                  risk of developing hypertension.
                </p>
                <p className="small text-secondary mb-2">
                  The prediction is based on factors like age, BMI, physical
                  activity, diet, smoking, alcohol, stress, and family history.
                </p>
                <p className="small text-secondary mb-0">
                  You will receive a risk level (Low, Moderate, or High) along
                  with personalized health recommendations.
                </p>
              </div>
            </div>
            <div className="card shadow-sm bg-light mt-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-shield-check me-2 text-success"></i>
                  Privacy
                </h6>
                <p className="small text-secondary mb-0">
                  Your data is securely stored and only used for your personal
                  health tracking. It is never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
