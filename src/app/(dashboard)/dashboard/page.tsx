"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { StatsCard } from "@/components/shared/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, CreditCard, Headphones, TrendingUp, Activity } from "lucide-react";
import { useUsuarios } from "@/hooks/use-usuarios";
import { useEmpresas } from "@/hooks/use-empresa";
import { useChamados } from "@/hooks/use-chamados";
import { formatCurrency, formatRelative } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { pagamentoService } from "@/services/pagamento.service";
import { assinaturaService } from "@/services/assinatura.service";
import { subMonths, format, differenceInCalendarMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: usuarios, isLoading: loadingUsuarios } = useUsuarios();
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresas();
  const { data: chamados, isLoading: loadingChamados } = useChamados({ limit: 5 });
  const { data: pagamentos, isLoading: loadingPagamentos } = useQuery({
    queryKey: ["pagamentos", "recentes"],
    queryFn: () => pagamentoService.listar({ limit: 5 }),
  });
  const { data: assinatura } = useQuery({
    queryKey: ["assinatura", "ativa"],
    queryFn: () => assinaturaService.ativa(),
  });

  const { data: pagamentosChart } = useQuery({
    queryKey: ["pagamentos", "chart"],
    queryFn: () => pagamentoService.listar({ page: 1, limit: 200 }),
  });

  const chartData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, 5 - i);
      return { mes: format(date, "MMM", { locale: ptBR }), receita: 0 };
    });

    (pagamentosChart?.data ?? [])
      .filter((p) => p.status === "pago" && p.data_pagamento)
      .forEach((p) => {
        const monthsAgo = differenceInCalendarMonths(now, new Date(p.data_pagamento));
        if (monthsAgo >= 0 && monthsAgo < 6) {
          months[5 - monthsAgo].receita += p.valor;
        }
      });

    return months;
  }, [pagamentosChart]);

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Bem-vindo ao painel de controle. Aqui está um resumo do seu sistema.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total de Usuários"
          value={usuarios?.total ?? 0}
          icon={Users}
          variant="primary"
          isLoading={loadingUsuarios}
          trend={{ value: 12, label: "este mês" }}
        />
        <StatsCard
          title="Empresas"
          value={empresas?.total ?? 0}
          icon={Building2}
          variant="success"
          isLoading={loadingEmpresas}
        />
        <StatsCard
          title="Chamados Abertos"
          value={chamados?.data.filter((c) => c.status === "aberto").length ?? 0}
          icon={Headphones}
          variant="warning"
          isLoading={loadingChamados}
        />
        <StatsCard
          title="Receita do Mês"
          value={formatCurrency(
            pagamentos?.data
              .filter((p) => p.status === "pago")
              .reduce((acc, p) => acc + p.valor, 0) ?? 0
          )}
          icon={CreditCard}
          variant="default"
          isLoading={loadingPagamentos}
          trend={{ value: 8.5, label: "vs mês anterior" }}
        />
      </div>

      {/* Assinatura banner */}
      {assinatura && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  Plano {assinatura.plano?.nome ?? "Ativo"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ativo até {assinatura.data_fim ? new Date(assinatura.data_fim).toLocaleDateString("pt-BR") : "—"}
                </p>
              </div>
            </div>
            <Badge variant="success">Ativo</Badge>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Receita dos últimos 6 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Receita"]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorReceita)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />
              Chamados Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingChamados ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
              ))
            ) : chamados?.data.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum chamado encontrado
              </p>
            ) : (
              chamados?.data.slice(0, 5).map((chamado) => (
                <div
                  key={chamado.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{chamado.assunto}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelative(chamado.criado_em)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      chamado.status === "aberto"
                        ? "destructive"
                        : chamado.status === "fechado"
                        ? "outline"
                        : "warning"
                    }
                    className="shrink-0"
                  >
                    {chamado.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
