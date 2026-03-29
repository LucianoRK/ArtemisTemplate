"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export function useAdminGuard() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const router = useRouter();

  useEffect(() => {
    if (initialized && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [initialized, user, router]);

  return { isAdmin: user?.role === "admin", initialized };
}
