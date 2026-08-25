'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { label: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Réclamations',    href: '/admin/claims',    icon: FileText },
  { label: 'Utilisateurs',    href: '/admin/users',     icon: Users },
  { label: 'Messages',        href: '/admin/chat',      icon: MessageSquare },
  { label: 'Analytiques',     href: '/admin/analytics', icon: BarChart3 },
  { label: 'Notifications',   href: '/admin/notifications', icon: Bell },
  { label: 'Paramètres',      href: '/admin/settings',  icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  // Desktop: sidebar repliable ; Mobile: tiroir overlay
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);

  // Ferme automatiquement le tiroir mobile lors d'un changement de route
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Empêche le scroll du body quand le tiroir est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const NavLinks = ({ showLabels }: { showLabels: boolean }) => (
    <nav className="mt-4 px-2 flex-1 space-y-1">
      {navigation.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center px-2 py-2.5 text-sm font-medium rounded-lg transition-colors',
              active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <item.icon
              className={cn(
                'flex-shrink-0 h-5 w-5 transition-colors',
                active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
              )}
            />
            {showLabels && <span className="ml-3 truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const Brand = ({ showLabel }: { showLabel: boolean }) => (
    <div className="flex items-center space-x-2">
      <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">LF</span>
      </div>
      {showLabel && <span className="font-bold text-gray-900 truncate">LitigeFlow</span>}
    </div>
  );

  const UserFooter = ({ showLabel }: { showLabel: boolean }) => (
    <div className="p-4 border-t flex items-center gap-2">
      <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-700 font-medium text-sm">AD</span>
      </div>
      {showLabel && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
          <p className="text-xs text-gray-500 truncate">admin@litigeflow.fr</p>
        </div>
      )}
      <button className="p-1 rounded-md hover:bg-gray-100 ml-auto" title="Déconnexion">
        <LogOut className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── DESKTOP SIDEBAR ─────────────────────────────────── */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 z-20',
          desktopOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          <Brand showLabel={desktopOpen} />
          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="p-1.5 rounded-md hover:bg-gray-100 flex-shrink-0"
            aria-label={desktopOpen ? 'Réduire le menu' : 'Agrandir le menu'}
          >
            {desktopOpen
              ? <ChevronLeft className="w-4 h-4 text-gray-500" />
              : <ChevronRight className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

        <NavLinks showLabels={desktopOpen} />
        <UserFooter showLabel={desktopOpen} />
      </aside>

      {/* ── MOBILE OVERLAY ──────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE DRAWER ───────────────────────────────────── */}
      <aside
        className={cn(
          'md:hidden fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col z-40',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Menu navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 h-16">
          <Brand showLabel />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <NavLinks showLabels />
        <UserFooter showLabel />
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 h-16 bg-white border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <Brand showLabel />
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Named + default export pour compatibilité avec les deux styles d'import
export default AdminLayout;
