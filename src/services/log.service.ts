import { api } from "./api";
import type { Log, PaginatedResponse, PaginationParams } from "@/types";

export const logService = {
  async listar(params: PaginationParams = {}): Promise<PaginatedResponse<Log>> {
    const res = await api.get<PaginatedResponse<Log>>("/log", {
      params: { page: params.page ?? 1, limit: params.limit ?? 10 },
    });
    return res.data;
  },
};
