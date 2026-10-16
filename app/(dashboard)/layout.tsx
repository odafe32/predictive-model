"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/Sidebar";
import Spinner from "@/components/ui/Spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container animate-fade-in">
      <div className="row">
        <div className="col-lg-3 mb-4 mb-lg-0">
          <Sidebar variant="user" />
        </div>
        <div className="col-lg-9">{children}</div>
      </div>
    </div>
  );
}
