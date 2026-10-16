"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Load Bootstrap JS bundle on the client
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).bootstrap) {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return null;
}
