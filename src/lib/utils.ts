import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function toDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
  // Unix timestamp (number as string)
  if (/^\d+$/.test(String(date))) return new Date(Number(date) * 1000);
  const d = parseISO(String(date));
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(date: string | Date): string {
  const d = toDate(date);
  return d ? format(d, "dd/MM/yyyy", { locale: ptBR }) : "—";
}

export function formatDateTime(date: string | Date): string {
  const d = toDate(date);
  return d ? format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : "—";
}

export function formatRelative(date: string | Date): string {
  const d = toDate(date);
  return d ? formatDistanceToNow(d, { addSuffix: true, locale: ptBR }) : "—";
}

export function formatDocument(doc: string): string {
  const clean = doc.replace(/\D/g, "");
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (clean.length === 14) {
    return clean.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return doc;
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}
