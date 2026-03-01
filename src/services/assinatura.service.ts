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
};
