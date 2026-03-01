import { api } from "./api";
import type {
  Notificacao,
  NotificacoesNaoLidasResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

export const notificacaoService = {
  async listar(params: PaginationParams = {}): Promise<PaginatedResponse<Notificacao>> {
    const res = await api.get<PaginatedResponse<Notificacao>>("/notificacao", {
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    return res.data;
  },

  async contarNaoLidas(): Promise<NotificacoesNaoLidasResponse> {
    const res = await api.get<NotificacoesNaoLidasResponse>(
      "/notificacao/nao-lidas"
    );
    return res.data;
  },

  async marcarComoLida(id: number): Promise<void> {
    await api.patch(`/notificacao/${id}/lida`);
  },

  async marcarTodasComoLidas(): Promise<void> {
    await api.patch("/notificacao/todas-lidas");
  },
};
