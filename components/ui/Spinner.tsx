export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "sm" ? "" : size === "lg" ? "spinner-border-lg" : "";

  return (
    <div className="spinner-container">
      <div
        className={`spinner-border text-primary ${sizeClass}`}
        role="status"
        style={size === "lg" ? { width: "3rem", height: "3rem" } : undefined}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
