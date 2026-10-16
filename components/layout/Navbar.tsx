"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";



export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  async function handleLogout() {
    setLoggingOut(true);
    setDropdownOpen(false);
    await logout();
    setLoggingOut(false);
    router.push("/login");
  }

  const isAdmin = user?.role === "Admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
          <i className="bi bi-heart-pulse-fill text-danger animate-heartbeat"></i>
          <span>HealthPredict</span>
        </Link>

        {/* Mobile toggler - uses React state */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-controls="navbarMain"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`} id="navbarMain">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <Link
                href="/"
                className={`nav-link ${pathname === "/" ? "active" : ""}`}
              >
                <i className="bi bi-house me-1 d-lg-none"></i>
                Home
              </Link>
            </li>

            {isLoading ? (
              <li className="nav-item">
                <span className="nav-link">
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                </span>
              </li>
            ) : user ? (
              <>
                {/* Role badge - shows if you're User or Admin */}
                <li className="nav-item">
                  <span className={`badge ${isAdmin ? "bg-danger" : "bg-info"} me-lg-2`}>
                    <i className={`bi ${isAdmin ? "bi-shield-lock" : "bi-person"} me-1`}></i>
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </li>

                {isAdmin ? (
                  <>
                    <li className="nav-item">
                      <Link
                        href="/admin"
                        className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
                      >
                        <i className="bi bi-shield-lock me-1 d-lg-none"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="/admin/users"
                        className={`nav-link ${pathname === "/admin/users" ? "active" : ""}`}
                      >
                        <i className="bi bi-people me-1 d-lg-none"></i>
                        Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="/admin/predictions"
                        className={`nav-link ${pathname === "/admin/predictions" ? "active" : ""}`}
                      >
                        <i className="bi bi-clipboard2-data me-1 d-lg-none"></i>
                        Predictions
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="/admin/logs"
                        className={`nav-link ${pathname === "/admin/logs" ? "active" : ""}`}
                      >
                        <i className="bi bi-list-check me-1 d-lg-none"></i>
                        Logs
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link
                        href="/dashboard"
                        className={`nav-link ${pathname.startsWith("/dashboard") ? "active" : ""}`}
                      >
                        <i className="bi bi-speedometer2 me-1 d-lg-none"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="/dashboard/predict"
                        className={`nav-link ${pathname === "/dashboard/predict" ? "active" : ""}`}
                      >
                        <i className="bi bi-clipboard2-pulse me-1 d-lg-none"></i>
                        Predict
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        href="/dashboard/history"
                        className={`nav-link ${pathname === "/dashboard/history" ? "active" : ""}`}
                      >
                        <i className="bi bi-clock-history me-1 d-lg-none"></i>
                        History
                      </Link>
                    </li>
                  </>
                )}

                {/* Profile dropdown - uses React state, not Bootstrap JS */}
                <li className="nav-item dropdown position-relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className="nav-link dropdown-toggle d-flex align-items-center gap-2 border-0 bg-transparent"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-expanded={dropdownOpen}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--gradient-primary)",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                    <span className="d-lg-none">{user.fullName}</span>
                  </button>

                  {dropdownOpen && (
                    <ul
                      className="dropdown-menu dropdown-menu-end show"
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        zIndex: 1000,
                        minWidth: "240px",
                      }}
                    >
                      <li className="px-3 py-2 border-bottom">
                        <small className="text-secondary d-block">Signed in as</small>
                        <strong className="text-dark">{user.email}</strong>
                        <br />
                        <span className={`badge ${isAdmin ? "bg-danger" : "bg-primary"} mt-1`}>
                          {user.role}
                        </span>
                      </li>
                      <li>
                        <Link
                          href={isAdmin ? "/admin" : "/dashboard/profile"}
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <i className="bi bi-person me-2"></i>
                          {isAdmin ? "Admin Dashboard" : "Profile"}
                        </Link>
                      </li>
                      {!isAdmin && (
                        <li>
                          <Link
                            href="/dashboard/profile"
                            className="dropdown-item"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <i className="bi bi-gear me-2"></i>
                            Settings
                          </Link>
                        </li>
                      )}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item text-danger"
                          disabled={loggingOut}
                          style={{ cursor: "pointer" }}
                        >
                          {loggingOut ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Logging out...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-box-arrow-right me-2"></i>Logout
                            </>
                          )}
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    href="/login"
                    className={`nav-link ${pathname === "/login" ? "active" : ""}`}
                  >
                    <i className="bi bi-box-arrow-in-right me-1 d-lg-none"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="btn btn-light btn-sm my-1 px-3">
                    <i className="bi bi-person-plus me-1"></i>
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
