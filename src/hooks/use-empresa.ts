"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empresaService } from "@/services/empresa.service";
import type { CriarEmpresaRequest, AtualizarEmpresaRequest, PaginationParams } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

export const empresaKeys = {
  all: ["empresas"] as const,
  lists: () => [...empresaKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...empresaKeys.lists(), params] as const,
  detail: (id: number) => [...empresaKeys.all, "detail", id] as const,
};

export function useEmpresas(params: PaginationParams = {}) {
  return useQuery({
    queryKey: empresaKeys.list(params),
    queryFn: () => empresaService.listar(params),
  });
}

export function useEmpresa(id: number) {
  return useQuery({
    queryKey: empresaKeys.detail(id),
    queryFn: () => empresaService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CriarEmpresaRequest) => empresaService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: empresaKeys.lists() });
      toast.success("Empresa criada com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao criar empresa")),
  });
}

export function useAtualizarEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AtualizarEmpresaRequest }) =>
      empresaService.atualizar(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: empresaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: empresaKeys.detail(id) });
      toast.success("Empresa atualizada com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao atualizar empresa")),
  });
}

export function useRemoverEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => empresaService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: empresaKeys.lists() });
      toast.success("Empresa removida com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao remover empresa")),
  });
}
