"use client";

import { useState } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import { useToast } from "@/components/ui/Toast";

interface PredictionResult {
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

interface FieldErrors {
  age?: string;
  bmi?: string;
  physicalActivity?: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  dietQuality?: string;
  stressLevel?: string;
  familyHistory?: string;
  saltIntake?: string;
  sleepHours?: string;
  caffeineIntake?: string;
}

export default function PredictionForm({
  onResult,
}: {
  onResult: (result: PredictionResult) => void;
}) {
  const { showToast, toastElement } = useToast();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validateField(name: string, value: string): string | undefined {
    switch (name) {
      case "age": {
        const n = Number(value);
        if (!value) return "Age is required";
        if (isNaN(n) || n < 18 || n > 90) return "Age must be between 18 and 90";
        break;
      }
      case "bmi": {
        const n = Number(value);
        if (!value) return "BMI is required";
        if (isNaN(n) || n < 10 || n > 60) return "BMI must be between 10 and 60";
        break;
      }
      case "physicalActivity":
        if (!value) return "Please select your activity level";
        break;
      case "smokingStatus":
        if (!value) return "Please select your smoking status";
        break;
      case "alcoholConsumption":
        if (!value) return "Please select your alcohol consumption";
        break;
      case "dietQuality":
        if (!value) return "Please select your diet quality";
        break;
      case "stressLevel":
        if (!value) return "Please select your stress level";
        break;
      case "saltIntake":
        if (!value) return "Please select your salt intake level";
        break;
      case "sleepHours": {
        const n = Number(value);
        if (!value) return "Sleep hours is required";
        if (isNaN(n) || n < 3 || n > 12) return "Sleep hours must be between 3 and 12";
        break;
      }
      case "caffeineIntake":
        if (!value) return "Please select your caffeine intake level";
        break;
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: error });
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors({ ...fieldErrors, [name]: error });
    }
  }

  function validateAll(formData: FormData): boolean {
    const errors: FieldErrors = {};
    let isValid = true;

    const fields = [
      "age",
      "bmi",
      "physicalActivity",
      "smokingStatus",
      "alcoholConsumption",
      "dietQuality",
      "stressLevel",
      "saltIntake",
      "sleepHours",
      "caffeineIntake",
    ];

    for (const field of fields) {
      const value = (formData.get(field) as string) || "";
      const error = validateField(field, value);
      if (error) {
        errors[field as keyof FieldErrors] = error;
        isValid = false;
      }
    }

    setFieldErrors(errors);
    setTouched({
      age: true,
      bmi: true,
      physicalActivity: true,
      smokingStatus: true,
      alcoholConsumption: true,
      dietQuality: true,
      stressLevel: true,
      familyHistory: true,
      saltIntake: true,
      sleepHours: true,
      caffeineIntake: true,
    });
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateAll(formData)) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setLoading(true);

    const body = {
      age: Number(formData.get("age")),
      bmi: Number(formData.get("bmi")),
      physicalActivity: formData.get("physicalActivity"),
      smokingStatus: formData.get("smokingStatus"),
      alcoholConsumption: formData.get("alcoholConsumption"),
      dietQuality: formData.get("dietQuality"),
      stressLevel: formData.get("stressLevel"),
      familyHistory: formData.get("familyHistory") === "yes",
      saltIntake: formData.get("saltIntake"),
      sleepHours: Number(formData.get("sleepHours")),
      caffeineIntake: formData.get("caffeineIntake"),
    };

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Prediction failed", "error");
        setLoading(false);
        return;
      }

      showToast("Prediction completed successfully!", "success");
      onResult(data);
    } catch {
      showToast("Network error. Please try again.", "error");
      setLoading(false);
    }
  }

  function getFieldClass(name: string): string {
    const base = "form-control";
    if (!touched[name]) return base;
    return fieldErrors[name as keyof FieldErrors]
      ? `${base} is-invalid`
      : `${base} is-valid`;
  }

  function getSelectClass(name: string): string {
    const base = "form-select";
    if (!touched[name]) return base;
    return fieldErrors[name as keyof FieldErrors]
      ? `${base} is-invalid`
      : `${base} is-valid`;
  }

  return (
    <>
      {toastElement}
      <div className="card shadow-sm animate-fade-in">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
            Lifestyle Assessment Form
          </h5>
        </div>
        <div className="card-body">
          <p className="text-secondary mb-4">
            Fill in the details below to get your hypertension risk prediction.
            All fields are required.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Age & BMI */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="age">
                  <i className="bi bi-calendar3 me-1 text-secondary"></i>
                  Age (years)
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  className={getFieldClass("age")}
                  placeholder="e.g. 45"
                  min={18}
                  max={90}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.age && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.age}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="bmi">
                  <i className="bi bi-speedometer me-1 text-secondary"></i>
                  BMI (kg/m²)
                </label>
                <input
                  type="number"
                  name="bmi"
                  id="bmi"
                  step="0.1"
                  className={getFieldClass("bmi")}
                  placeholder="e.g. 25.5"
                  min={10}
                  max={60}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.bmi && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.bmi}
                  </div>
                )}
              </div>
            </div>

            {/* Physical Activity & Smoking */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="physicalActivity">
                  <i className="bi bi-bicycle me-1 text-secondary"></i>
                  Physical Activity
                </label>
                <select
                  name="physicalActivity"
                  id="physicalActivity"
                  className={getSelectClass("physicalActivity")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select level</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
                {fieldErrors.physicalActivity && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.physicalActivity}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="smokingStatus">
                  <i className="bi bi-fire me-1 text-secondary"></i>
                  Smoking Status
                </label>
                <select
                  name="smokingStatus"
                  id="smokingStatus"
                  className={getSelectClass("smokingStatus")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select status</option>
                  <option value="Never">Never</option>
                  <option value="Former">Former</option>
                  <option value="Current">Current</option>
                </select>
                {fieldErrors.smokingStatus && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.smokingStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Alcohol & Diet */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="alcoholConsumption">
                  <i className="bi bi-cup-straw me-1 text-secondary"></i>
                  Alcohol Consumption
                </label>
                <select
                  name="alcoholConsumption"
                  id="alcoholConsumption"
                  className={getSelectClass("alcoholConsumption")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select level</option>
                  <option value="None">None</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Frequent">Frequent</option>
                  <option value="Heavy">Heavy</option>
                </select>
                {fieldErrors.alcoholConsumption && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.alcoholConsumption}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="dietQuality">
                  <i className="bi bi-egg-fried me-1 text-secondary"></i>
                  Diet Quality
                </label>
                <select
                  name="dietQuality"
                  id="dietQuality"
                  className={getSelectClass("dietQuality")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select quality</option>
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                </select>
                {fieldErrors.dietQuality && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.dietQuality}
                  </div>
                )}
              </div>
            </div>

            {/* Salt & Caffeine */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="saltIntake">
                  <i className="bi bi-droplet-half me-1 text-secondary"></i>
                  Salt Intake
                </label>
                <select
                  name="saltIntake"
                  id="saltIntake"
                  className={getSelectClass("saltIntake")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select level</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
                {fieldErrors.saltIntake && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.saltIntake}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="caffeineIntake">
                  <i className="bi bi-cup-hot me-1 text-secondary"></i>
                  Caffeine Intake
                </label>
                <select
                  name="caffeineIntake"
                  id="caffeineIntake"
                  className={getSelectClass("caffeineIntake")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select level</option>
                  <option value="None">None</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
                {fieldErrors.caffeineIntake && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.caffeineIntake}
                  </div>
                )}
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="sleepHours">
                  <i className="bi bi-moon me-1 text-secondary"></i>
                  Sleep Hours (per night)
                </label>
                <input
                  type="number"
                  name="sleepHours"
                  id="sleepHours"
                  step="0.5"
                  className={getFieldClass("sleepHours")}
                  placeholder="e.g. 7"
                  min={3}
                  max={12}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.sleepHours && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.sleepHours}
                  </div>
                )}
              </div>
            </div>

            {/* Stress & Family History */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label" htmlFor="stressLevel">
                  <i className="bi bi-emoji-frown me-1 text-secondary"></i>
                  Stress Level
                </label>
                <select
                  name="stressLevel"
                  id="stressLevel"
                  className={getSelectClass("stressLevel")}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select level</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
                {fieldErrors.stressLevel && (
                  <div className="invalid-feedback d-block">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    {fieldErrors.stressLevel}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <i className="bi bi-people me-1 text-secondary"></i>
                  Family History of Hypertension
                </label>
                <div className="d-flex gap-3 mt-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="familyHistory"
                      id="fhYes"
                      value="yes"
                      required
                    />
                    <label className="form-check-label" htmlFor="fhYes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="familyHistory"
                      id="fhNo"
                      value="no"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="fhNo">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Analyzing..."
              className="btn-lg w-100"
            >
              <i className="bi bi-graph-up-arrow me-2"></i>
              Get My Risk Prediction
            </LoadingButton>
          </form>
        </div>
      </div>
    </>
  );
}
