import type { ClaimStatus } from "@prisma/client";

export const CLAIM_STATUSES: ClaimStatus[] = [
  "PENDING",
  "INVESTIGATING",
  "RESOLVED",
  "REJECTED",
];

export const STATUS_LABELS: Record<ClaimStatus, string> = {
  PENDING: "En attente",
  INVESTIGATING: "En cours d'examen",
  RESOLVED: "Résolu",
  REJECTED: "Rejeté",
};

export const STATUS_STYLES: Record<ClaimStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 ring-amber-600/20",
  INVESTIGATING: "bg-blue-100 text-blue-800 ring-blue-600/20",
  RESOLVED: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  REJECTED: "bg-red-100 text-red-800 ring-red-600/20",
};

export function formatAmount(amount: number, currency: string = "EUR") {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(
    amount
  );
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date);
}
