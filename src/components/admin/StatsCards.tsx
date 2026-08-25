import { formatAmount } from '@/lib/claims';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  CheckCircle,
} from 'lucide-react';

export async function StatsCards() {
  // Exécute toutes les requêtes en parallèle  pas de division de Promises
  const [
    totalClaims,
    pendingClaims,
    resolvedClaims,
    rejectedClaims,
    investigatingClaims,
    totalAmountResult,
    activeUsersLast30,
    newUsersToday,
  ] = await Promise.all([
    prisma.claim.count(),
    prisma.claim.count({ where: { status: 'PENDING' } }),
    prisma.claim.count({ where: { status: 'RESOLVED' } }),
    prisma.claim.count({ where: { status: 'REJECTED' } }),
    prisma.claim.count({ where: { status: 'INVESTIGATING' } }),
    prisma.claim.aggregate({ _sum: { amount: true } }),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    }),
  ]);

  // Calcul correct du taux de succès (pas une division de Promises)
  const successRate =
    totalClaims > 0 ? Math.round((resolvedClaims / totalClaims) * 100) : 0;

  const totalAmount = Number(totalAmountResult._sum.amount ?? 0);

  const cards = [
    {
      title: 'Total réclamations',
      value: totalClaims.toString(),
      sub: `${pendingClaims} en attente · ${investigatingClaims} en examen`,
      icon: FileText,
      trend: null,
    },
    {
      title: 'Montant total',
      value: formatAmount(totalAmount, 'EUR'),
      sub: `${resolvedClaims} dossiers résolus`,
      icon: DollarSign,
      trend: null,
    },
    {
      title: 'Taux de résolution',
      value: `${successRate} %`,
      sub: `${rejectedClaims} rejet(s)`,
      icon: CheckCircle,
      trend: successRate >= 80 ? 'up' : null,
    },
    {
      title: 'Nouveaux utilisateurs',
      value: newUsersToday.toString(),
      sub: `${activeUsersLast30} ces 30 derniers jours`,
      icon: Users,
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              {card.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
              {card.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
