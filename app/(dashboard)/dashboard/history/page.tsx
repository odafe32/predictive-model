"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

interface Prediction {
  id: number;
  riskProbability: string;
  riskLevel: string;
  predictionDate: string;
  lifestyleData: {
    id: number;
    age: number;
    bmi: string;
    physicalActivity: string;
    smokingStatus: string;
    alcoholConsumption: string;
    dietQuality: string;
    stressLevel: string;
    familyHistory: boolean;
    saltIntake: string | null;
    sleepHours: string | null;
    caffeineIntake: string | null;
  };
}

export default function HistoryPage() {
  const { showToast, toastElement } = useToast();
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [selected, setSelected] = useState<Prediction | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setPredictions(data.predictions || []);
          if (data.predictions && data.predictions.length > 0) {
            showToastRef.current(`Loaded ${data.predictions.length} predictions`, "info");
          }
        } else {
          showToastRef.current("Failed to load history", "error");
        }
      } catch {
        showToastRef.current("Network error. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filtered = filter === "All"
    ? predictions
    : predictions.filter((p) => p.riskLevel === filter);

  const riskBadge = (level: string) => {
    if (level === "Low") return "bg-success";
    if (level === "Moderate") return "bg-warning text-dark";
    if (level === "High") return "bg-danger";
    return "bg-secondary";
  };

  const riskIcon = (level: string) => {
    if (level === "Low") return "bi-check-circle-fill";
    if (level === "Moderate") return "bi-exclamation-triangle-fill";
    if (level === "High") return "bi-x-circle-fill";
    return "bi-dash-circle";
  };

  const stats = {
    total: predictions.length,
    low: predictions.filter((p) => p.riskLevel === "Low").length,
    moderate: predictions.filter((p) => p.riskLevel === "Moderate").length,
    high: predictions.filter((p) => p.riskLevel === "High").length,
  };

  return (
    <>
      {toastElement}
      <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0">
            <i className="bi bi-clock-history me-2 text-primary"></i>
            Prediction History
          </h2>
          <p className="text-secondary mb-0">View all your past predictions</p>
        </div>
        <Link href="/dashboard/predict" className="btn btn-primary">
          <i className="bi bi-clipboard2-pulse me-2"></i>
          New Prediction
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <p className="text-secondary mb-1 small">Total</p>
            <h4 className="fw-bold mb-0">{stats.total}</h4>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1 small">Low Risk</p>
                <h4 className="fw-bold mb-0 text-success">{stats.low}</h4>
              </div>
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "1.5rem" }}></i>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1 small">Moderate</p>
                <h4 className="fw-bold mb-0 text-warning">{stats.moderate}</h4>
              </div>
              <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "1.5rem" }}></i>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1 small">High Risk</p>
                <h4 className="fw-bold mb-0 text-danger">{stats.high}</h4>
              </div>
              <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: "1.5rem" }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0">
              <i className="bi bi-funnel me-2 text-primary"></i>
              Filter Predictions
            </h5>
            <div className="btn-group" role="group">
              {["All", "Low", "Moderate", "High"].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`btn btn-sm ${filter === level ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFilter(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th><th>Age</th><th>BMI</th><th>Risk Level</th><th>Probability</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  <SkeletonRow columns={6} />
                  <SkeletonRow columns={6} />
                  <SkeletonRow columns={6} />
                </tbody>
              </table>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f1f5f9" }}
              >
                <i className="bi bi-inbox text-secondary" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h5 className="fw-bold">No predictions found</h5>
              <p className="text-secondary mb-3">
                {filter === "All"
                  ? "Take your first health assessment to see results here."
                  : `No ${filter.toLowerCase()} risk predictions yet.`}
              </p>
              <Link href="/dashboard/predict" className="btn btn-primary">
                <i className="bi bi-clipboard2-pulse me-2"></i>
                Take Assessment
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Age</th>
                    <th>BMI</th>
                    <th>Risk Level</th>
                    <th>Probability</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => { setSelected(item); showToast(`Viewing prediction from ${new Date(item.predictionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`, "info"); }}>
                      <td>
                        {new Date(item.predictionDate).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td>{item.lifestyleData.age}</td>
                      <td>{item.lifestyleData.bmi}</td>
                      <td>
                        <span className={`badge ${riskBadge(item.riskLevel)}`}>
                          <i className={`bi ${riskIcon(item.riskLevel)} me-1`}></i>
                          {item.riskLevel}
                        </span>
                      </td>
                      <td className="fw-semibold">{item.riskProbability}%</td>
                      <td>
                        <i className="bi bi-chevron-right text-secondary"></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => setSelected(null)}
        >
          <div
            className="card shadow-lg animate-scale-in"
            style={{ maxWidth: "600px", width: "90%", maxHeight: "85vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className={`bi ${riskIcon(selected.riskLevel)} me-2`} style={{ color: selected.riskLevel === "High" ? "#dc2626" : selected.riskLevel === "Moderate" ? "#d97706" : "#16a34a" }}></i>
                Prediction Details
              </h5>
              <button type="button" className="btn-close" onClick={() => setSelected(null)}></button>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <span className={`badge ${riskBadge(selected.riskLevel)} fs-5`}>
                  {selected.riskLevel} Risk
                </span>
                <h3 className="fw-bold mt-2">{selected.riskProbability}%</h3>
                <p className="text-secondary small mb-0">
                  {new Date(selected.predictionDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>

              <h6 className="fw-bold mb-3">Lifestyle Data</h6>
              <div className="row g-2">
                <div className="col-6"><span className="text-secondary">Age:</span> <strong>{selected.lifestyleData.age} years</strong></div>
                <div className="col-6"><span className="text-secondary">BMI:</span> <strong>{selected.lifestyleData.bmi}</strong></div>
                <div className="col-6"><span className="text-secondary">Activity:</span> <strong>{selected.lifestyleData.physicalActivity}</strong></div>
                <div className="col-6"><span className="text-secondary">Smoking:</span> <strong>{selected.lifestyleData.smokingStatus}</strong></div>
                <div className="col-6"><span className="text-secondary">Alcohol:</span> <strong>{selected.lifestyleData.alcoholConsumption}</strong></div>
                <div className="col-6"><span className="text-secondary">Diet:</span> <strong>{selected.lifestyleData.dietQuality}</strong></div>
                <div className="col-6"><span className="text-secondary">Stress:</span> <strong>{selected.lifestyleData.stressLevel}</strong></div>
                <div className="col-6"><span className="text-secondary">Family History:</span> <strong>{selected.lifestyleData.familyHistory ? "Yes" : "No"}</strong></div>
                {selected.lifestyleData.saltIntake && (
                  <div className="col-6"><span className="text-secondary">Salt Intake:</span> <strong>{selected.lifestyleData.saltIntake}</strong></div>
                )}
                {selected.lifestyleData.sleepHours && (
                  <div className="col-6"><span className="text-secondary">Sleep:</span> <strong>{selected.lifestyleData.sleepHours} hrs</strong></div>
                )}
                {selected.lifestyleData.caffeineIntake && (
                  <div className="col-6"><span className="text-secondary">Caffeine:</span> <strong>{selected.lifestyleData.caffeineIntake}</strong></div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
