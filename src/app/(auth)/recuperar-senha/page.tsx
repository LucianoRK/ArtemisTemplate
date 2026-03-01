"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof schema>;

export default function RecuperarSenhaPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.recuperarSenha(data.email);
      setSent(true);
    } catch {
      toast.error("Erro ao enviar email de recuperação");
    }
  };

  if (sent) {
    return (
      <Card className="border-0 shadow-none text-center">
        <CardContent className="pt-12 pb-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Email enviado!</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Enviamos um link de recuperação para o seu email. Verifique também
            sua caixa de spam.
          </p>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Recuperar senha</CardTitle>
        <CardDescription>
          Informe seu email e enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" variant="gradient" loading={isSubmitting}>
            Enviar link de recuperação
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Voltar ao login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
