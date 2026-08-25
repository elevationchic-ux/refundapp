import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

// Generate a random session ID
function generateSessionId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * GET /api/visitor
 * Récupère ou crée une session visiteur
 */
export async function GET(req: NextRequest) {
  try {
    const sessionId = req.headers.get('x-session-id') || req.nextUrl.searchParams.get('sessionId');
    
    if (sessionId) {
      const visitor = await prisma.visitor.findUnique({
        where: { sessionId },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      
      if (visitor) {
        // Update lastSeen
        await prisma.visitor.update({
          where: { id: visitor.id },
          data: { lastSeen: new Date() },
        });
        return NextResponse.json(visitor);
      }
    }
    
    // Create new visitor
    const newSessionId = generateSessionId();
    const locale = req.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'fr';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const userAgent = req.headers.get('user-agent') || null;
    
    const visitor = await prisma.visitor.create({
      data: {
        sessionId: newSessionId,
        locale,
        ip,
        userAgent,
      },
    });
    
    return NextResponse.json(visitor);
  } catch (error) {
    console.error('Failed to get/create visitor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/visitor
 * Met à jour les infos du visiteur (page courante, nom, email)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, page, name, email } = body;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId requis' }, { status: 400 });
    }
    
    const visitor = await prisma.visitor.update({
      where: { sessionId },
      data: {
        ...(page && { page }),
        ...(name && { name }),
        ...(email && { email }),
        lastSeen: new Date(),
      },
    });
    
    return NextResponse.json(visitor);
  } catch (error) {
    console.error('Failed to update visitor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
