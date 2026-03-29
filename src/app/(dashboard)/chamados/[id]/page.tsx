"use client";

import { use, useState } from "react";
import { useChamado, useAdicionarMensagem, useFecharChamado, useAtualizarChamado } from "@/hooks/use-chamados";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, X, Headphones } from "lucide-react";
import Link from "next/link";
import { formatDateTime, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChamadoStatus, ChamadoPrioridade } from "@/types";

const statusLabel: Record<ChamadoStatus, string> = {
  aberto: "Aberto", respondido: "Respondido", fechado: "Fechado",
};

export default function ChamadoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const chamadoId = parseInt(id);
  const { user } = useAuth();
  const [mensagem, setMensagem] = useState("");
  const isAdmin = user?.role === "admin";

  const { data: chamado, isLoading } = useChamado(chamadoId);
  const adicionarMensagem = useAdicionarMensagem(chamadoId);
  const fecharChamado = useFecharChamado();
  const atualizarChamado = useAtualizarChamado();

  const handleSend = async () => {
    if (!mensagem.trim()) return;
    await adicionarMensagem.mutateAsync({ mensagem: mensagem.trim(), interno: false });
    setMensagem("");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!chamado) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/chamados">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Chamado #{chamado.id}</h1>
          <p className="text-sm text-muted-foreground">{chamado.assunto}</p>
        </div>
      </div>

      {/* Chamado info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant={chamado.status === "aberto" ? "destructive" :
                  chamado.status === "fechado" ? "outline" : "warning"}
              >
                {statusLabel[chamado.status]}
              </Badge>
              <Badge variant="outline">{chamado.prioridade}</Badge>
              <span className="text-sm text-muted-foreground">
                {formatDateTime(chamado.criado_em)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Select
                  value={chamado.status}
                  onValueChange={(value) =>
                    atualizarChamado.mutate({ id: chamadoId, data: { status: value as ChamadoStatus } })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aberto">Aberto</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="respondido">Respondido</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {chamado.status !== "fechado" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fecharChamado.mutate(chamadoId)}
                  loading={fecharChamado.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Fechar
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary" />
            Mensagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {!chamado.mensagens || chamado.mensagens.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma mensagem ainda. Inicie a conversa!
              </p>
            ) : (
              chamado.mensagens.map((msg) => {
                const isMe = String(msg.usuario_id) === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={cn("flex gap-3", isMe && "flex-row-reverse")}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs">
                        {msg.usuario?.nome ? getInitials(msg.usuario.nome) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-[75%]", isMe && "items-end flex flex-col")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm",
                          isMe
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted rounded-tl-sm"
                        )}
                      >
                        {msg.mensagem}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(msg.criado_em)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          {chamado.status !== "fechado" && (
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Input
                placeholder="Digite sua mensagem..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button
                variant="gradient"
                onClick={handleSend}
                loading={adicionarMensagem.isPending}
                disabled={!mensagem.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
