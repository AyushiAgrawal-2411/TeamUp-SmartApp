import { useState, type ReactNode } from 'react';
import {
  Compass,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useStore } from '@/store';
import { Avatar } from '@/components/ui';

export type View = 'dashboard' | 'discover' | 'projects' | 'profile' | 'trust';

export function AppShell({
  view,
  setView,
  children,
}: {
  view: View;
  setView: (v: View) => void;
  children: ReactNode;
}) {
  const { currentUser, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'trust', label: 'Trust & Safety', icon: Shield },
  ];

  const go = (v: View) => {
    setView(v);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-ink-100 bg-white lg:flex">
        <Brand />
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => (
            <NavItem key={n.id} active={view === n.id} onClick={() => go(n.id)} icon={n.icon} label={n.label} />
          ))}
        </nav>
        {currentUser && (
          <button
            onClick={() => go('profile')}
            className="m-3 flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-ink-50"
          >
            <Avatar user={currentUser} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{currentUser.name}</p>
              <p className="truncate text-xs text-ink-500">{currentUser.college}</p>
            </div>
          </button>
        )}
        <button onClick={logout} className="btn-ghost m-3 justify-start text-ink-600">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
        <Brand compact />
        <button onClick={() => setMobileOpen(true)} className="btn-ghost p-2">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 animate-fade-up bg-white p-4 shadow-lift">
            <div className="flex items-center justify-between">
              <Brand compact />
              <button onClick={() => setMobileOpen(false)} className="btn-ghost p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-4 space-y-1">
              {nav.map((n) => (
                <NavItem
                  key={n.id}
                  active={view === n.id}
                  onClick={() => go(n.id)}
                  icon={n.icon}
                  label={n.label}
                />
              ))}
            </nav>
            <button onClick={logout} className="btn-ghost mt-4 w-full justify-start text-ink-600">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </main>
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'px-5 pt-5'}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 21v-1a6 6 0 016-6h6a6 6 0 016 6v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <span className="font-display text-lg font-bold tracking-tight text-ink-900">TeamUp Smart</span>
    </div>
  );
}

function NavItem({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutDashboard;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
      }`}
    >
      <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
      {label}
    </button>
  );
}
