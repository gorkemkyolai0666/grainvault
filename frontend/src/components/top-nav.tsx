'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn, label } from '@/lib/utils';
import {
  LayoutDashboard, Warehouse, Truck, PackageOpen, FlaskConical,
  FileText, Wrench, Moon, Sun, LogOut, Menu, X, Wheat, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/dashboard/silos', label: 'Silolar', icon: Warehouse },
  { href: '/dashboard/intakes', label: 'Girişler', icon: Truck },
  { href: '/dashboard/dispatches', label: 'Sevkiyat', icon: PackageOpen },
  { href: '/dashboard/quality-tests', label: 'Kalite', icon: FlaskConical },
  { href: '/dashboard/contracts', label: 'Sözleşmeler', icon: FileText },
  { href: '/dashboard/maintenance', label: 'Bakım', icon: Wrench },
];

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Panel', silos: 'Silolar', intakes: 'Girişler', dispatches: 'Sevkiyat',
  'quality-tests': 'Kalite Testleri', contracts: 'Sözleşmeler', maintenance: 'Bakım',
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return null;
  const crumbs = segments.map((seg, i) => ({
    href: '/' + segments.slice(0, i + 1).join('/'),
    label: breadcrumbLabels[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1)),
    last: i === segments.length - 1,
  }));
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-bar">
      <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 text-sm sm:px-6">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">GrainVault</Link>
        {crumbs.map((c) => (
          <span key={c.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            {c.last ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <Link href={c.href} className="text-muted-foreground hover:text-foreground">{c.label}</Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}

export function TopNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-soil shadow-md">
              <Wheat className="h-5 w-5 text-amber" strokeWidth={2.2} />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-lg font-bold leading-tight">GrainVault</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Tahıl Depolama Operasyonları</div>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  className={cn('relative whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors',
                    active ? 'text-amber' : 'text-muted-foreground hover:text-foreground')}>
                  {item.label}
                  {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-amber" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground md:inline">
              {user?.name} · {user?.role ? label('userRole', user.role) : ''}
            </span>
            <button onClick={toggleTheme} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Tema değiştir">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => { logout(); router.push('/login'); }}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted sm:inline-flex">
              <LogOut size={14} /> Çıkış
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-lg p-2 xl:hidden" aria-label="Menü">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border/60 py-3 xl:hidden">
            <div className="flex flex-wrap gap-1 px-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                    className={cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
                      active ? 'bg-amber/10 text-amber' : 'text-muted-foreground hover:bg-muted')}>
                    <Icon size={16} />{item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <Breadcrumbs />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
