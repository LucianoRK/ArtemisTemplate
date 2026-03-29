"use client";

import { useState } from "react";
import { useEmpresas, useCriarEmpresa, useAtualizarEmpresa, useRemoverEmpresa } from "@/hooks/use-empresa";
import { useAdminGuard } from "@/hooks/use-admin-guard";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Building2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatDate } from "@/lib/utils";
import type { Empresa } from "@/types";

const schema = z.object({
  nome: z.string().refine((v) => !v || v.length >= 2, "Mínimo 2 caracteres"),
  documento: z.string(),
  email: z.string().refine((v) => !v || z.string().email().safeParse(v).success, "Email inválido"),
  telefone: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function EmpresasPage() {
  const { isAdmin, initialized } = useAdminGuard();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  if (!initialized || !isAdmin) return null;
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  const { data, isLoading } = useEmpresas({ page, limit: 10 });

  const filteredData = !search.trim()
    ? (data?.data ?? [])
    : (data?.data ?? []).filter(
        (e) =>
          e.nome?.toLowerCase().includes(search.toLowerCase()) ||
          e.email?.toLowerCase().includes(search.toLowerCase()) ||
          e.documento?.includes(search)
      );
  const criarEmpresa = useCriarEmpresa();
  const atualizarEmpresa = useAtualizarEmpresa();
  const removerEmpresa = useRemoverEmpresa();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditingEmpresa(null);
    reset({ nome: "", documento: "", email: "", telefone: "" });
    setModalOpen(true);
  };

  const openEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    reset({
      nome: empresa.nome ?? "",
      documento: empresa.documento ?? "",
      email: empresa.email ?? "",
      telefone: empresa.telefone ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "")
    );
    if (editingEmpresa) {
      await atualizarEmpresa.mutateAsync({ id: editingEmpresa.id, data: payload });
    } else {
      await criarEmpresa.mutateAsync(payload);
    }
    setModalOpen(false);
    reset();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await removerEmpresa.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "nome",
      header: "Empresa",
      cell: (row: Empresa) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">{row.nome ?? "—"}</p>
            <p className="text-xs text-muted-foreground">{row.documento ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Contato",
      cell: (row: Empresa) => (
        <div>
          <p className="text-sm">{row.email}</p>
          <p className="text-xs text-muted-foreground">{row.telefone}</p>
        </div>
      ),
    },
    {
      key: "ativo",
      header: "Status",
      cell: (row: Empresa) => (
        <Badge variant={!row.deleted_at ? "success" : "outline"}>
          {!row.deleted_at ? "Ativa" : "Inativa"}
        </Badge>
      ),
    },
    {
      key: "criado_em",
      header: "Criada em",
      cell: (row: Empresa) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.criado_em)}</span>
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      cell: (row: Empresa) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(row.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Empresas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie as empresas cadastradas</p>
        </div>
        <Button variant="gradient" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nova empresa
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email ou documento..."
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
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEmpresa ? "Editar empresa" : "Nova empresa"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Nome da empresa" {...register("nome")} />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>CPF / CNPJ</Label>
              <Input placeholder="000.000.000-00 ou 00.000.000/0001-00" {...register("documento")} />
              {errors.documento && <p className="text-xs text-destructive">{errors.documento.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="contato@empresa.com" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input placeholder="(11) 99999-9999" {...register("telefone")} />
                {errors.telefone && <p className="text-xs text-destructive">{errors.telefone.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" variant="gradient" loading={isSubmitting}>
                {editingEmpresa ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover empresa?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleDelete}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
