import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/session';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X, AlertTriangle, MessageSquare, FileText, User } from 'lucide-react';

export async function NotificationsPanel() {
  await requireRole('ADMIN', 'AGENT');

  const notifications = await prisma.notification.findMany({
    take: 10,
    where: { read: false },
    orderBy: { createdAt: 'desc' },
  });

  // Marque les notifications comme lues en arrière-plan (sans bloquer le rendu)
  if (notifications.length > 0) {
    await prisma.notification.updateMany({
      where: { id: { in: notifications.map((n) => n.id) } },
      data: { read: true },
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            Notifications
            {notifications.length > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5">
                {notifications.length}
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Aucune notification non lue</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notification.body}</p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(
                        -Math.round((Date.now() - new Date(notification.createdAt).getTime()) / 60000),
                        'minutes'
                      )}
                    </p>
                  </div>
                  {/* Bouton dismiss  rendu statique, action gérée côté client si besoin */}
                  <div className="flex-shrink-0">
                    <X className="h-3.5 w-3.5 text-gray-300" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case 'NEW_CLAIM':
      return <FileText className="h-4 w-4 text-indigo-500" />;
    case 'NEW_MESSAGE':
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case 'NEW_VISITOR':
      return <User className="h-4 w-4 text-green-500" />;
    case 'STATUS_CHANGE':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-400" />;
  }
}
