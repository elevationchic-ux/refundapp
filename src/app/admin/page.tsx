import Link from "next/link";
import type { ClaimStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import {
  CLAIM_STATUSES,
  STATUS_LABELS,
  formatAmount,
  formatDate,
} from "@/lib/claims";
import { assignAgent, updateClaimStatus } from "@/app/actions/claims";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  status?: string;
  sort?: string;
  dir?: string;
};

const SORTABLE = ["date", "amount", "status", "createdAt"] as const;
type SortKey = (typeof SORTABLE)[number];

function buildQuery(params: SearchParams, overrides: Partial<SearchParams>) {
  const merged = { ...params, ...overrides };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) query.set(key, value);
  }
  const qs = query.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireRole("ADMIN", "AGENT");
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const statusFilter = CLAIM_STATUSES.includes(params.status as ClaimStatus)
    ? (params.status as ClaimStatus)
    : undefined;
  const sort: SortKey = SORTABLE.includes(params.sort as SortKey)
    ? (params.sort as SortKey)
    : "createdAt";
  const dir: "asc" | "desc" = params.dir === "asc" ? "asc" : "desc";

  const where: Prisma.ClaimWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(q
      ? {
          OR: [
            { description: { contains: q, mode: "insensitive" } },
            { reference: { contains: q, mode: "insensitive" } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { user: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [claims, agents, total] = await Promise.all([
    prisma.claim.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        agent: { select: { id: true, name: true } },
        evidence: { select: { id: true, fileName: true } },
      },
      orderBy: { [sort]: dir },
    }),
    prisma.user.findMany({
      where: { role: { in: ["AGENT", "ADMIN"] } },
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    }),
    prisma.claim.count(),
  ]);

  const isAdmin = session.role === "ADMIN";

  function sortLink(key: SortKey, label: string) {
    const nextDir = sort === key && dir === "desc" ? "asc" : "desc";
    const arrow = sort === key ? (dir === "desc" ? " ↓" : " ↑") : "";
    return (
      <Link
        href={buildQuery(params, { sort: key, dir: nextDir })}
        className="hover:text-slate-900"
      >
        {label}
        {arrow}
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header session={session} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Gestion des réclamations
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {claims.length} réclamation(s) affichée(s) sur {total}.
            </p>
          </div>

          {/* Recherche et filtres */}
          <form method="GET" action="/admin" className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher (client, e-mail, référence…)"
              className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <select
              name="status"
              defaultValue={statusFilter ?? ""}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Tous les statuts</option>
              {CLAIM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Filtrer
            </button>
            {(q || statusFilter) && (
              <Link href="/admin" className="text-sm text-slate-500 hover:underline">
                Réinitialiser
              </Link>
            )}
          </form>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">{sortLink("amount", "Montant")}</th>
                <th className="px-4 py-3">{sortLink("date", "Date transaction")}</th>
                <th className="px-4 py-3">{sortLink("createdAt", "Déposé le")}</th>
                <th className="px-4 py-3">Preuves</th>
                <th className="px-4 py-3">{sortLink("status", "Statut")}</th>
                <th className="px-4 py-3">Agent assigné</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                    Aucune réclamation ne correspond à ces critères.
                  </td>
                </tr>
              )}
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{claim.user.name}</p>
                    <p className="text-xs text-slate-400">{claim.user.email}</p>
                    {claim.reference && (
                      <p className="text-xs text-slate-400">Réf. {claim.reference}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {formatAmount(claim.amount.toNumber(), claim.currency)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(claim.date)}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(claim.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {claim.evidence.length === 0 ? (
                      <span className="text-xs text-slate-400">Aucune</span>
                    ) : (
                      <ul className="space-y-0.5">
                        {claim.evidence.map((ev) => (
                          <li key={ev.id}>
                            <a
                              href={`/api/evidence/${ev.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-indigo-600 hover:underline"
                            >
                              {ev.fileName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <StatusBadge status={claim.status} />
                      <form action={updateClaimStatus} className="flex items-center gap-1">
                        <input type="hidden" name="claimId" value={claim.id} />
                        <select
                          name="status"
                          defaultValue={claim.status}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                        >
                          {CLAIM_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700"
                        >
                          OK
                        </button>
                      </form>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <form action={assignAgent} className="flex items-center gap-1">
                        <input type="hidden" name="claimId" value={claim.id} />
                        <select
                          name="agentId"
                          defaultValue={claim.agent?.id ?? ""}
                          className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="">Non assigné</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name} ({agent.role})
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700"
                        >
                          OK
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-slate-500">
                        {claim.agent?.name ?? "Non assigné"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
