"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chamadoService } from "@/services/chamado.service";
import type {
  CriarChamadoRequest,
  AdicionarMensagemRequest,
  AtualizarChamadoRequest,
  PaginationParams,
} from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

export const chamadoKeys = {
  all: ["chamados"] as const,
  lists: () => [...chamadoKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...chamadoKeys.lists(), params] as const,
  detail: (id: number) => [...chamadoKeys.all, "detail", id] as const,
};

export function useChamados(params: PaginationParams = {}) {
  return useQuery({
    queryKey: chamadoKeys.list(params),
    queryFn: () => chamadoService.listar(params),
  });
}

export function useChamado(id: number) {
  return useQuery({
    queryKey: chamadoKeys.detail(id),
    queryFn: () => chamadoService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarChamado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CriarChamadoRequest) => chamadoService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chamadoKeys.lists() });
      toast.success("Chamado criado com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao criar chamado")),
  });
}

export function useAdicionarMensagem(chamadoId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdicionarMensagemRequest) =>
      chamadoService.adicionarMensagem(chamadoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chamadoKeys.detail(chamadoId) });
      toast.success("Mensagem enviada!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao enviar mensagem")),
  });
}

export function useFecharChamado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => chamadoService.fechar(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: chamadoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chamadoKeys.detail(id) });
      toast.success("Chamado fechado!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao fechar chamado")),
  });
}

export function useAtualizarChamado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AtualizarChamadoRequest }) =>
      chamadoService.atualizar(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: chamadoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chamadoKeys.detail(id) });
      toast.success("Chamado atualizado!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao atualizar chamado")),
  });
}
