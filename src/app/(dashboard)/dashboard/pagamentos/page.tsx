"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pagamentoService } from "@/services/pagamento.service";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Pagamento, PagamentoStatus } from "@/types";

const statusVariant: Record<PagamentoStatus, "success" | "warning" | "destructive" | "outline"> = {
  pago: "success",
  pendente: "warning",
  falhou: "destructive",
  reembolsado: "outline",
};

const statusLabel: Record<PagamentoStatus, string> = {
  pago: "Pago",
  pendente: "Pendente",
  falhou: "Falhou",
  reembolsado: "Reembolsado",
};

export default function PagamentosPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["pagamentos", page],
    queryFn: () => pagamentoService.listar({ page, limit: 10 }),
  });

  const columns = [
    {
      key: "id",
      header: "ID",
      cell: (row: Pagamento) => (
        <span className="text-sm font-mono text-muted-foreground">#{row.id}</span>
      ),
    },
    {
      key: "transaction_id",
      header: "Transação",
      cell: (row: Pagamento) => (
        <span className="text-sm font-mono">{row.transaction_id}</span>
      ),
    },
    {
      key: "valor",
      header: "Valor",
      cell: (row: Pagamento) => (
        <span className="font-semibold">{formatCurrency(row.valor)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row: Pagamento) => (
        <Badge variant={statusVariant[row.status]}>
          {statusLabel[row.status]}
        </Badge>
      ),
    },
    {
      key: "data_pagamento",
      header: "Data",
      cell: (row: Pagamento) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.data_pagamento)}
        </span>
      ),
    },
  ];

  const totalPago = data?.data
    .filter((p) => p.status === "pago")
    .reduce((acc, p) => acc + p.valor, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Pagamentos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Histórico de pagamentos e transações
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total recebido</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(totalPago)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Transações</p>
          <p className="text-2xl font-bold mt-1">{data?.total ?? 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold mt-1">
            {data?.data.filter((p) => p.status === "pendente").length ?? 0}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        total={data?.total}
        page={page}
        limit={10}
        onPageChange={setPage}
        emptyMessage="Nenhum pagamento encontrado"
      />
    </div>
  );
}
