"use client";

import { useQuery } from "@tanstack/react-query";
import { logService } from "@/services/log.service";
import type { PaginationParams } from "@/types";

export const logKeys = {
  all: ["logs"] as const,
  lists: () => [...logKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...logKeys.lists(), params] as const,
};

export function useLogs(params: PaginationParams = {}) {
  return useQuery({
    queryKey: logKeys.list(params),
    queryFn: () => logService.listar(params),
  });
}
