import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_URL =
  typeof window !== "undefined"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const { initialized } = useAuthStore.getState();
      // Only redirect if auth was already initialized. During the initial page load,
      // the store is empty and queries may fire before /api/auth/me completes —
      // redirecting then would create a redirect loop with the middleware.
      if (initialized) {
        useAuthStore.getState().clearAuth();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const serverApi = (token?: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    timeout: 15000,
  });
