"use client";

import { useUsuarioPerfil, useAtualizarUsuario } from "@/hooks/use-usuarios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getInitials } from "@/lib/utils";
import { useEffect } from "react";

const schema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export default function PerfilPage() {
  const { data: perfil, isLoading } = useUsuarioPerfil();
  const atualizarUsuario = useAtualizarUsuario();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (perfil) {
      reset({ nome: perfil.nome, email: perfil.email, senha: "" });
    }
  }, [perfil, reset]);

  const onSubmit = async (data: FormData) => {
    if (!perfil) return;
    await atualizarUsuario.mutateAsync({
      id: perfil.id,
      data: {
        nome: data.nome,
        email: data.email,
        ...(data.senha ? { senha: data.senha } : {}),
      },
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Meu Perfil
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Avatar section */}
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {perfil?.nome ? getInitials(perfil.nome) : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{perfil?.nome}</p>
            <p className="text-muted-foreground text-sm">{perfil?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={perfil?.role === "admin" ? "default" : "secondary"}>
                <Shield className="h-3 w-3 mr-1" />
                {perfil?.role === "admin" ? "Administrador" : "Membro"}
              </Badge>
              <Badge variant={perfil?.ativo ? "success" : "outline"}>
                {perfil?.ativo ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações pessoais</CardTitle>
          <CardDescription>Atualize suas informações de perfil</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input placeholder="Seu nome" {...register("nome")} />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="seu@email.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Nova senha (opcional)</Label>
              <Input type="password" placeholder="Deixe em branco para manter" {...register("senha")} />
              {errors.senha && <p className="text-xs text-destructive">{errors.senha.message}</p>}
            </div>

            <Button type="submit" variant="gradient" loading={isSubmitting}>
              Salvar alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
