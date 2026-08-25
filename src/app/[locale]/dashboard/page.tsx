import { requireSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { ClaimStatusBadge } from '@/components/ClaimStatusBadge';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await requireSession();

  // Fetch user's claims
  const claims = await prisma.claim.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Calculate stats
  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === 'PENDING').length;
  const resolvedClaims = claims.filter(c => c.status === 'RESOLVED').length;
  const totalAmount = claims.reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon espace</h1>
          <p className="mt-2 text-gray-600">
            Bienvenue, {session.name || 'Utilisateur'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total dossiers</p>
                <p className="text-2xl font-bold text-gray-900">{totalClaims}</p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingClaims}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">{resolvedClaims}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Mes dossiers</h2>
              <Link
                href="/claim/new"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Nouveau dossier
              </Link>
            </div>
          </div>

          {claims.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucun dossier pour le moment</p>
              <Link
                href="/claim/new"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Déposer mon premier dossier →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {claims.map((claim) => (
                <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {claim.reference || `Dossier #${claim.id.slice(0, 8)}`}
                        </span>
                        <ClaimStatusBadge status={claim.status} />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {claim.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Créé le {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-semibold text-gray-900">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: claim.currency || 'EUR',
                        }).format(Number(claim.amount))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
