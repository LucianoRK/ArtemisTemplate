"use client";

import { useState } from "react";
import { useUsuarios, useCriarUsuario, useAtualizarUsuario, useRemoverUsuario } from "@/hooks/use-usuarios";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getInitials, formatDate } from "@/lib/utils";
import type { Usuario } from "@/types";

const schema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  role: z.enum(["admin", "membro"]),
});

type FormData = z.infer<typeof schema>;

export default function UsuariosPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const { data, isLoading } = useUsuarios({ page, limit: 10 });
  const criarUsuario = useCriarUsuario();
  const atualizarUsuario = useAtualizarUsuario();
  const removerUsuario = useRemoverUsuario();

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "membro" },
  });

  const openCreate = () => {
    setEditingUser(null);
    reset({ nome: "", email: "", senha: "", role: "membro" });
    setModalOpen(true);
  };

  const openEdit = (user: Usuario) => {
    setEditingUser(user);
    reset({ nome: user.nome, email: user.email, senha: "", role: user.role });
    setModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    if (editingUser) {
      await atualizarUsuario.mutateAsync({
        id: editingUser.id,
        data: { nome: data.nome, email: data.email, role: data.role, ...(data.senha ? { senha: data.senha } : {}) },
      });
    } else {
      await criarUsuario.mutateAsync({
        nome: data.nome,
        email: data.email,
        senha: data.senha!,
        role: data.role,
      });
    }
    setModalOpen(false);
    reset();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await removerUsuario.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "nome",
      header: "Usuário",
      cell: (row: Usuario) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{getInitials(row.nome)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.nome}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Papel",
      cell: (row: Usuario) => (
        <Badge variant={row.role === "admin" ? "default" : "secondary"}>
          {row.role === "admin" ? "Administrador" : "Membro"}
        </Badge>
      ),
    },
    {
      key: "ativo",
      header: "Status",
      cell: (row: Usuario) => (
        <Badge variant={row.ativo ? "success" : "outline"}>
          {row.ativo ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      key: "criado_em",
      header: "Criado em",
      cell: (row: Usuario) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.criado_em)}
        </span>
      ),
    },
    {
      key: "acoes",
      header: "Ações",
      cell: (row: Usuario) => (
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
            <Users className="h-6 w-6 text-primary" />
            Usuários
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os usuários da plataforma
          </p>
        </div>
        <Button variant="gradient" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={page}
        limit={10}
        onPageChange={setPage}
        emptyMessage="Nenhum usuário encontrado"
      />

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar usuário" : "Novo usuário"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Nome completo" {...register("nome")} />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@empresa.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>{editingUser ? "Nova senha (opcional)" : "Senha"}</Label>
              <Input type="password" placeholder="••••••••" {...register("senha")} />
              {errors.senha && <p className="text-xs text-destructive">{errors.senha.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Papel</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="membro">Membro</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="gradient" loading={isSubmitting}>
                {editingUser ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
