"use client";

import { useState } from "react";
import { useNotificacoes, useMarcarComoLida, useMarcarTodasComoLidas } from "@/hooks/use-notificacoes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import type { NotificacaoTipo } from "@/types";
import { cn } from "@/lib/utils";

const tipoConfig: Record<NotificacaoTipo, {
  icon: React.ElementType;
  variant: "info" | "success" | "warning" | "destructive";
  label: string;
}> = {
  info: { icon: Info, variant: "info", label: "Informação" },
  sucesso: { icon: CheckCircle2, variant: "success", label: "Sucesso" },
  aviso: { icon: AlertTriangle, variant: "warning", label: "Aviso" },
  erro: { icon: XCircle, variant: "destructive", label: "Erro" },
};

export default function NotificacoesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificacoes({ page, limit: 20 });
  const marcarLida = useMarcarComoLida();
  const marcarTodas = useMarcarTodasComoLidas();

  const unreadCount = data?.data.filter((n) => !n.lida).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} novas</Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe todas as suas notificações
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => marcarTodas.mutate()}
            loading={marcarTodas.isPending}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhuma notificação encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.data.map((notificacao) => {
            const config = tipoConfig[notificacao.tipo] || tipoConfig.info;
            const Icon = config.icon;

            return (
              <Card
                key={notificacao.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-sm cursor-default",
                  !notificacao.lida && "border-primary/30 bg-primary/5"
                )}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                      config.variant === "info" && "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                      config.variant === "success" && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                      config.variant === "warning" && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                      config.variant === "destructive" && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={cn("text-sm font-medium", !notificacao.lida && "font-semibold")}>
                          {notificacao.titulo}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {notificacao.mensagem}
                        </p>
                      </div>
                      {!notificacao.lida && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="shrink-0"
                          onClick={() => marcarLida.mutate(notificacao.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formatRelative(notificacao.criado_em)}
                    </p>
                  </div>
                  {!notificacao.lida && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= (data?.totalPages ?? 1)}
            onClick={() => setPage(p => p + 1)}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
