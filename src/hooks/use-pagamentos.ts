"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pagamentoService } from "@/services/pagamento.service";
import type { PaginationParams, RegistrarPagamentoRequest } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

export const pagamentoKeys = {
  all: ["pagamentos"] as const,
  lists: () => [...pagamentoKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...pagamentoKeys.lists(), params] as const,
  detail: (id: number) => [...pagamentoKeys.all, "detail", id] as const,
};

export function usePagamentos(params: PaginationParams = {}) {
  return useQuery({
    queryKey: pagamentoKeys.list(params),
    queryFn: () => pagamentoService.listar(params),
  });
}

export function usePagamento(id: number) {
  return useQuery({
    queryKey: pagamentoKeys.detail(id),
    queryFn: () => pagamentoService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useRegistrarPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegistrarPagamentoRequest) => pagamentoService.registrar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pagamentoKeys.lists() });
      toast.success("Pagamento registrado com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao registrar pagamento")),
  });
}
