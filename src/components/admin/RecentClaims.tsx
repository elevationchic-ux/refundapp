import Link from 'next/link';
import type { ClaimStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatAmount, formatDate } from '@/lib/claims';
import { Eye, MessageSquare, FileText } from 'lucide-react';
import { requireRole } from '@/lib/session';
import { StatusBadge } from '@/components/StatusBadge';

export async function RecentClaims() {
  const session = await requireRole('ADMIN', 'AGENT');

  const claims = await prisma.claim.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      agent: { select: { name: true } },
      _count: { select: { messages: true } }
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Réclamations récentes</CardTitle>
          <Link href="/admin/claims">
            <Button variant="outline" size="sm">Voir tout</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{claim.user.name}</p>
                  <p className="text-sm text-gray-500">{claim.user.email}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <StatusBadge status={claim.status as ClaimStatus} />
                    {claim.reference && (
                      <span className="text-xs text-gray-400">Réf. {claim.reference}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatAmount(Number(claim.amount), claim.currency)}</p>
                  <p className="text-xs text-gray-500">{formatDate(claim.createdAt)}</p>
                </div>

                <div className="flex space-x-1">
                  <Link href={`/admin/claims/${claim.id}`}>
                    <Button variant="ghost" size="sm" title="Voir les détails">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>

                  {claim._count.messages > 0 && (
                    <Link href={`/admin/chat?claimId=${claim.id}`}>
                      <Button variant="ghost" size="sm" title="Voir les messages">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
