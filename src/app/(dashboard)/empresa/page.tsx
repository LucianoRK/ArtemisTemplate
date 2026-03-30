"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { empresaService } from "@/services/empresa.service";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { formatDocument, formatPhone, getApiErrorMessage } from "@/lib/utils";
import { useEffect } from "react";

const schema = z.object({
  nome: z.string().refine((v) => !v || v.length >= 2, "Mínimo 2 caracteres"),
  documento: z.string(),
  email: z.string().refine((v) => !v || z.string().email().safeParse(v).success, "Email inválido"),
  telefone: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function EmpresaPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "admin";

  const { data: empresa, isLoading } = useQuery({
    queryKey: ["empresa", user?.empresa_id],
    queryFn: () => empresaService.buscarPorId(user!.empresa_id!),
    enabled: !!user?.empresa_id,
  });

  const atualizar = useMutation({
    mutationFn: (data: Partial<FormData>) => empresaService.atualizar(user!.empresa_id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresa", user?.empresa_id] });
      toast.success("Empresa atualizada com sucesso!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Erro ao atualizar empresa")),
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (empresa) {
      reset({
        nome: empresa.nome ?? "",
        documento: empresa.documento ?? "",
        email: empresa.email ?? "",
        telefone: empresa.telefone ?? "",
      });
    }
  }, [empresa, reset]);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Minha Empresa
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdmin ? "Gerencie as informações da sua empresa" : "Informações da sua empresa"}
        </p>
      </div>

      {/* Info card */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-lg">{empresa?.nome}</p>
                <p className="text-sm text-muted-foreground">{empresa?.documento ? formatDocument(empresa.documento) : "—"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={!empresa?.excluido_em ? "success" : "outline"}>
                    {!empresa?.excluido_em ? "Ativa" : "Inativa"}
                  </Badge>
                  {isAdmin && (
                    <Badge variant="secondary">Administrador</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details / Edit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações da empresa</CardTitle>
          <CardDescription>
            {isAdmin ? "Atualize os dados cadastrais da empresa" : "Dados cadastrais da empresa"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : isAdmin ? (
            <form onSubmit={handleSubmit((data) => atualizar.mutateAsync(Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ""))))} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da empresa</Label>
                <Input placeholder="Nome da empresa" {...register("nome")} />
                {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>CPF / CNPJ</Label>
                <Input placeholder="000.000.000-00 ou 00.000.000/0001-00" {...register("documento")} />
                {errors.documento && <p className="text-xs text-destructive">{errors.documento.message}</p>}
              </div>
              <Separator />
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
              <Button type="submit" variant="gradient" loading={isSubmitting || atualizar.isPending}>
                Salvar alterações
              </Button>
            </form>
          ) : (
            <dl className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-muted-foreground">Nome</dt>
                <dd className="col-span-2 text-sm font-medium">{empresa?.nome ?? "—"}</dd>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-muted-foreground">CPF / CNPJ</dt>
                <dd className="col-span-2 text-sm font-medium">
                  {empresa?.documento ? formatDocument(empresa.documento) : "—"}
                </dd>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="col-span-2 text-sm font-medium">{empresa?.email ?? "—"}</dd>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-2">
                <dt className="text-sm text-muted-foreground">Telefone</dt>
                <dd className="col-span-2 text-sm font-medium">
                  {empresa?.telefone ? formatPhone(empresa.telefone) : "—"}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
