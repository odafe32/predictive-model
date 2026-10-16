export function SkeletonCard() {
  return (
    <div className="skeleton skeleton-card" style={{ width: "100%" }}></div>
  );
}

export function SkeletonText({ width = "100%" }: { width?: string }) {
  return (
    <div
      className="skeleton skeleton-text"
      style={{ width }}
    ></div>
  );
}

export function SkeletonRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <div className="skeleton skeleton-text" style={{ width: "80%" }}></div>
        </td>
      ))}
    </tr>
  );
}

export function SkeletonStats() {
  return (
    <div className="row g-3 mb-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="col-md-4">
          <div className="skeleton" style={{ height: "100px", borderRadius: "16px" }}></div>
        </div>
      ))}
    </div>
  );
}
