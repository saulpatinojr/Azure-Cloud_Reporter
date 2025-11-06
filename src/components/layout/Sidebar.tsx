import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import {
  LayoutDashboard,
  FolderKanban,
  FileSpreadsheet,
  Library,
  Settings,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

const primaryNav = [
  { to: '/dashboard', label: 'Workspace Hub', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: FolderKanban },
  { to: '/uploads', label: 'Upload center', icon: UploadCloud },
  { to: '/templates', label: 'Templates', icon: Library },
  { to: '/insights', label: 'Insights', icon: FileSpreadsheet },
];

const secondaryNav = [
  { to: '/automation', label: 'Automations', icon: Sparkles },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden w-64 flex-shrink-0 md:flex md:flex-col">
      <div className="rounded-3xl border bg-white/80 px-6 py-8 shadow-card backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold">
            CR
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Cloud Reporter</p>
            <p className="text-base font-semibold text-slate-900">MSP Suite</p>
          </div>
        </div>

        <nav className="mt-10 space-y-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">Workspaces</p>
            <ul className="space-y-1">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <NavItem
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    active={location.pathname.startsWith(item.to)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-400">Admin</p>
            <ul className="space-y-1">
              {secondaryNav.map((item) => (
                <li key={item.to}>
                  <NavItem
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    active={location.pathname.startsWith(item.to)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}

type NavItemProps = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

function NavItem({ to, label, icon: Icon, active }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
        active
          ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-card'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70',
      )}
    >
      <Icon className={cn('h-5 w-5', active ? 'text-primary' : 'text-slate-400')} />
      {label}
    </NavLink>
  );
}
