import { api } from "./api";
import type {
  Pagamento,
  RegistrarPagamentoRequest,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

export const pagamentoService = {
  async listar(params: PaginationParams = {}): Promise<PaginatedResponse<Pagamento>> {
    const res = await api.get<PaginatedResponse<Pagamento>>("/pagamento", {
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    return res.data;
  },

  async buscarPorId(id: number): Promise<Pagamento> {
    const res = await api.get<Pagamento>(`/pagamento/${id}`);
    return res.data;
  },

  async registrar(data: RegistrarPagamentoRequest): Promise<Pagamento> {
    const res = await api.post<Pagamento>("/pagamento", data);
    return res.data;
  },
};
