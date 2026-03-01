import { api } from "./api";
import type { Plano } from "@/types";

export const planoService = {
  async listar(): Promise<Plano[]> {
    const res = await api.get<Plano[]>("/plano");
    return res.data;
  },
};
