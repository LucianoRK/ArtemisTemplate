"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { assinaturaService } from "@/services/assinatura.service";
import { planoService } from "@/services/plano.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Zap, Crown, Building } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Plano } from "@/types";

const planIcons: Record<string, React.ElementType> = {
  Starter: Zap,
  Pro: Crown,
  Enterprise: Building,
};

export default function AssinaturaPage() {
  const { data: assinatura, isLoading: loadingAssinatura } = useQuery({
    queryKey: ["assinatura", "ativa"],
    queryFn: () => assinaturaService.ativa(),
  });

  const { data: planos, isLoading: loadingPlanos } = useQuery({
    queryKey: ["planos"],
    queryFn: () => planoService.listar(),
  });

  const assinar = useMutation({
    mutationFn: async (plano: Plano) => {
      const { init_point } = await assinaturaService.checkout(plano.id);
      window.open(init_point, "_blank");
    },
    onError: () => toast.error("Erro ao iniciar pagamento"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Assinatura
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie seu plano e assinatura
        </p>
      </div>

      {/* Current plan */}
      {loadingAssinatura ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ) : assinatura ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg">
                      Plano {assinatura.plano?.nome ?? "Ativo"}
                    </h2>
                    <Badge variant="success">Ativo</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Válido até {formatDate(assinatura.data_fim)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {formatCurrency(assinatura.plano?.preco ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  /{assinatura.plano?.intervalo === "anual" ? "ano" : "mês"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Você não possui uma assinatura ativa.</p>
          </CardContent>
        </Card>
      )}

      {/* Available plans */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Planos disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingPlanos ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            planos?.map((plano) => {
              const Icon = planIcons[plano.nome] || Zap;
              const isCurrentPlan = assinatura?.plano_id === plano.id;

              return (
                <Card
                  key={plano.id}
                  className={`flex flex-col ${isCurrentPlan ? "border-primary shadow-lg shadow-primary/10" : ""}`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Plano atual</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">{plano.nome}</CardTitle>
                    </div>
                    <CardDescription>{plano.descricao}</CardDescription>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-bold">{formatCurrency(plano.preco)}</span>
                      <span className="text-sm text-muted-foreground">
                        /{plano.intervalo === "anual" ? "ano" : "mês"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <ul className="space-y-2 flex-1">
                      {plano.recursos?.map((recurso) => (
                        <li key={recurso} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          {recurso}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isCurrentPlan ? "outline" : "gradient"}
                      disabled={isCurrentPlan}
                      loading={assinar.isPending}
                      onClick={() => assinar.mutate(plano)}
                      className="w-full"
                    >
                      {isCurrentPlan ? "Plano atual" : "Assinar"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
