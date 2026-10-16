"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { SkeletonRow } from "@/components/ui/Skeleton";

interface Log {
  id: number;
  userId: number | null;
  activity: string;
  status: string;
  logTime: string;
  user: { fullName: string; email: string } | null;
}

export default function AdminLogsPage() {
  const { showToast, toastElement } = useToast();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/admin/logs?limit=200");
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs || []);
        } else {
          showToast("Failed to load logs", "error");
        }
      } catch {
        showToast("Network error", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filtered = filter === "All" ? logs : logs.filter((l) => l.status === filter);

  const statusBadge = (status: string) => {
    if (status === "Success") return "bg-success";
    if (status === "Failed" || status === "Error") return "bg-danger";
    if (status === "Warning") return "bg-warning text-dark";
    return "bg-secondary";
  };

  return (
    <>
      {toastElement}
      <div className="animate-fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-0">
              <i className="bi bi-list-check me-2 text-primary"></i>
              System Logs
            </h2>
            <p className="text-secondary mb-0">View all system activity</p>
          </div>
          <Link href="/admin" className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Dashboard
          </Link>
        </div>

        <div className="card shadow-sm">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2 text-primary"></i>
                Recent Activity ({filtered.length})
              </h5>
              <div className="btn-group" role="group">
                {["All", "Success", "Failed", "Error"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
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
                      <th>Time</th><th>User</th><th>Activity</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonRow columns={4} />
                    <SkeletonRow columns={4} />
                    <SkeletonRow columns={4} />
                  </tbody>
                </table>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-list-check text-secondary" style={{ fontSize: "3rem" }}></i>
                <h5 className="fw-bold mt-2">No logs found</h5>
                <p className="text-secondary mb-0">No system activity recorded yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Activity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <small>
                            {new Date(log.logTime).toLocaleString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </small>
                        </td>
                        <td>
                          {log.user ? (
                            <span>{log.user.fullName}</span>
                          ) : (
                            <span className="text-secondary">System</span>
                          )}
                        </td>
                        <td>{log.activity}</td>
                        <td>
                          <span className={`badge ${statusBadge(log.status)}`}>
                            {log.status}
                          </span>
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
