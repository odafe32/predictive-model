"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import LoadingButton from "@/components/ui/LoadingButton";
import { useToast } from "@/components/ui/Toast";

interface AuthFormProps {
  mode: "login" | "register";
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  gender?: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { showToast, toastElement } = useToast();
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = mode === "register";

  function validateField(name: string, value: string): string | undefined {
    switch (name) {
      case "fullName":
        if (isRegister) {
          if (!value.trim()) return "Full name is required";
          if (value.trim().length < 3) return "Full name must be at least 3 characters";
          if (value.trim().length > 100) return "Full name is too long";
        }
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (isRegister && value.length < 6) return "Password must be at least 6 characters";
        if (isRegister && value.length > 50) return "Password is too long";
        break;
      case "gender":
        if (isRegister && !value) return "Please select your gender";
        break;
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setFieldErrors({ ...fieldErrors, [name]: error });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (touched[name]) {
      const error = validateField(name, value);
      setFieldErrors({ ...fieldErrors, [name]: error });
    }
  }

  function validateAll(formData: FormData): boolean {
    const errors: FieldErrors = {};
    let isValid = true;

    if (isRegister) {
      const fullName = (formData.get("fullName") as string) || "";
      const gender = (formData.get("gender") as string) || "";
      errors.fullName = validateField("fullName", fullName);
      errors.gender = validateField("gender", gender);
      if (errors.fullName || errors.gender) isValid = false;
    }

    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";
    errors.email = validateField("email", email);
    errors.password = validateField("password", password);
    if (errors.email || errors.password) isValid = false;

    setFieldErrors(errors);
    setTouched({ fullName: true, email: true, password: true, gender: true });
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

    const body: Record<string, unknown> = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (isRegister) {
      body.fullName = formData.get("fullName");
      body.gender = formData.get("gender");
    }

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Something went wrong", "error");
        setLoading(false);
        return;
      }

      setUser(data.user);
      showToast(isRegister ? "Account created successfully!" : "Welcome back!", "success");
      const redirect = data.user.role === "Admin" ? "/admin" : "/dashboard";
      setTimeout(() => router.push(redirect), 500);
    } catch {
      showToast("Network error. Please try again.", "error");
      setLoading(false);
    }
  }

  function getFieldClass(name: string): string {
    const baseClass = "form-control";
    if (!touched[name]) return baseClass;
    return fieldErrors[name as keyof FieldErrors]
      ? `${baseClass} is-invalid`
      : `${baseClass} is-valid`;
  }

  function getSelectFieldClass(name: string): string {
    const baseClass = "form-select";
    if (!touched[name]) return baseClass;
    return fieldErrors[name as keyof FieldErrors]
      ? `${baseClass} is-invalid`
      : `${baseClass} is-valid`;
  }

  return (
    <>
      {toastElement}
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card shadow-lg animate-scale-in" style={{ borderRadius: "20px" }}>
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3 animate-heartbeat"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "var(--gradient-primary)",
                  }}
                >
                  <i
                    className="bi bi-heart-pulse-fill text-white"
                    style={{ fontSize: "1.75rem" }}
                  ></i>
                </div>
                <h2 className="fw-bold mb-1">
                  {isRegister ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-secondary mb-0">
                  {isRegister
                    ? "Start monitoring your hypertension risk today"
                    : "Sign in to access your dashboard"}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {isRegister && (
                  <div className="mb-3 animate-fade-in-up">
                    <label className="form-label" htmlFor="fullName">
                      <i className="bi bi-person me-1 text-secondary"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      className={getFieldClass("fullName")}
                      placeholder="Enter your full name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                    />
                    {fieldErrors.fullName && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {fieldErrors.fullName}
                      </div>
                    )}
                    {touched.fullName && !fieldErrors.fullName && (
                      <div className="valid-feedback d-block">
                        <i className="bi bi-check-circle me-1"></i>
                        Looks good
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-3 animate-fade-in-up delay-1">
                  <label className="form-label" htmlFor="email">
                    <i className="bi bi-envelope me-1 text-secondary"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={getFieldClass("email")}
                    placeholder="you@example.com"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                  />
                  {fieldErrors.email && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.email}
                    </div>
                  )}
                  {touched.email && !fieldErrors.email && (
                    <div className="valid-feedback d-block">
                      <i className="bi bi-check-circle me-1"></i>
                      Valid email
                    </div>
                  )}
                </div>

                <div className="mb-3 animate-fade-in-up delay-2">
                  <label className="form-label" htmlFor="password">
                    <i className="bi bi-lock me-1 text-secondary"></i>
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      className={`${getFieldClass("password")} border-end-0`}
                      placeholder={isRegister ? "At least 6 characters" : "Enter your password"}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {fieldErrors.password}
                    </div>
                  )}
                  {isRegister && touched.password && !fieldErrors.password && (
                    <div className="valid-feedback d-block">
                      <i className="bi bi-check-circle me-1"></i>
                      Strong enough
                    </div>
                  )}
                </div>

                {isRegister && (
                  <div className="mb-4 animate-fade-in-up delay-3">
                    <label className="form-label" htmlFor="gender">
                      <i className="bi bi-gender-ambiguous me-1 text-secondary"></i>
                      Gender
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      className={getSelectFieldClass("gender")}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select your gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {fieldErrors.gender && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {fieldErrors.gender}
                      </div>
                    )}
                  </div>
                )}

                <LoadingButton
                  type="submit"
                  loading={loading}
                  loadingText={isRegister ? "Creating account..." : "Signing in..."}
                  className="w-100 btn-lg"
                >
                  <i className={`bi ${isRegister ? "bi-person-plus" : "bi-box-arrow-in-right"} me-2`}></i>
                  {isRegister ? "Create Account" : "Sign In"}
                </LoadingButton>
              </form>

              <div className="text-center mt-4">
                {isRegister ? (
                  <p className="mb-0 text-secondary">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign in
                    </Link>
                  </p>
                ) : (
                  <p className="mb-0 text-secondary">
                    {"Don't have an account?"}{" "}
                    <Link href="/register" className="text-primary fw-semibold text-decoration-none">
                      Create one
                    </Link>
                  </p>
                )}
              </div>

              {/* Demo credentials on login */}
              {!isRegister && (
                <div className="alert alert-info mt-3 mb-0" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af" }}>
                  <p className="mb-1 fw-semibold">
                    <i className="bi bi-info-circle me-1"></i>
                    Demo Credentials
                  </p>
                  <p className="mb-1 small">
                    <strong>User:</strong> john@example.com / password123
                  </p>
                  <p className="mb-0 small">
                    <strong>Admin:</strong> admin@healthpredict.com / admin123
                  </p>
                </div>
              )}

              {/* Back to home */}
              <div className="text-center mt-3">
                <Link href="/" className="text-secondary text-decoration-none small">
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
