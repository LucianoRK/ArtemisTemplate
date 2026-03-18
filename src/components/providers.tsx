"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { CookieBanner } from "@/components/shared/cookie-banner";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    // Rehydrate auth state on page refresh via secure server endpoint.
    // The httpOnly auth_token cookie is read server-side — token never exposed to JS directly.
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user && data?.token) {
          setAuth(data.user, data.token);
        }
      })
      .catch(() => {})
      .finally(() => {
        // Mark auth check as complete — api.ts interceptor uses this to decide
        // whether a 401 means "session expired" (redirect) or "still initializing" (ignore).
        setInitialized();
      });
  }, [setAuth, setInitialized]);

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
          <CookieBanner />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
