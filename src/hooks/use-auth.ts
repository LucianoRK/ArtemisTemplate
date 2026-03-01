"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const router = useRouter();
  const { user, token, clearAuth } = useAuthStore();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearAuth();
    router.push("/login");
  };

  return { user, token, logout };
}
