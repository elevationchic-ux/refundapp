import { requireRole } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ClaimsManagement } from './ClaimsManagement';

export const dynamic = 'force-dynamic';

export default async function AdminClaimsPage() {
  const session = await requireRole('ADMIN', 'AGENT');
  
  const claims = await prisma.claim.findMany({
    select: {
      id: true,
      reference: true,
      status: true,
      description: true,
      amount: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
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
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const agents = await prisma.user.findMany({
    where: {
      OR: [{ role: 'ADMIN' }, { role: 'AGENT' }],
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <AdminLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des dossiers</h1>
            <p className="mt-1 text-sm text-gray-500">
              {claims.length} dossier(s) au total
            </p>
          </div>
          <ClaimsManagement 
            claims={claims.map(c => ({
              id: c.id,
              reference: c.reference,
              status: c.status,
              description: c.description,
              amount: Number(c.amount),
              currency: c.currency,
              createdAt: c.createdAt.toISOString(),
              updatedAt: c.updatedAt.toISOString(),
              user: c.user,
              agent: c.agent,
            }))} 
            agents={agents} 
          />
        </div>
      </AdminLayout>
    </div>
  );
}
