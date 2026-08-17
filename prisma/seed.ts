import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Password123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Alice Admin",
      password,
      role: "ADMIN",
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@example.com" },
    update: {},
    create: {
      email: "agent@example.com",
      name: "Antoine Agent",
      password,
      role: "AGENT",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      name: "Claire Client",
      password,
      role: "CLIENT",
    },
  });

  const existing = await prisma.claim.count({ where: { userId: client.id } });
  if (existing === 0) {
    await prisma.claim.createMany({
      data: [
        {
          userId: client.id,
          amount: 149.99,
          date: new Date("2026-07-02"),
          reference: "TXN-2026-00417",
          description:
            "Commande d'un casque audio jamais livrée malgré le suivi indiquant une livraison effectuée.",
          status: "PENDING",
        },
        {
          userId: client.id,
          agentId: agent.id,
          amount: 89.5,
          date: new Date("2026-06-15"),
          reference: "TXN-2026-00302",
          description:
            "Double prélèvement lors d'un paiement en ligne : la transaction a été débitée deux fois.",
          status: "INVESTIGATING",
        },
        {
          userId: client.id,
          agentId: agent.id,
          amount: 320,
          date: new Date("2026-05-20"),
          reference: "TXN-2026-00188",
          description:
            "Abonnement annuel facturé après résiliation confirmée par e-mail le mois précédent.",
          status: "RESOLVED",
        },
      ],
    });
  }

  console.log("Seed terminé :", { admin: admin.email, agent: agent.email, client: client.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
