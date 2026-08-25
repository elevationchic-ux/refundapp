import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, User } from 'lucide-react';

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  return `il y a ${Math.floor(diffH / 24)} j`;
}

export async function ActiveChats() {
  await requireRole('ADMIN', 'AGENT');

  const visitors = await prisma.visitor.findMany({
    take: 8,
    where: {
      lastSeen: { gte: new Date(Date.now() - 30 * 60 * 1000) },
    },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        where: { isFromAdmin: false },
        // On inclut claimId mais pas claim pour éviter un JOIN non défini dans le schéma Visitor→Message→Claim
        select: { content: true, createdAt: true, claimId: true },
      },
      _count: {
        select: { messages: { where: { readAt: null, isFromAdmin: false } } },
      },
    },
    orderBy: { lastSeen: 'desc' },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            Discussions actives
          </CardTitle>
          <Link href="/admin/chat">
            <Button variant="outline" size="sm">Voir tout</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visitors.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Aucune discussion active</p>
          ) : (
            visitors.map((visitor) => {
              const lastMsg = visitor.messages[0];
              const unread  = visitor._count.messages;
              return (
                <div
                  key={visitor.id}
                  className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {visitor.name ?? 'Visiteur anonyme'}
                        </p>
                        {unread > 0 && (
                          <span className="inline-flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 flex-shrink-0">
                            {unread}
                          </span>
                        )}
                      </div>
                      {visitor.email && (
                        <p className="text-xs text-gray-500 truncate">{visitor.email}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {lastMsg?.content ?? 'Aucun message'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {relativeTime(lastMsg?.createdAt ?? visitor.lastSeen)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Link
                      href={`/admin/chat?visitorId=${visitor.id}${lastMsg?.claimId ? `&claimId=${lastMsg.claimId}` : ''}`}
                    >
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Répondre
                      </Button>
                    </Link>
                    {lastMsg?.claimId && (
                      <Link href={`/admin/claims/${lastMsg.claimId}`}>
                        <Button variant="ghost" size="sm">Voir le dossier</Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
