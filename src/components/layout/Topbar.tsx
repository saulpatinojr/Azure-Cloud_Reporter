import { ReactNode } from 'react';
import { cn } from '../../utils/helpers';
import { Search } from 'lucide-react';

type TopbarProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  userEmail?: string | null;
};

export function Topbar({ title, subtitle, actions, className, userEmail }: TopbarProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6 rounded-3xl border border-transparent bg-white/70 px-8 py-6 shadow-card backdrop-blur md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search assessments, clients, or files"
            className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {actions}

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-400">Signed in as</p>
            <p className="text-sm font-medium text-slate-700">{userEmail ?? 'team@cloudreporter.com'}</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent text-sm font-medium text-white">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'CR'}
          </div>
        </div>
      </div>
    </header>
  );
}
