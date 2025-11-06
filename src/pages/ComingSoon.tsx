import { AppShell } from '../components/layout/AppShell';
import { Button, Card } from '../design-system';

type ComingSoonProps = {
  title: string;
  description: string;
};

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <AppShell
      title={title}
      subtitle={description}
      actions={<Button variant="secondary" disabled>Coming soon</Button>}
    >
      <Card padding="lg" className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span className="text-xl font-semibold">🚧</span>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-slate-900">This workspace is being built</h2>
        <p className="mt-3 text-sm text-slate-500">
          We are crafting a full-featured experience for templates, insights, and automation workflows.
          In the meantime, continue working within assessments and clients.
        </p>
      </Card>
    </AppShell>
  );
}
