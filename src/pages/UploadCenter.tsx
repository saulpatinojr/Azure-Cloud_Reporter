import { useCallback, useRef, useState } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Badge, Button, Card, CardHeader } from '../design-system';
import { validateUpload, submitUpload } from '../services/api/ingestion';
import { cn } from '../utils/helpers';
import { UploadCloud, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

type UploadStatus = 'idle' | 'validating' | 'ready' | 'error' | 'processing' | 'completed';

type UploadEntry = {
  id: string;
  file: File;
  status: UploadStatus;
  message?: string;
  template?: string;
};

export default function UploadCenter() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [entries, setEntries] = useState<UploadEntry[]>([]);
  const [isDragging, setDragging] = useState(false);

  const onFilesSelected = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;

    const newEntries = Array.from(files).map<UploadEntry>((file) => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      status: 'validating',
    }));

    setEntries((prev) => [...newEntries, ...prev]);

    await Promise.all(
      newEntries.map(async (entry) => {
        const result = await validateUpload(entry.file);
        setEntries((prev) =>
          prev.map((item) => {
            if (item.id !== entry.id) return item;
            if (!result.ok) {
              return { ...item, status: 'error', message: result.error ?? 'Validation failed' };
            }
            const status = result.data?.status === 'error' ? 'error' : 'ready';
            return {
              ...item,
              status,
              message: result.data?.message,
              template: result.data?.suggestedTemplate,
            };
          }),
        );
      }),
    );
  }, []);

  const onUpload = async (entry: UploadEntry) => {
    setEntries((prev) => prev.map((item) => (item.id === entry.id ? { ...item, status: 'processing' } : item)));

    const result = await submitUpload(entry.file);

    setEntries((prev) =>
      prev.map((item) => {
        if (item.id !== entry.id) return item;
        if (!result.ok) {
          return { ...item, status: 'error', message: result.error ?? 'Upload failed' };
        }
        return { ...item, status: 'completed', message: 'Queued for ingestion' };
      }),
    );
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    onFilesSelected(event.dataTransfer.files);
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AppShell
      title="Upload center"
      subtitle="Drag telemetry exports, let us validate structure, and trigger ingestion runs."
      actions={<Button onClick={handleSelectClick}>Select files</Button>}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".csv,.xlsx"
        hidden
        onChange={(event) => onFilesSelected(event.target.files)}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card className={cn('border-dashed border-2 border-slate-200 bg-white/80', isDragging && 'border-primary bg-primary/5')}>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setDragging(false);
            }}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center gap-4 py-16 text-center"
          >
            <div className="rounded-full bg-primary/10 p-5 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">Drop telemetry exports here</p>
              <p className="mt-2 text-sm text-slate-500">
                CSV or XLSX files up to 15 MB. Each file is validated before ingestion.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSelectClick}>Browse files</Button>
              <Button variant="secondary" onClick={() => setEntries([])}>
                Clear list
              </Button>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <CardHeader
            title="Supported exports"
            subtitle="Add RVTools, Azure Advisor, Cost Management, and custom CSVs."
          />
          <ul className="space-y-4 text-sm text-slate-600">
            <li>
              <Badge variant="primary" className="mr-2">RVTools</Badge>
              Virtualization telemetry for BackOffice graph analytics.
            </li>
            <li>
              <Badge variant="neutral" className="mr-2">Azure Advisor</Badge>
              Recommendations for cost, security, reliability.
            </li>
            <li>
              <Badge variant="neutral" className="mr-2">Custom CSV</Badge>
              Provide column headers; mapping rules are configurable per template.
            </li>
          </ul>
        </Card>
      </div>

      <Card className="mt-6" padding="lg">
        <CardHeader title="Upload queue" subtitle="Monitor validation and ingestion status." />
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">File name</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                    No files yet. Drag and drop exports to begin.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{entry.file.name}</td>
                    <td className="px-4 py-3 text-slate-500">{entry.template ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusIndicator status={entry.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{entry.message ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <QueueAction entry={entry} onUpload={() => onUpload(entry)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}

type StatusIndicatorProps = {
  status: UploadStatus;
};

function StatusIndicator({ status }: StatusIndicatorProps) {
  switch (status) {
    case 'validating':
      return (
        <span className="inline-flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> Validating
        </span>
      );
    case 'ready':
      return (
        <span className="inline-flex items-center gap-2 text-xs text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Ready to ingest
        </span>
      );
    case 'error':
      return (
        <span className="inline-flex items-center gap-2 text-xs text-rose-600">
          <XCircle className="h-4 w-4" /> Needs attention
        </span>
      );
    case 'processing':
      return (
        <span className="inline-flex items-center gap-2 text-xs text-indigo-600">
          <Loader2 className="h-4 w-4 animate-spin" /> Processing
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-2 text-xs text-indigo-600">
          <CheckCircle2 className="h-4 w-4" /> Queued
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-2 text-xs text-slate-400">
          <AlertTriangle className="h-4 w-4" /> Pending validation
        </span>
      );
  }
}

type QueueActionProps = {
  entry: UploadEntry;
  onUpload: () => void;
};

function QueueAction({ entry, onUpload }: QueueActionProps) {
  if (entry.status === 'ready') {
    return (
      <Button size="sm" onClick={onUpload} className="text-xs">
        Ingest file
      </Button>
    );
  }

  if (entry.status === 'processing') {
    return (
      <div className="text-xs text-indigo-600">Submitting…</div>
    );
  }

  if (entry.status === 'completed') {
    return <Badge variant="primary">Queued</Badge>;
  }

  return <div className="text-xs text-slate-400">—</div>;
}
