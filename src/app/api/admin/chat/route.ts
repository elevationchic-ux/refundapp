import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** GET /api/admin/chat?visitorId=xxx  liste des messages d'un visiteur */
export async function GET(req: NextRequest) {
  try {
    await requireRole('ADMIN', 'AGENT');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const visitorId = req.nextUrl.searchParams.get('visitorId');
  if (!visitorId) {
    return NextResponse.json({ error: 'visitorId requis' }, { status: 400 });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { visitorId },
    orderBy: { createdAt: 'asc' },
    include: { sender: { select: { name: true } } },
  });

  return NextResponse.json(messages);
}

/** POST /api/admin/chat  envoi d'un message admin vers un visiteur */
export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireRole('ADMIN', 'AGENT');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { visitorId?: string; content?: string; claimId?: string };
  try {
    // Support form POST (depuis la page admin chat) et JSON
    const contentType = req.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      body = {
        visitorId: formData.get('visitorId') as string | undefined,
        content: formData.get('content') as string | undefined,
      };
    }
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  const { visitorId, content, claimId } = body;

  if (!visitorId || !content?.trim()) {
    return NextResponse.json({ error: 'visitorId et content requis' }, { status: 400 });
  }

  // Vérifie que le visiteur existe
  const visitor = await prisma.visitor.findUnique({ where: { id: visitorId } });
  if (!visitor) {
    return NextResponse.json({ error: 'Visiteur introuvable' }, { status: 404 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      visitorId,
      claimId: claimId ?? null,
      senderId: session.userId,
      content: content.trim(),
      isFromAdmin: true,
    },
    include: { sender: { select: { name: true } } },
  });

  // Redirige vers la page chat après envoi de formulaire
  const referer = req.headers.get('referer');
  if (referer) {
    return NextResponse.redirect(new URL(referer));
  }

  return NextResponse.json(message, { status: 201 });
}
