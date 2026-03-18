import { api } from "./api";
import type { Assinatura, CriarAssinaturaRequest } from "@/types";

export const assinaturaService = {
  async ativa(): Promise<Assinatura | null> {
    const res = await api.get<Assinatura>("/assinatura/ativa");
    return res.data;
  },

  async criar(data: CriarAssinaturaRequest): Promise<Assinatura> {
    const res = await api.post<Assinatura>("/assinatura", data);
    return res.data;
  },

  async checkout(planoId: number): Promise<{ init_point: string }> {
    const res = await api.post<{ init_point: string }>("/assinatura/checkout", { plano_id: planoId });
    return res.data;
  },
};
