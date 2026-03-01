import { api } from "./api";
import type {
  Usuario,
  CriarUsuarioRequest,
  AtualizarUsuarioRequest,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

export const usuarioService = {
  async listar(params: PaginationParams = {}): Promise<PaginatedResponse<Usuario>> {
    const res = await api.get<PaginatedResponse<Usuario>>("/usuario", {
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    return res.data;
  },

  async perfil(): Promise<Usuario> {
    const res = await api.get<Usuario>("/usuario/perfil");
    return res.data;
  },

  async buscarPorId(id: number): Promise<Usuario> {
    const res = await api.get<Usuario>(`/usuario/${id}`);
    return res.data;
  },

  async criar(data: CriarUsuarioRequest): Promise<Usuario> {
    const res = await api.post<Usuario>("/usuario", data);
    return res.data;
  },

  async atualizar(id: number, data: AtualizarUsuarioRequest): Promise<Usuario> {
    const res = await api.put<Usuario>(`/usuario/${id}`, data);
    return res.data;
  },

  async remover(id: number): Promise<void> {
    await api.delete(`/usuario/${id}`);
  },
};
