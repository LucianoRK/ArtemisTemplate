import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  empresa_id: number | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  initialized: false,
  setAuth: (user, token) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
  setInitialized: () => set({ initialized: true }),
}));
