"use client";

import type { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingButton({
  loading = false,
  loadingText = "Please wait...",
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const variantClass = variant === "primary" ? "btn-primary" : `btn-${variant}`;

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
