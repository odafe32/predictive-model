"use client";

import { useEffect, useState } from "react";
import LoadingButton from "@/components/ui/LoadingButton";
import Toast, { useToast } from "@/components/ui/Toast";

interface Profile {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { showToast, toastElement } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFullName(data.fullName);
          setGender(data.gender);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (fullName.trim().length < 3) {
      showToast("Full name must be at least 3 characters", "error");
      return;
    }

    const body: { fullName: string; gender: string; currentPassword?: string; newPassword?: string } = {
      fullName,
      gender,
    };

    if (showPasswordFields) {
      if (!currentPassword) {
        showToast("Enter your current password", "error");
        return;
      }
      if (newPassword.length < 6) {
        showToast("New password must be at least 6 characters", "error");
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast("New passwords do not match", "error");
        return;
      }
      body.currentPassword = currentPassword;
      body.newPassword = newPassword;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Update failed", "error");
        setSaving(false);
        return;
      }

      showToast("Profile updated successfully!", "success");
      setShowPasswordFields(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (profile) {
        setProfile({ ...profile, fullName, gender });
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center text-secondary">Failed to load profile.</p>;
  }

  return (
    <>
      {toastElement}
      <div className="animate-fade-in">
        <h2 className="fw-bold mb-4">
          <i className="bi bi-person-circle me-2 text-primary"></i>
          My Profile
        </h2>

        <div className="row g-4">
          {/* Profile Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm text-center">
              <div className="card-body p-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold mb-1">{profile.fullName}</h4>
                <p className="text-secondary mb-2">{profile.email}</p>
                <span className={`badge ${profile.role === "Admin" ? "bg-danger" : "bg-primary"}`}>
                  <i className={`bi ${profile.role === "Admin" ? "bi-shield-lock" : "bi-person"} me-1`}></i>
                  {profile.role}
                </span>
                <hr className="my-3" />
                <p className="text-secondary small mb-0">
                  <i className="bi bi-calendar3 me-1"></i>
                  Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-pencil me-2 text-primary"></i>
                  Edit Profile
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-person me-1 text-secondary"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      minLength={3}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-envelope me-1 text-secondary"></i>
                      Email (cannot be changed)
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile.email}
                      disabled
                      style={{ background: "#f8fafc" }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-gender-ambiguous me-1 text-secondary"></i>
                      Gender
                    </label>
                    <select
                      className="form-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <hr className="my-4" />

                  {/* Password Change Toggle */}
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                    >
                      <i className={`bi ${showPasswordFields ? "bi-x-circle" : "bi-key"} me-1`}></i>
                      {showPasswordFields ? "Cancel Password Change" : "Change Password"}
                    </button>
                  </div>

                  {showPasswordFields && (
                    <div className="animate-fade-in-up">
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-lock me-1 text-secondary"></i>
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-lock-fill me-1 text-secondary"></i>
                          New Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          minLength={6}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          <i className="bi bi-check2-circle me-1 text-secondary"></i>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                          <div className="invalid-feedback d-block">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            Passwords do not match
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <LoadingButton
                    type="submit"
                    loading={saving}
                    loadingText="Saving..."
                    className="btn-lg"
                  >
                    <i className="bi bi-check2 me-2"></i>
                    Save Changes
                  </LoadingButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
