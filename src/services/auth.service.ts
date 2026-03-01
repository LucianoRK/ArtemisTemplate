import axios from "axios";
import type {
  AuthResponse,
  LoginRequest,
  RegistroRequest,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Use direct axios for auth (no token needed)
const authApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await authApi.post<AuthResponse>("/auth/login", data);
    return res.data;
  },

  async registro(data: RegistroRequest): Promise<AuthResponse> {
    const res = await authApi.post<AuthResponse>("/auth/registro", data);
    return res.data;
  },

  async recuperarSenha(email: string): Promise<{ message: string }> {
    const res = await authApi.post<{ message: string }>(
      "/auth/recuperar-senha",
      { email }
    );
    return res.data;
  },

  async redefinirSenha(
    token: string,
    nova_senha: string
  ): Promise<{ message: string }> {
    const res = await authApi.post<{ message: string }>(
      "/auth/redefinir-senha",
      { token, nova_senha }
    );
    return res.data;
  },
};
