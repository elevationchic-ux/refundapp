import { prisma } from '@/lib/prisma';
import { PerformanceChartClient, type MonthlyData } from './PerformanceChart';

export async function PerformanceChart() {
  const now = new Date();
  const monthlyData: MonthlyData[] = [];

  // Requêtes groupées par mois pour les 12 derniers mois
  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const [claims, resolved, amountResult] = await Promise.all([
      prisma.claim.count({ where: { createdAt: { gte: start, lt: end } } }),
      prisma.claim.count({ where: { status: 'RESOLVED', createdAt: { gte: start, lt: end } } }),
      prisma.claim.aggregate({
        where: { createdAt: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
    ]);

    monthlyData.push({
      month: start.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      claims,
      resolved,
      amount: Number(amountResult._sum.amount ?? 0),
    });
  }

  return <PerformanceChartClient data={monthlyData} />;
}
