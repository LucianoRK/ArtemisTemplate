"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User, Building2, Phone, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

function validarCNPJ(cnpj: string): boolean {
  const c = cnpj.replace(/\D/g, "");
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const calc = (len: number) => {
    let sum = 0;
    let pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(c[len - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };
  return calc(12) === parseInt(c[12]) && calc(13) === parseInt(c[13]);
}

const schema = z.object({
  empresa_nome: z.string().min(2, "Nome da empresa obrigatório"),
  empresa_documento: z
    .string()
    .min(1, "CNPJ obrigatório")
    .refine((v) => validarCNPJ(v), "CNPJ inválido"),
  empresa_email: z.string().email("Email inválido"),
  empresa_telefone: z
    .string()
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Telefone inválido"),
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Deve conter ao menos uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter ao menos um número"),
  confirmar_senha: z.string(),
}).refine((data) => data.senha === data.confirmar_senha, {
  message: "Senhas não conferem",
  path: ["confirmar_senha"],
});

type FormData = z.infer<typeof schema>;

export default function RegistroPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.registro({
        empresa_nome: data.empresa_nome,
        empresa_documento: data.empresa_documento,
        empresa_email: data.empresa_email,
        empresa_telefone: data.empresa_telefone,
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, senha: data.senha }),
      });

      if (!res.ok) {
        toast.error("Erro ao fazer login após o cadastro");
        router.push("/login");
        return;
      }

      const { user, token } = await res.json();
      setAuth(user, token);

      toast.success("Conta criada com sucesso! Bem-vindo ao Artemis!");
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao criar conta. Verifique os dados e tente novamente.");
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
        <CardDescription>
          Crie sua conta e comece a usar em menos de 5 minutos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Company section */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dados da Empresa
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa_nome">Nome da empresa</Label>
              <Input
                id="empresa_nome"
                placeholder="Minha Empresa Ltda"
                startIcon={<Building2 className="h-4 w-4" />}
                {...register("empresa_nome")}
              />
              {errors.empresa_nome && (
                <p className="text-xs text-destructive">{errors.empresa_nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa_documento">CNPJ</Label>
              <Input
                id="empresa_documento"
                placeholder="00.000.000/0001-00"
                startIcon={<FileText className="h-4 w-4" />}
                {...register("empresa_documento")}
              />
              {errors.empresa_documento && (
                <p className="text-xs text-destructive">{errors.empresa_documento.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa_email">Email comercial</Label>
                <Input
                  id="empresa_email"
                  type="email"
                  placeholder="contato@empresa.com"
                  startIcon={<Mail className="h-4 w-4" />}
                  {...register("empresa_email")}
                />
                {errors.empresa_email && (
                  <p className="text-xs text-destructive">{errors.empresa_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="empresa_telefone">Telefone</Label>
                <Input
                  id="empresa_telefone"
                  placeholder="(11) 99999-9999"
                  startIcon={<Phone className="h-4 w-4" />}
                  {...register("empresa_telefone")}
                />
                {errors.empresa_telefone && (
                  <p className="text-xs text-destructive">{errors.empresa_telefone.message}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dados do Administrador
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Seu nome completo</Label>
              <Input
                id="nome"
                placeholder="João Silva"
                startIcon={<User className="h-4 w-4" />}
                {...register("nome")}
              />
              {errors.nome && (
                <p className="text-xs text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@empresa.com"
                startIcon={<Mail className="h-4 w-4" />}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  startIcon={<Lock className="h-4 w-4" />}
                  {...register("senha")}
                />
                {errors.senha && (
                  <p className="text-xs text-destructive">{errors.senha.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmar_senha">Confirmar senha</Label>
                <Input
                  id="confirmar_senha"
                  type="password"
                  placeholder="••••••••"
                  startIcon={<Lock className="h-4 w-4" />}
                  {...register("confirmar_senha")}
                />
                {errors.confirmar_senha && (
                  <p className="text-xs text-destructive">{errors.confirmar_senha.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" variant="gradient" loading={isSubmitting}>
            Criar conta grátis
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
