import { requireRole } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MessageSquare, User, Clock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function relativeTime(date: Date): string {
  const diffMs  = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)  return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)   return `il y a ${diffH} h`;
  return `il y a ${Math.floor(diffH / 24)} j`;
}

export default async function AdminChatPage({
  searchParams,
}: {
  searchParams: Promise<{ visitorId?: string; claimId?: string }>;
}) {
  const session = await requireRole('ADMIN', 'AGENT');
  const { visitorId, claimId } = await searchParams;

  // Liste des conversations visiteurs
  const visitors = await prisma.visitor.findMany({
    take: 30,
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { content: true, createdAt: true, isFromAdmin: true },
      },
      _count: { select: { messages: { where: { readAt: null, isFromAdmin: false } } } },
    },
    orderBy: { lastSeen: 'desc' },
  });

  // Conversation active
  const activeVisitor = visitorId
    ? await prisma.visitor.findUnique({
        where: { id: visitorId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: { sender: { select: { name: true } } },
          },
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <AdminLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-sm text-gray-500">{visitors.length} conversation(s)</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
            {/* Liste conversations */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 text-sm">Conversations</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {visitors.map((visitor) => {
                  const lastMsg = visitor.messages[0];
                  const unread  = visitor._count.messages;
                  const isActive = visitor.id === visitorId;
                  return (
                    <Link
                      key={visitor.id}
                      href={`/admin/chat?visitorId=${visitor.id}`}
                      className={`flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors ${isActive ? 'bg-indigo-50' : ''}`}
                    >
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {visitor.name ?? 'Visiteur anonyme'}
                          </p>
                          {unread > 0 && (
                            <span className="bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold flex-shrink-0">
                              {unread}
                            </span>
                          )}
                        </div>
                        {visitor.email && (
                          <p className="text-xs text-gray-500 truncate">{visitor.email}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {lastMsg?.content ?? 'Aucun message'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {relativeTime(lastMsg?.createdAt ?? visitor.lastSeen)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
                {visitors.length === 0 && (
                  <div className="p-8 text-center text-sm text-gray-500">
                    Aucune conversation
                  </div>
                )}
              </div>
            </div>

            {/* Zone messages */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
              {activeVisitor ? (
                <>
                  <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {activeVisitor.name ?? 'Visiteur anonyme'}
                      </p>
                      {activeVisitor.email && (
                        <p className="text-xs text-gray-500">{activeVisitor.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeVisitor.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm ${
                            msg.isFromAdmin
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.isFromAdmin ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {relativeTime(msg.createdAt)}
                            {msg.sender && ` · ${msg.sender.name}`}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activeVisitor.messages.length === 0 && (
                      <div className="text-center text-sm text-gray-400 py-8">
                        Aucun message dans cette conversation
                      </div>
                    )}
                  </div>
                  {/* Formulaire de réponse  POST vers action Server */}
                  <div className="p-4 border-t border-gray-100">
                    <form
                      method="POST"
                      action="/api/admin/chat"
                      className="flex gap-2"
                    >
                      <input type="hidden" name="visitorId" value={activeVisitor.id} />
                      <input
                        name="content"
                        placeholder="Votre réponse…"
                        required
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Envoyer
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-400">
                  <MessageSquare className="h-12 w-12 text-gray-200" />
                  <p className="text-sm">Sélectionnez une conversation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
