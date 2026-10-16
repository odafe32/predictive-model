"use client";

import { useCallback, useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "error", onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const alertClass =
    type === "success" ? "alert-success" : type === "info" ? "alert-info" : "alert-danger";
  const icon =
    type === "success" ? "bi-check-circle-fill" : type === "info" ? "bi-info-circle-fill" : "bi-exclamation-circle-fill";

  return (
    <div
      className="position-fixed top-0 end-0 p-3 animate-fade-in-right"
      style={{ zIndex: 1080, maxWidth: "400px" }}
    >
      <div className={`alert ${alertClass} d-flex align-items-center gap-2 shadow-lg mb-0`}>
        <i className={`bi ${icon}`}></i>
        <span>{message}</span>
        <button
          type="button"
          className="btn-close ms-auto"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "error") => {
    setToast({ message, type });
  }, []);

  const toastElement = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null;

  return { showToast, toastElement };
}
