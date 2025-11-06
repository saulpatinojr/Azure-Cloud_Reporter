import { AppShell } from '../components/layout/AppShell';
import { Card } from '../design-system';

export default function BackOfficeDemo() {
  return (
    <AppShell
      title="BackOffice service"
      subtitle="The R-based analytics backend now runs as a separate Cloud Run service."
    >
      <Card padding="lg" className="mx-auto max-w-2xl text-sm text-slate-600">
        <p>
          The BackOffice demo previously shipped inside this repo has been moved to its own project.
          Refer to <code>docs/backoffice-cloud-run.md</code> for deployment instructions and the GitHub
          repository link (<code>saulpatinojr/Azure-Cloud_Reporter_BackOffice</code>).
        </p>
        <p className="mt-4">
          This placeholder route remains so navigation stays intact. Once the Cloud Run deployment is
          connected, replace this component with the live experience or a secure iframe integration.
        </p>
      </Card>
    </AppShell>
  );
}
