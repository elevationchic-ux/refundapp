import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/visitor/messages?sessionId=xxx
 * Récupère les messages d'une session visiteur
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId requis' }, { status: 400 });
  }
  
  const visitor = await prisma.visitor.findUnique({
    where: { sessionId },
    select: { id: true },
  });
  
  if (!visitor) {
    return NextResponse.json({ error: 'Visiteur introuvable' }, { status: 404 });
  }
  
  const messages = await prisma.chatMessage.findMany({
    where: { visitorId: visitor.id },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: {
        select: { name: true },
      },
    },
  });
  
  return NextResponse.json(messages);
}

/**
 * POST /api/visitor/messages
 * Envoie un message depuis un visiteur
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { sessionId, content, name, email } = body;
  
  if (!sessionId || !content?.trim()) {
    return NextResponse.json({ error: 'sessionId et content requis' }, { status: 400 });
  }
  
  // Trouver ou créer le visiteur
  let visitor = await prisma.visitor.findUnique({
    where: { sessionId },
  });
  
  if (!visitor) {
    return NextResponse.json({ error: 'Visiteur introuvable' }, { status: 404 });
  }
  
  // Mettre à jour les infos si fournies
  if (name || email) {
    visitor = await prisma.visitor.update({
      where: { id: visitor.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        lastSeen: new Date(),
      },
    });
  }
  
  const message = await prisma.chatMessage.create({
    data: {
      visitorId: visitor.id,
      content: content.trim(),
      isFromAdmin: false,
    },
  });
  
  return NextResponse.json(message, { status: 201 });
}

/**
 * PATCH /api/visitor/messages
 * Marque les messages comme lus
 */
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { sessionId, messageIds } = body;
  
  if (!sessionId || !messageIds?.length) {
    return NextResponse.json({ error: 'sessionId et messageIds requis' }, { status: 400 });
  }
  
  const visitor = await prisma.visitor.findUnique({
    where: { sessionId },
    select: { id: true },
  });
  
  if (!visitor) {
    return NextResponse.json({ error: 'Visiteur introuvable' }, { status: 404 });
  }
  
  await prisma.chatMessage.updateMany({
    where: {
      id: { in: messageIds },
      visitorId: visitor.id,
      isFromAdmin: true,
      readAt: null,
    },
    data: { readAt: new Date() },
  });
  
  return NextResponse.json({ success: true });
}
