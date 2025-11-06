import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

type AppShellProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  userEmail?: string | null;
};

export function AppShell({ title, subtitle, actions, children, userEmail }: AppShellProps) {
  return (
    <div className="app-shell-background">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-8 px-6 py-8 lg:px-10">
        <Sidebar />
        <div className="flex-1">
          <Topbar title={title} subtitle={subtitle} actions={actions} userEmail={userEmail} />
          <main className="mt-6 rounded-3xl border bg-white/80 p-8 shadow-card backdrop-blur">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
