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
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

const schema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  confirmar_senha: z.string(),
  aceitar_termos: z.literal(true, { errorMap: () => ({ message: "Você deve aceitar os termos para continuar" }) }),
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
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

          <div className="space-y-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border border-input accent-primary cursor-pointer"
                {...register("aceitar_termos")}
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                Li e aceito os{" "}
                <Link href="/termos" target="_blank" className="text-primary hover:underline">
                  Termos de Uso
                </Link>
                {" "}e a{" "}
                <Link href="/privacidade" target="_blank" className="text-primary hover:underline">
                  Política de Privacidade
                </Link>
              </span>
            </label>
            {errors.aceitar_termos && (
              <p className="text-xs text-destructive pl-6">{errors.aceitar_termos.message}</p>
            )}
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
