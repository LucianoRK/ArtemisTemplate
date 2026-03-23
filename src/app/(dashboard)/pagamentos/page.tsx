"use client";

import { useState } from "react";
import { usePagamentos } from "@/hooks/use-pagamentos";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreditCard, Search } from "lucide-react";
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
  const [search, setSearch] = useState("");

  const { data, isLoading } = usePagamentos({ page, limit: 10 });

  const filteredData = !search.trim()
    ? (data?.data ?? [])
    : (data?.data ?? []).filter(
        (p) =>
          p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
          statusLabel[p.status].toLowerCase().includes(search.toLowerCase())
      );

  const totalPago = (data?.data ?? [])
    .filter((p) => p.status === "pago")
    .reduce((acc, p) => acc + p.valor, 0);

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
            {(data?.data ?? []).filter((p) => p.status === "pendente").length}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por transação ou status..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-9 max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        total={search ? filteredData.length : data?.total}
        page={page}
        limit={10}
        onPageChange={setPage}
        emptyMessage="Nenhum pagamento encontrado"
      />
    </div>
  );
}
