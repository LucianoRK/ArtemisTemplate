"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configuracaoService } from "@/services/configuracao.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Settings, Plus, Pencil, Trash2, Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { Configuracao } from "@/types";

const schema = z.object({
  chave: z.string().min(1, "Chave obrigatória"),
  valor: z.string().min(1, "Valor obrigatório"),
});

type FormData = z.infer<typeof schema>;

export default function ConfiguracoesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteChave, setDeleteChave] = useState<string | null>(null);
  const [editingConfig, setEditingConfig] = useState<Configuracao | null>(null);

  const { data: configs, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: () => configuracaoService.listar(),
  });

  const criarConfig = useMutation({
    mutationFn: configuracaoService.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      toast.success("Configuração criada!");
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error("Erro ao criar configuração"),
  });

  const atualizarConfig = useMutation({
    mutationFn: ({ chave, valor }: { chave: string; valor: string }) =>
      configuracaoService.atualizar(chave, { valor }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      toast.success("Configuração atualizada!");
      setModalOpen(false);
      reset();
    },
    onError: () => toast.error("Erro ao atualizar configuração"),
  });

  const removerConfig = useMutation({
    mutationFn: configuracaoService.remover,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      toast.success("Configuração removida!");
      setDeleteChave(null);
    },
    onError: () => toast.error("Erro ao remover configuração"),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditingConfig(null);
    reset({ chave: "", valor: "" });
    setModalOpen(true);
  };

  const openEdit = (config: Configuracao) => {
    setEditingConfig(config);
    reset({ chave: config.chave, valor: config.valor });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    if (editingConfig) {
      await atualizarConfig.mutateAsync({ chave: editingConfig.chave, valor: data.valor });
    } else {
      await criarConfig.mutateAsync(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Parâmetros e configurações do sistema
          </p>
        </div>
        <Button variant="gradient" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nova configuração
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : configs?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma configuração encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configs?.map((config) => (
            <Card key={config.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-mono text-primary">{config.chave}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(config)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteChave(config.chave)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm break-all">{config.valor}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? "Editar configuração" : "Nova configuração"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Chave</Label>
              <Input
                placeholder="nome_da_configuracao"
                disabled={!!editingConfig}
                {...register("chave")}
              />
              {errors.chave && <p className="text-xs text-destructive">{errors.chave.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input placeholder="Valor da configuração" {...register("valor")} />
              {errors.valor && <p className="text-xs text-destructive">{errors.valor.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" loading={isSubmitting || criarConfig.isPending || atualizarConfig.isPending}>
                {editingConfig ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteChave} onOpenChange={() => setDeleteChave(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover configuração?</AlertDialogTitle>
            <AlertDialogDescription>
              A chave <strong>{deleteChave}</strong> será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteChave && removerConfig.mutate(deleteChave)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
