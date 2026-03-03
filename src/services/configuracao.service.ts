import { api } from "./api";
import type {
  Configuracao,
  CriarConfiguracaoRequest,
  AtualizarConfiguracaoRequest,
} from "@/types";

export const configuracaoService = {
  async listar(): Promise<Configuracao[]> {
    const res = await api.get("/configuracao");
    return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
  },

  async buscarPorChave(chave: string): Promise<Configuracao> {
    const res = await api.get<Configuracao>(`/configuracao/${chave}`);
    return res.data;
  },

  async criar(data: CriarConfiguracaoRequest): Promise<Configuracao> {
    const res = await api.post<Configuracao>("/configuracao", data);
    return res.data;
  },

  async atualizar(chave: string, data: AtualizarConfiguracaoRequest): Promise<Configuracao> {
    const res = await api.put<Configuracao>(`/configuracao/${chave}`, data);
    return res.data;
  },

  async remover(chave: string): Promise<void> {
    await api.delete(`/configuracao/${chave}`);
  },
};
