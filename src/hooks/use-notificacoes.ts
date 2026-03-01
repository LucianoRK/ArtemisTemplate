"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificacaoService } from "@/services/notificacao.service";
import type { PaginationParams } from "@/types";

export const notificacaoKeys = {
  all: ["notificacoes"] as const,
  lists: () => [...notificacaoKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...notificacaoKeys.lists(), params] as const,
  naoLidas: () => [...notificacaoKeys.all, "nao-lidas"] as const,
};

export function useNotificacoes(params: PaginationParams = {}) {
  return useQuery({
    queryKey: notificacaoKeys.list(params),
    queryFn: () => notificacaoService.listar(params),
  });
}

export function useNotificacoesNaoLidas() {
  return useQuery({
    queryKey: notificacaoKeys.naoLidas(),
    queryFn: () => notificacaoService.contarNaoLidas(),
    refetchInterval: 30000, // Poll every 30s
  });
}

export function useMarcarComoLida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificacaoService.marcarComoLida(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificacaoKeys.all });
    },
  });
}

export function useMarcarTodasComoLidas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificacaoService.marcarTodasComoLidas(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificacaoKeys.all });
    },
  });
}
