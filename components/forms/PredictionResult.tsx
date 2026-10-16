"use client";

import Link from "next/link";
import { getRecommendations, type LifestyleInput } from "@/lib/ml-client";

interface PredictionResult {
  id: number;
  riskProbability: number;
  riskLevel: string;
  lifestyleData: LifestyleInput;
  predictionDate: string;
}

export default function PredictionResult({
  result,
  onReset,
}: {
  result: PredictionResult;
  onReset: () => void;
}) {
  const { riskProbability, riskLevel, lifestyleData } = result;
  const recommendations = getRecommendations(riskLevel, lifestyleData);

  const riskConfig = {
    Low: {
      color: "#16a34a",
      bg: "#f0fdf4",
      icon: "bi-check-circle-fill",
      border: "#bbf7d0",
    },
    Moderate: {
      color: "#d97706",
      bg: "#fffbeb",
      icon: "bi-exclamation-triangle-fill",
      border: "#fde68a",
    },
    High: {
      color: "#dc2626",
      bg: "#fef2f2",
      icon: "bi-x-circle-fill",
      border: "#fecaca",
    },
  };

  const config = riskConfig[riskLevel as keyof typeof riskConfig] || riskConfig.Low;

  // Progress bar width (max 100%)
  const progressWidth = Math.min(riskProbability, 100);

  return (
    <div className="animate-fade-in-up">
      {/* Result Card */}
      <div
        className="card shadow-sm mb-4"
        style={{ borderRadius: "16px", overflow: "hidden" }}
      >
        <div
          className="card-body p-4"
          style={{ background: config.bg, borderBottom: `3px solid ${config.color}` }}
        >
          <div className="text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3 animate-scale-in"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: config.color,
              }}
            >
              <i
                className={`bi ${config.icon} text-white`}
                style={{ fontSize: "2.5rem" }}
              ></i>
            </div>
            <h3 className="fw-bold mb-1" style={{ color: config.color }}>
              {riskLevel} Risk
            </h3>
            <p className="text-secondary mb-3">
              Your predicted hypertension risk level
            </p>

            {/* Probability Bar */}
            <div className="mb-2">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary small">Risk Probability</span>
                <span className="fw-bold" style={{ color: config.color }}>
                  {riskProbability}%
                </span>
              </div>
              <div
                className="progress"
                style={{ height: "12px", borderRadius: "6px" }}
              >
                <div
                  className="progress-bar animate-fade-in"
                  style={{
                    width: `${progressWidth}%`,
                    background: config.color,
                    transition: "width 1s ease-out",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Summary */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-list-check me-2 text-primary"></i>
            Your Input Summary
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Age</span>
                <span className="fw-semibold">{lifestyleData.age} years</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">BMI</span>
                <span className="fw-semibold">{lifestyleData.bmi}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Physical Activity</span>
                <span className="fw-semibold">{lifestyleData.physicalActivity}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Smoking</span>
                <span className="fw-semibold">{lifestyleData.smokingStatus}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Alcohol</span>
                <span className="fw-semibold">{lifestyleData.alcoholConsumption}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Diet Quality</span>
                <span className="fw-semibold">{lifestyleData.dietQuality}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Stress Level</span>
                <span className="fw-semibold">{lifestyleData.stressLevel}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Family History</span>
                <span className="fw-semibold">
                  {lifestyleData.familyHistory ? "Yes" : "No"}
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Salt Intake</span>
                <span className="fw-semibold">{lifestyleData.saltIntake}</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Sleep Hours</span>
                <span className="fw-semibold">{lifestyleData.sleepHours} hrs</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Caffeine Intake</span>
                <span className="fw-semibold">{lifestyleData.caffeineIntake}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-lightbulb me-2 text-warning"></i>
            Health Recommendations
          </h5>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="list-group-item border-0 d-flex gap-2 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <i className="bi bi-check-circle-fill text-success mt-1"></i>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex gap-2 flex-wrap">
        <button onClick={onReset} className="btn btn-outline-primary">
          <i className="bi bi-arrow-repeat me-1"></i>
          Take Another Assessment
        </button>
        <Link href="/dashboard/history" className="btn btn-primary">
          <i className="bi bi-clock-history me-1"></i>
          View History
        </Link>
        <Link href="/dashboard" className="btn btn-light">
          <i className="bi bi-house me-1"></i>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
