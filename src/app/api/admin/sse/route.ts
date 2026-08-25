import { NextRequest } from 'next/server';
import { requireRole } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/sse
 * Server-Sent Events pour le tableau de bord admin.
 * Envoie une mise à jour des stats toutes les 15 secondes.
 */
export async function GET(req: NextRequest) {
  try {
    await requireRole('ADMIN', 'AGENT');
  } catch {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();

  async function getStats() {
    const [
      total,
      pending,
      resolved,
      unreadMessages,
      activeVisitors,
      totalVisitorsToday,
    ] = await Promise.all([
      prisma.claim.count(),
      prisma.claim.count({ where: { status: 'PENDING' } }),
      prisma.claim.count({ where: { status: 'RESOLVED' } }),
      prisma.chatMessage.count({ where: { readAt: null, isFromAdmin: false } }),
      // Visitors active in last 5 minutes
      prisma.visitor.count({
        where: {
          lastSeen: {
            gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        },
      }),
      // Total visitors today
      prisma.visitor.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);
    
    return {
      total,
      pending,
      resolved,
      unreadMessages,
      activeVisitors,
      totalVisitorsToday,
      ts: Date.now(),
    };
  }

  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      }

      // Envoi initial immédiat
      try {
        send(await getStats());
      } catch {
        controller.close();
        return;
      }

      // Polling toutes les 15 secondes
      const interval = setInterval(async () => {
        try {
          send(await getStats());
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 15_000);

      // Nettoyage si le client se déconnecte
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
