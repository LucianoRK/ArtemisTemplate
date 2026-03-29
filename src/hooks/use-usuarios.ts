"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usuarioService } from "@/services/usuario.service";
import type { CriarUsuarioRequest, AtualizarUsuarioRequest, PaginationParams } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

export const usuarioKeys = {
  all: ["usuarios"] as const,
  lists: () => [...usuarioKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...usuarioKeys.lists(), params] as const,
  detail: (id: number) => [...usuarioKeys.all, "detail", id] as const,
  perfil: () => [...usuarioKeys.all, "perfil"] as const,
};

export function useUsuarios(params: PaginationParams = {}) {
  return useQuery({
    queryKey: usuarioKeys.list(params),
    queryFn: () => usuarioService.listar(params),
  });
}

export function useUsuarioPerfil() {
  return useQuery({
    queryKey: usuarioKeys.perfil(),
    queryFn: () => usuarioService.perfil(),
  });
}

export function useUsuario(id: number) {
  return useQuery({
    queryKey: usuarioKeys.detail(id),
    queryFn: () => usuarioService.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CriarUsuarioRequest) => usuarioService.criar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuarioKeys.lists() });
      toast.success("Usuário criado com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao criar usuário")),
  });
}

export function useAtualizarPerfil() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AtualizarUsuarioRequest) => usuarioService.atualizarPerfil(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuarioKeys.perfil() });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao atualizar perfil")),
  });
}

export function useAtualizarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AtualizarUsuarioRequest }) =>
      usuarioService.atualizar(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usuarioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usuarioKeys.detail(id) });
      toast.success("Usuário atualizado com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao atualizar usuário")),
  });
}

export function useRemoverUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuarioService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuarioKeys.lists() });
      toast.success("Usuário removido com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao remover usuário")),
  });
}
