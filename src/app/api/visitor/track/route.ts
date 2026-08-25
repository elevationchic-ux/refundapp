import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

// Generate a random session ID
function generateSessionId(): string {
  return randomBytes(16).toString('hex');
}

/**
 * POST /api/visitor/track
 * Track visitor activity (page view, time on page)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, page, locale, referrer } = body;
    
    let visitor;
    
    if (sessionId) {
      // Update existing visitor
      visitor = await prisma.visitor.findUnique({
        where: { sessionId },
      });
      
      if (visitor) {
        visitor = await prisma.visitor.update({
          where: { id: visitor.id },
          data: {
            page,
            locale: locale || visitor.locale,
            lastSeen: new Date(),
          },
        });
      }
    }
    
    if (!visitor) {
      // Create new visitor
      const newSessionId = sessionId || generateSessionId();
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
      const userAgent = req.headers.get('user-agent') || null;
    
    visitor = await prisma.visitor.create({
      data: {
        sessionId: newSessionId,
        locale: locale || 'fr',
        page,
        ip,
        userAgent,
      },
    });
  }
  
  return NextResponse.json({
    sessionId: visitor.sessionId,
    visitorId: visitor.id,
  });
}
