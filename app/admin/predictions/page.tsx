"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { SkeletonRow } from "@/components/ui/Skeleton";

interface Prediction {
  id: number;
  riskProbability: string;
  riskLevel: string;
  predictionDate: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    gender: string;
  };
  lifestyleData: {
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

export default function AdminPredictionsPage() {
  const { showToast, toastElement } = useToast();
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Prediction | null>(null);

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== "All") params.set("risk", filter);
        if (search) params.set("search", search);
        const res = await fetch(`/api/admin/predictions?${params}`);
        if (res.ok) {
          const data = await res.json();
          setPredictions(data.predictions || []);
        } else {
          showToastRef.current("Failed to load predictions", "error");
        }
      } catch {
        showToastRef.current("Network error", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchPredictions();
  }, [filter, search]);

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
              <i className="bi bi-clipboard2-data me-2 text-primary"></i>
              All Predictions
            </h2>
            <p className="text-secondary mb-0">View predictions from all users</p>
          </div>
          <Link href="/admin" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Dashboard
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

        {/* Filter + Search */}
        <div className="card shadow-sm mb-4">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0">
                <i className="bi bi-funnel me-2 text-primary"></i>
                Filter Predictions
              </h5>
              <div className="d-flex gap-2 flex-wrap">
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
                <div className="input-group" style={{ maxWidth: "250px" }}>
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th><th>User</th><th>Age</th><th>BMI</th><th>Risk</th><th>Probability</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonRow columns={7} />
                    <SkeletonRow columns={7} />
                    <SkeletonRow columns={7} />
                  </tbody>
                </table>
              </div>
            ) : predictions.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-clipboard2-x text-secondary" style={{ fontSize: "3rem" }}></i>
                <h5 className="fw-bold mt-2">No predictions found</h5>
                <p className="text-secondary mb-0">
                  {search || filter !== "All"
                    ? "No predictions match your filters."
                    : "No predictions have been made yet."}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>User</th>
                      <th>Age</th>
                      <th>BMI</th>
                      <th>Risk</th>
                      <th>Probability</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.map((item) => (
                      <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => setSelected(item)}>
                        <td>
                          <small>
                            {new Date(item.predictionDate).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background: "var(--gradient-primary)",
                                color: "#fff",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                              }}
                            >
                              {item.user.fullName.charAt(0).toUpperCase()}
                            </span>
                            <div>
                              <div className="fw-semibold">{item.user.fullName}</div>
                              <small className="text-secondary">{item.user.email}</small>
                            </div>
                          </div>
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

              <div className="card bg-light mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-2">
                    <i className="bi bi-person me-2 text-primary"></i>
                    User
                  </h6>
                  <p className="mb-0">
                    <strong>{selected.user.fullName}</strong>
                    <br />
                    <small className="text-secondary">{selected.user.email}</small>
                    <br />
                    <small className="text-secondary">Gender: {selected.user.gender}</small>
                  </p>
                </div>
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
    </>
  );
}
