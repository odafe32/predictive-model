"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, isLoading, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      }
    }
    fetchUser();
  }, [setUser, clearUser]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
  };

  return { user, isLoading, logout };
}
