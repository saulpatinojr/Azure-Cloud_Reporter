import type { ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '../../utils/helpers';
import { Search, Settings } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeCustomizer } from '../theme/ThemeCustomizer';

type TopbarProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  userEmail?: string | null;
};

export function Topbar({ title, subtitle, actions, className, userEmail }: TopbarProps) {
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  return (
    <>
      <header
        className={cn(
          title === 'Workspace Hub'
            ? 'flex flex-col items-center gap-6 rounded-3xl border border-border bg-surface/80 px-8 py-8 shadow-lg backdrop-blur'
            : 'flex flex-col gap-6 rounded-3xl border border-border bg-surface/80 px-8 py-6 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between',
          className,
        )}
      >
        <div className="flex w-full items-center justify-center">
          {title === 'Workspace Hub' ? (
            <img
              src="/landing_page_banner.png"
              alt="Cloud Reporter Workspace Hub"
              style={{
                maxHeight: '280px', // 56px * 5 = 280px (500% increase)
                width: 'auto',
                display: 'block'
              }}
            />
          ) : (
            <div>
              <h1 className="text-2xl font-semibold text-text md:text-3xl">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>}
            </div>
          )}
        </div>

        {title === 'Workspace Hub' && subtitle && (
          <p className="text-sm text-text-secondary text-center max-w-2xl">{subtitle}</p>
        )}
        <div className={title === 'Workspace Hub' ? 'flex flex-col gap-4 md:flex-row md:items-center w-full md:justify-between' : 'flex flex-col gap-4 md:flex-row md:items-center'}>
          <div className="relative w-full md:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              placeholder="Search assessments, clients, or files"
              className="h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          {actions}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowThemeCustomizer(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text-secondary hover:bg-surface-variant hover:text-text transition-colors"
              title="Customize Theme"
            >
              <Settings className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-text-secondary">Signed in as</p>
              <p className="text-sm font-medium text-text">{userEmail ?? 'team@cloudreporter.com'}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 text-sm font-medium text-white">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'CR'}
            </div>
          </div>
        </div>
      </header>

      {showThemeCustomizer && (
        <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />
      )}
    </>
  );
}
