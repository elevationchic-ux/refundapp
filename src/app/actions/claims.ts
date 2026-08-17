"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type ClaimFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const MAX_FILES = 5;
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

const claimSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Le montant doit être supérieur à 0.")
    .max(1_000_000, "Le montant est trop élevé."),
  date: z.coerce.date().max(new Date(), "La date ne peut pas être dans le futur."),
  reference: z.string().max(100).optional(),
  description: z
    .string()
    .min(20, "Décrivez le litige en au moins 20 caractères.")
    .max(5000),
});

export async function createClaim(
  _prevState: ClaimFormState,
  formData: FormData
): Promise<ClaimFormState> {
  const session = await requireSession();

  const parsed = claimSchema.safeParse({
    amount: formData.get("amount"),
    date: formData.get("date"),
    reference: formData.get("reference") || undefined,
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const files = formData
    .getAll("evidence")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return { error: `Vous pouvez joindre au maximum ${MAX_FILES} fichiers.` };
  }
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return { error: `Le fichier « ${file.name} » dépasse 5 Mo.` };
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        error: `Le format du fichier « ${file.name} » n'est pas autorisé (PNG, JPEG, WEBP ou PDF).`,
      };
    }
  }

  const evidenceData = await Promise.all(
    files.map(async (file) => ({
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
    }))
  );

  await prisma.claim.create({
    data: {
      userId: session.userId,
      amount: parsed.data.amount,
      date: parsed.data.date,
      reference: parsed.data.reference,
      description: parsed.data.description,
      evidence: { create: evidenceData },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  redirect("/dashboard?submitted=1");
}
