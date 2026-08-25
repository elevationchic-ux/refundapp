import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireRole('ADMIN', 'AGENT');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [
    totalClaims,
    pendingClaims,
    resolvedClaims,
    rejectedClaims,
    investigatingClaims,
    totalAmountResult,
    totalUsers,
    newUsersToday,
  ] = await Promise.all([
    prisma.claim.count(),
    prisma.claim.count({ where: { status: 'PENDING' } }),
    prisma.claim.count({ where: { status: 'RESOLVED' } }),
    prisma.claim.count({ where: { status: 'REJECTED' } }),
    prisma.claim.count({ where: { status: 'INVESTIGATING' } }),
    prisma.claim.aggregate({ _sum: { amount: true } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ]);

  const successRate = totalClaims > 0 ? Math.round((resolvedClaims / totalClaims) * 100) : 0;

  return NextResponse.json({
    totalClaims,
    pendingClaims,
    resolvedClaims,
    rejectedClaims,
    investigatingClaims,
    totalAmount: Number(totalAmountResult._sum.amount ?? 0),
    totalUsers,
    newUsersToday,
    successRate,
  });
}
