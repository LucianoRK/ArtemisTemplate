import { api } from "./api";
import type {
  Chamado,
  CriarChamadoRequest,
  AdicionarMensagemRequest,
  AtualizarChamadoRequest,
  ChamadoMensagem,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

export const chamadoService = {
  async listar(params: PaginationParams = {}): Promise<PaginatedResponse<Chamado>> {
    const res = await api.get<PaginatedResponse<Chamado>>("/chamado", {
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    return res.data;
  },

  async buscarPorId(id: number): Promise<Chamado> {
    const res = await api.get<Chamado>(`/chamado/${id}`);
    return res.data;
  },

  async criar(data: CriarChamadoRequest): Promise<Chamado> {
    const res = await api.post<Chamado>("/chamado", data);
    return res.data;
  },

  async adicionarMensagem(
    id: number,
    data: AdicionarMensagemRequest
  ): Promise<ChamadoMensagem> {
    const res = await api.post<ChamadoMensagem>(`/chamado/${id}/mensagem`, data);
    return res.data;
  },

  async fechar(id: number): Promise<Chamado> {
    const res = await api.patch<Chamado>(`/chamado/${id}/fechar`);
    return res.data;
  },

  async atualizar(id: number, data: AtualizarChamadoRequest): Promise<Chamado> {
    const res = await api.patch<Chamado>(`/chamado/${id}`, data);
    return res.data;
  },
};
