"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  nova_senha: z.string().min(6, "Mínimo 6 caracteres"),
  confirmar_senha: z.string(),
}).refine((data) => data.nova_senha === data.confirmar_senha, {
  message: "Senhas não conferem",
  path: ["confirmar_senha"],
});

type FormData = z.infer<typeof schema>;

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.redefinirSenha(token, data.nova_senha);
      toast.success("Senha redefinida com sucesso!");
      router.push("/login");
    } catch {
      toast.error("Link inválido ou expirado");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nova_senha">Nova senha</Label>
        <Input
          id="nova_senha"
          type="password"
          placeholder="••••••••"
          startIcon={<Lock className="h-4 w-4" />}
          {...register("nova_senha")}
        />
        {errors.nova_senha && (
          <p className="text-xs text-destructive">{errors.nova_senha.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmar_senha">Confirmar nova senha</Label>
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

      <Button type="submit" className="w-full" variant="gradient" loading={isSubmitting}>
        Redefinir senha
      </Button>
    </form>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold">Nova senha</CardTitle>
        <CardDescription>
          Crie uma nova senha para sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <RedefinirSenhaForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
