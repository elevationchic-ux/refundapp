import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { Header } from "@/components/Header";
import { StatusBadge } from "@/components/StatusBadge";
import { formatAmount, formatDate } from "@/lib/claims";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Résolution simple de la locale depuis les cookies next-intl (sans dépendance au routing [locale])
async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("NEXT_LOCALE")?.value ?? "fr";
}

const LABELS = {
  fr: {
    title:       "Mes litiges",
    subtitle:    "Suivez l'avancement de vos demandes de remboursement.",
    newClaim:    "Déclarer un litige",
    submitted:   "Votre litige a bien été soumis. Notre équipe va l'examiner.",
    empty:       "Vous n'avez aucun litige pour le moment.",
    firstClaim:  "Déclarer mon premier litige",
    filed:       "Déposé le",
    transaction: "Transaction du",
    ref:         "Réf.",
  },
  en: {
    title:       "My Cases",
    subtitle:    "Track the progress of your refund requests.",
    newClaim:    "File a Claim",
    submitted:   "Your case has been submitted. Our team will review it shortly.",
    empty:       "You have no active cases yet.",
    firstClaim:  "File My First Claim",
    filed:       "Filed on",
    transaction: "Transaction on",
    ref:         "Ref.",
  },
  es: {
    title:       "Mis reclamaciones",
    subtitle:    "Sigue el progreso de tus solicitudes de reembolso.",
    newClaim:    "Presentar reclamación",
    submitted:   "Tu caso ha sido enviado. Nuestro equipo lo revisará pronto.",
    empty:       "Aún no tienes casos activos.",
    firstClaim:  "Presentar mi primera reclamación",
    filed:       "Presentado el",
    transaction: "Transacción del",
    ref:         "Ref.",
  },
  de: {
    title:       "Meine Anträge",
    subtitle:    "Verfolgen Sie den Fortschritt Ihrer Erstattungsanfragen.",
    newClaim:    "Antrag stellen",
    submitted:   "Ihr Antrag wurde eingereicht. Unser Team wird ihn prüfen.",
    empty:       "Sie haben noch keine aktiven Anträge.",
    firstClaim:  "Meinen ersten Antrag stellen",
    filed:       "Eingereicht am",
    transaction: "Transaktion vom",
    ref:         "Ref.",
  },
} as const;

type Locale = keyof typeof LABELS;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const session = await requireSession();
  const locale  = (await getLocale()) as Locale;
  const { submitted } = await searchParams;

  const claims = await prisma.claim.findMany({
    where: { userId: session.userId },
    include: { evidence: { select: { id: true, fileName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const L = LABELS[locale] ?? LABELS.fr;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header session={session} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Entête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{L.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{L.subtitle}</p>
          </div>
          <Link
            href={`/${locale}/claim/new`}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            {L.newClaim}
          </Link>
        </div>

        {/* Message de succès */}
        {submitted && (
          <div className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            {L.submitted}
          </div>
        )}

        {/* Liste des dossiers */}
        {claims.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">{L.empty}</p>
            <Link
              href={`/${locale}/claim/new`}
              className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
            >
              {L.firstClaim}
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {claims.map((claim) => (
              <article
                key={claim.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-lg font-semibold text-slate-900">
                    {formatAmount(claim.amount.toNumber(), claim.currency)}
                  </span>
                  <StatusBadge status={claim.status} />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {L.transaction} {formatDate(claim.date)}
                  {claim.reference ? ` · ${L.ref} ${claim.reference}` : ""}
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
                  {L.filed} {formatDate(claim.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
