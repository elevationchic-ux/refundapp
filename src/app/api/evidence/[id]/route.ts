import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const evidence = await prisma.evidence.findUnique({
    where: { id },
    include: { claim: { select: { userId: true } } },
  });

  if (!evidence) {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }

  const isOwner = evidence.claim.userId === session.userId;
  const isStaff = session.role === "ADMIN" || session.role === "AGENT";
  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  return new NextResponse(new Uint8Array(evidence.data), {
    headers: {
      "Content-Type": evidence.mimeType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(evidence.fileName)}"`,
      "Cache-Control": "private, max-age=0",
    },
  });
}
