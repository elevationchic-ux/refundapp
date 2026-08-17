import Link from "next/link";
import { logout } from "@/app/actions/auth";
import type { SessionPayload } from "@/lib/session";

export function Header({ session }: { session: SessionPayload }) {
  const isStaff = session.role === "ADMIN" || session.role === "AGENT";
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
            LitigeFlow
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-slate-900">
              Mes litiges
            </Link>
            <Link href="/claim/new" className="hover:text-slate-900">
              Nouveau litige
            </Link>
            {isStaff && (
              <Link href="/admin" className="hover:text-slate-900">
                Administration
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-500">
            {session.name} · {session.role}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
