import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/claims/[id]
 * Update claim status and assign agent
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN', 'AGENT');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, agentId } = body;

  if (!status && !agentId) {
    return NextResponse.json(
      { error: 'Au moins un champ à modifier est requis' },
      { status: 400 }
    );
  }

  if (status && !['PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  try {
    const claim = await prisma.claim.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(agentId !== undefined && { agentId: agentId || null }),
      },
      select: {
        id: true,
        reference: true,
        status: true,
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(claim);
  } catch (error) {
    console.error('Failed to update claim:', error);
    return NextResponse.json(
      { error: 'Échec de la mise à jour' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/claims/[id]
 * Delete a claim
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.claim.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete claim:', error);
    return NextResponse.json(
      { error: 'Échec de la suppression' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/claims/[id]
 * Get a single claim details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN', 'AGENT');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        evidence: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!claim) {
      return NextResponse.json({ error: 'Dossier introuvable' }, { status: 404 });
    }

    return NextResponse.json(claim);
  } catch (error) {
    console.error('Failed to fetch claim:', error);
    return NextResponse.json(
      { error: 'Échec de la récupération' },
      { status: 500 }
    );
  }
}
