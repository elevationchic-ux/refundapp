import { Suspense } from 'react';
import { requireRole } from '@/lib/session';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/admin/StatsCards';
import { RecentClaims } from '@/components/admin/RecentClaims';
import { ActiveChats } from '@/components/admin/ActiveChats';
import { NotificationsPanel } from '@/components/admin/NotificationsPanel';
import { PerformanceChart } from '@/components/admin/PerformanceChartServer';
import { VisitorStats } from '@/components/admin/VisitorStats';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await requireRole('ADMIN', 'AGENT');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />
      <AdminLayout>
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-1 text-sm text-gray-500">
              Vue d&apos;ensemble des activités, statistiques et performances
            </p>
          </div>

          {/* Real-time visitor stats */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Visiteurs en temps réel</h2>
            <VisitorStats />
          </div>

          <Suspense fallback={<SkeletonCards />}>
            <StatsCards />
          </Suspense>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Suspense fallback={<SkeletonBlock />}>
                <RecentClaims />
              </Suspense>
            </div>
            <div>
              <Suspense fallback={<SkeletonBlock />}>
                <NotificationsPanel />
              </Suspense>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<SkeletonBlock />}>
              <PerformanceChart />
            </Suspense>
            <Suspense fallback={<SkeletonBlock />}>
              <ActiveChats />
            </Suspense>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 h-28 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-64 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-32 bg-gray-100 rounded" />
    </div>
  );
}
