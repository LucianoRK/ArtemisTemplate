import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  empresa_id: number;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
}));
