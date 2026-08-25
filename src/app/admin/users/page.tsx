import { requireRole } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagement } from './UserManagement';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await requireRole('ADMIN');
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <AdminLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
            <p className="mt-1 text-sm text-gray-500">
              {users.length} utilisateur(s) enregistré(s)
            </p>
          </div>
          <UserManagement users={users.map(u => ({
            id: u.id,
            email: u.email,
            name: u.name,
            role: u.role,
            createdAt: u.createdAt.toISOString(),
            claimsCount: 0,
          }))} />
        </div>
      </AdminLayout>
    </div>
  );
}
