"use client";

import { useState } from "react";
import { useChamados, useCriarChamado } from "@/hooks/use-chamados";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Headphones, Eye, Search } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDate, formatRelative } from "@/lib/utils";
import type { Chamado, ChamadoStatus, ChamadoPrioridade } from "@/types";
import Link from "next/link";

const statusVariant: Record<ChamadoStatus, "success" | "warning" | "destructive" | "outline" | "info"> = {
  aberto: "destructive",
  respondido: "info",
  fechado: "outline",
};

const statusLabel: Record<ChamadoStatus, string> = {
  aberto: "Aberto",
  respondido: "Respondido",
  fechado: "Fechado",
};

const prioridadeVariant: Record<ChamadoPrioridade, "destructive" | "warning" | "secondary" | "outline"> = {
  alta: "warning",
  media: "secondary",
  baixa: "outline",
};

const schema = z.object({
  assunto: z.string().min(5, "Assunto deve ter ao menos 5 caracteres"),
  prioridade: z.enum(["baixa", "media", "alta"]),
});

type FormData = z.infer<typeof schema>;

export default function ChamadosPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useChamados({ page, limit: 10 });

  const filteredData = !search.trim()
    ? (data?.data ?? [])
    : (data?.data ?? []).filter((c) =>
        c.assunto.toLowerCase().includes(search.toLowerCase())
      );
  const criarChamado = useCriarChamado();

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { prioridade: "media" },
  });

  const onSubmit = async (data: FormData) => {
    await criarChamado.mutateAsync(data);
    setModalOpen(false);
    reset();
  };

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (row: Chamado) => (
        <span className="text-sm font-mono text-muted-foreground">#{row.id}</span>
      ),
    },
    {
      key: "assunto",
      header: "Assunto",
      cell: (row: Chamado) => (
        <p className="font-medium text-sm max-w-xs truncate">{row.assunto}</p>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Chamado) => (
        <Badge variant={statusVariant[row.status]}>
          {statusLabel[row.status]}
        </Badge>
      ),
    },
    {
      key: "prioridade",
      header: "Prioridade",
      cell: (row: Chamado) => (
        <Badge variant={prioridadeVariant[row.prioridade]}>
          {row.prioridade.charAt(0).toUpperCase() + row.prioridade.slice(1)}
        </Badge>
      ),
    },
    {
      key: "criado_em",
      header: "Aberto",
      cell: (row: Chamado) => (
        <span className="text-xs text-muted-foreground">
          {formatRelative(row.criado_em)}
        </span>
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      cell: (row: Chamado) => (
        <Button size="icon" variant="ghost" asChild>
          <Link href={`/chamados/${row.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="h-6 w-6 text-primary" />
            Chamados de Suporte
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os chamados de suporte
          </p>
        </div>
        <Button variant="gradient" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo chamado
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por assunto..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9 max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        total={search ? filteredData.length : data?.total}
        page={page}
        limit={10}
        onPageChange={setPage}
        emptyMessage="Nenhum chamado encontrado"
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo chamado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Assunto</Label>
              <Input placeholder="Descreva o problema brevemente" {...register("assunto")} />
              {errors.assunto && <p className="text-xs text-destructive">{errors.assunto.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Controller
                control={control}
                name="prioridade"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" loading={isSubmitting}>Criar chamado</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
