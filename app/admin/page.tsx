"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

interface AdminStats {
  totalUsers: number;
  totalPredictions: number;
  totalLogs: number;
  riskDistribution: { Low: number; Moderate: number; High: number };
  genderDistribution: { Male: number; Female: number };
  dailyData: { date: string; count: number }[];
  avgProbability: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <Spinner size="lg" />;
  }

  if (!stats) {
    return <p className="text-center text-secondary">Failed to load admin stats.</p>;
  }

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "bi-people-fill",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      label: "Total Predictions",
      value: stats.totalPredictions,
      icon: "bi-clipboard2-data-fill",
      gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    },
    {
      label: "System Logs",
      value: stats.totalLogs,
      icon: "bi-list-check",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
    {
      label: "Avg Risk Score",
      value: `${stats.avgProbability}%`,
      icon: "bi-graph-up-arrow",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
  ];

  const riskData = [
    { name: "Low", value: stats.riskDistribution.Low, color: "#16a34a" },
    { name: "Moderate", value: stats.riskDistribution.Moderate, color: "#f59e0b" },
    { name: "High", value: stats.riskDistribution.High, color: "#dc2626" },
  ];

  const genderData = [
    { name: "Male", value: stats.genderDistribution.Male, color: "#3b82f6" },
    { name: "Female", value: stats.genderDistribution.Female, color: "#ec4899" },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="fw-bold mb-4">
        <i className="bi bi-shield-lock me-2 text-primary"></i>
        Admin Dashboard
      </h2>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {cards.map((card, i) => (
          <div key={card.label} className={`col-md-3 col-6 animate-fade-in-up delay-${i + 1}`}>
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">{card.label}</p>
                  <h3 className="fw-bold mb-0">{card.value}</h3>
                </div>
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: card.gradient,
                  }}
                >
                  <i className={`bi ${card.icon} text-white`} style={{ fontSize: "1.5rem" }}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-3 mb-4">
        {/* Risk Distribution */}
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2 text-primary"></i>
                Risk Level Distribution
              </h5>
            </div>
            <div className="card-body">
              {stats.totalPredictions > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {riskData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-secondary py-5">No prediction data yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="col-lg-3">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-gender-ambiguous me-2 text-primary"></i>
                Gender Split
              </h5>
            </div>
            <div className="card-body">
              {stats.totalPredictions > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {genderData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-secondary py-5">No data</div>
              )}
            </div>
          </div>
        </div>

        {/* Daily Predictions */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-bar-chart me-2 text-primary"></i>
                Predictions (7 days)
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">
            <i className="bi bi-lightning me-2 text-primary"></i>
            Quick Actions
          </h5>
          <div className="d-flex gap-2 flex-wrap">
            <Link href="/admin/users" className="btn btn-outline-primary">
              <i className="bi bi-people me-2"></i>Manage Users
            </Link>
            <Link href="/admin/predictions" className="btn btn-outline-primary">
              <i className="bi bi-clipboard2-data me-2"></i>View All Predictions
            </Link>
            <Link href="/admin/logs" className="btn btn-outline-primary">
              <i className="bi bi-list-check me-2"></i>View Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
