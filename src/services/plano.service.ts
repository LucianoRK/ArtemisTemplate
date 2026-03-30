import { api } from "./api";
import type { Plano } from "@/types";

export const planoService = {
  async listar(): Promise<Plano[]> {
    const res = await api.get("/plano");
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    return list.map((p: Plano) => ({
      ...p,
      preco: Number(p.valor ?? 0),
    }));
  },
};
