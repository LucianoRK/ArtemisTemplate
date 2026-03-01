"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useAuthStore, type AuthUser } from "@/store/auth.store";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith("auth_user="))
      ?.split("=")
      .slice(1)
      .join("=");
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        const { token, ...user } = parsed as AuthUser & { token: string };
        setAuth(user, token);
      } catch {}
    }
  }, [setAuth]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
