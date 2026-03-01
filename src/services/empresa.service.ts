import { api } from "./api";
import type {
  Empresa,
  CriarEmpresaRequest,
  AtualizarEmpresaRequest,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

export const empresaService = {
  async listar(params: PaginationParams = {}): Promise<PaginatedResponse<Empresa>> {
    const res = await api.get<PaginatedResponse<Empresa>>("/empresa", {
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    return res.data;
  },

  async buscarPorId(id: number): Promise<Empresa> {
    const res = await api.get<Empresa>(`/empresa/${id}`);
    return res.data;
  },

  async criar(data: CriarEmpresaRequest): Promise<Empresa> {
    const res = await api.post<Empresa>("/empresa", data);
    return res.data;
  },

  async atualizar(id: number, data: AtualizarEmpresaRequest): Promise<Empresa> {
    const res = await api.put<Empresa>(`/empresa/${id}`, data);
    return res.data;
  },

  async remover(id: number): Promise<void> {
    await api.delete(`/empresa/${id}`);
  },
};
