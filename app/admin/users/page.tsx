"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { SkeletonRow } from "@/components/ui/Skeleton";

interface User {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  role: string;
  createdAt: string;
  _count: {
    predictionResults: number;
    lifestyleData: number;
  };
}

export default function AdminUsersPage() {
  const { showToast, toastElement } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        } else {
          showToast("Failed to load users", "error");
        }
      } catch {
        showToast("Network error", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [showToast]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const res = await fetch(`/api/admin/users?id=${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showToast(`${deleteTarget.fullName} deleted successfully`, "success");
        setUsers(users.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        showToast(data.error || "Failed to delete user", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {toastElement}
      <div className="animate-fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-0">
              <i className="bi bi-people me-2 text-primary"></i>
              User Management
            </h2>
            <p className="text-secondary mb-0">Manage all registered users</p>
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
                <i className="bi bi-list-ul me-2 text-primary"></i>
                All Users ({filtered.length})
              </h5>
              <div className="input-group" style={{ maxWidth: "300px" }}>
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Gender</th><th>Role</th><th>Predictions</th><th>Joined</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonRow columns={7} />
                    <SkeletonRow columns={7} />
                    <SkeletonRow columns={7} />
                  </tbody>
                </table>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people text-secondary" style={{ fontSize: "3rem" }}></i>
                <h5 className="fw-bold mt-2">No users found</h5>
                <p className="text-secondary mb-0">
                  {search ? "No users match your search." : "No users registered yet."}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>Role</th>
                      <th>Predictions</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="d-inline-flex align-items-center justify-content-center"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: user.role === "Admin" ? "#dc2626" : "var(--gradient-primary)",
                                color: "#fff",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                              }}
                            >
                              {user.fullName.charAt(0).toUpperCase()}
                            </span>
                            {user.fullName}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.gender}</td>
                        <td>
                          <span className={`badge ${user.role === "Admin" ? "bg-danger" : "bg-primary"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {user._count.predictionResults}
                          </span>
                        </td>
                        <td>
                          {new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </td>
                        <td>
                          {user.role === "Admin" ? (
                            <span className="text-secondary small">Cannot delete admin</span>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => setDeleteTarget(user)}
                              disabled={deletingId === user.id}
                            >
                              {deletingId === user.id ? (
                                <span className="spinner-border spinner-border-sm"></span>
                              ) : (
                                <i className="bi bi-trash"></i>
                              )}
                            </button>
                          )}
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={() => !deletingId && setDeleteTarget(null)}
        >
          <div
            className="card shadow-lg animate-scale-in"
            style={{ maxWidth: "450px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Confirm Delete
              </h5>
            </div>
            <div className="card-body">
              <p className="mb-1">Are you sure you want to delete this user?</p>
              <div className="d-flex align-items-center gap-2 my-3 p-3 bg-light rounded">
                <span
                  className="d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {deleteTarget.fullName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong>{deleteTarget.fullName}</strong>
                  <br />
                  <small className="text-secondary">{deleteTarget.email}</small>
                </div>
              </div>
              <p className="text-danger small mb-0">
                <i className="bi bi-info-circle me-1"></i>
                This action cannot be undone. All predictions and lifestyle data for this user will be permanently removed.
              </p>
            </div>
            <div className="card-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={!!deletingId}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={!!deletingId}
              >
                {deletingId ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-2"></i>
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
