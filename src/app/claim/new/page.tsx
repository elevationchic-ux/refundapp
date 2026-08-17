import { requireSession } from "@/lib/session";
import { Header } from "@/components/Header";
import { ClaimWizard } from "./ClaimWizard";

export default async function NewClaimPage() {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header session={session} />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Déclarer un litige</h1>
        <p className="mt-1 text-sm text-slate-500">
          Renseignez la transaction concernée, joignez vos preuves puis validez le
          récapitulatif.
        </p>
        <ClaimWizard />
      </main>
    </div>
  );
}
