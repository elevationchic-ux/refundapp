import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAmount, formatDate } from "@/lib/claims";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const session = await requireSession();
  const { submitted } = await searchParams;

  const claims = await prisma.claim.findMany({
    where: { userId: session.userId },
    include: { evidence: { select: { id: true, fileName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header session={session} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Mes litiges</h1>
            <p className="mt-1 text-sm text-slate-500">
              Suivez l&apos;avancement de vos demandes de remboursement.
            </p>
          </div>
          <Link
            href="/claim/new"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Déclarer un litige
          </Link>
        </div>

        {submitted && (
          <p className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Votre litige a bien été soumis. Notre équipe va l&apos;examiner.
          </p>
        )}

        {claims.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">Vous n&apos;avez aucun litige pour le moment.</p>
            <Link
              href="/claim/new"
              className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Déclarer mon premier litige
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {claims.map((claim) => (
              <article
                key={claim.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg font-semibold text-slate-900">
                    {formatAmount(claim.amount.toNumber(), claim.currency)}
                  </span>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Transaction du {formatDate(claim.date)}
                  {claim.reference ? ` · Réf. ${claim.reference}` : ""}
                </p>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">
                  {claim.description}
                </p>
                {claim.evidence.length > 0 && (
                  <ul className="mt-3 space-y-1">
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
                <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                  Déposé le {formatDate(claim.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
