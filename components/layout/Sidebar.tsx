"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/dashboard/predict", label: "New Prediction", icon: "bi-clipboard2-pulse" },
  { href: "/dashboard/history", label: "History", icon: "bi-clock-history" },
  { href: "/dashboard/profile", label: "Profile", icon: "bi-person" },
];

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard", icon: "bi-shield-lock" },
  { href: "/admin/users", label: "Users", icon: "bi-people" },
  { href: "/admin/predictions", label: "Predictions", icon: "bi-clipboard2-data" },
  { href: "/admin/logs", label: "System Logs", icon: "bi-list-check" },
];

interface SidebarProps {
  variant?: "user" | "admin";
}

export default function Sidebar({ variant = "user" }: SidebarProps) {
  const pathname = usePathname();
  const links = variant === "admin" ? adminLinks : userLinks;

  return (
    <div className="list-group shadow-sm">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
              active ? "active" : ""
            }`}
          >
            <i className={`bi ${link.icon}`}></i>
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
