import { api } from "./api";
import type { Plano } from "@/types";

export const planoService = {
  async listar(): Promise<Plano[]> {
    const res = await api.get("/plano");
    const list = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    return list.map((p: Plano & { valor?: string }) => ({
      ...p,
      preco: Number(p.preco ?? p.valor ?? 0),
      intervalo: p.intervalo ?? "mensal",
      recursos: p.recursos ?? [],
    }));
  },
};
