"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { SkeletonStats, SkeletonRow } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

interface HistoryItem {
  id: number;
  riskLevel: string;
  riskProbability: number;
  predictionDate: string;
  lifestyleData: {
    age: number;
    bmi: number;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { showToast, toastElement } = useToast();
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data.predictions || []);
        } else {
          showToastRef.current("Failed to load recent predictions", "error");
        }
      } catch {
        showToastRef.current("Network error. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const totalPredictions = history.length;
  const lastRisk = history[0]?.riskLevel || "—";
  const memberSince = user ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

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

  const stats = [
    {
      label: "Total Predictions",
      value: totalPredictions,
      icon: "bi-clipboard-data",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      label: "Last Risk Level",
      value: lastRisk,
      icon: riskIcon(lastRisk),
      gradient:
        lastRisk === "Low"
          ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
          : lastRisk === "Moderate"
            ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            : lastRisk === "High"
              ? "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
              : "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    },
    {
      label: "Member Since",
      value: memberSince,
      icon: "bi-calendar-check",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    },
  ];

  return (
    <>
      {toastElement}
      <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-0">
            Welcome back{user ? `, ${user.fullName.split(" ")[0]}` : ""}!
          </h2>
          <p className="text-secondary mb-0">Here is your health overview</p>
        </div>
        <Link href="/dashboard/predict" className="btn btn-primary">
          <i className="bi bi-clipboard2-pulse me-2"></i>
          Take New Assessment
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="row g-3 mb-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`col-md-4 animate-fade-in-up delay-${i + 1}`}>
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-secondary mb-1 small">{stat.label}</p>
                    {stat.label === "Last Risk Level" ? (
                      <span className={`badge ${riskBadge(String(stat.value))} fs-6`}>
                        <i className={`bi ${stat.icon} me-1`}></i>
                        {stat.value}
                      </span>
                    ) : (
                      <h3 className="fw-bold mb-0">{stat.value}</h3>
                    )}
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "14px",
                      background: stat.gradient,
                    }}
                  >
                    <i className={`bi ${stat.icon} text-white`} style={{ fontSize: "1.5rem" }}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Predictions */}
      <div className="card shadow-sm animate-fade-in-up delay-2">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-clock-history me-2 text-primary"></i>
            Recent Predictions
          </h5>
          <Link href="/dashboard/history" className="btn btn-sm btn-outline-primary">
            View All
            <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Age</th>
                    <th>BMI</th>
                    <th>Risk Level</th>
                    <th>Probability</th>
                  </tr>
                </thead>
                <tbody>
                  <SkeletonRow columns={5} />
                  <SkeletonRow columns={5} />
                  <SkeletonRow columns={5} />
                </tbody>
              </table>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#f1f5f9",
                }}
              >
                <i className="bi bi-inbox text-secondary" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h5 className="fw-bold">No predictions yet</h5>
              <p className="text-secondary mb-3">
                Take your first health assessment to see your risk level here.
              </p>
              <Link href="/dashboard/predict" className="btn btn-primary">
                <i className="bi bi-clipboard2-pulse me-2"></i>
                Take Your First Assessment
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
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td>
                        {new Date(item.predictionDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
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
                      <td>
                        <span className="fw-semibold">{item.riskProbability}%</span>
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
    </>
  );
}
