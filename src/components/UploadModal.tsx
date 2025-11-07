import React, { useRef, useState, useEffect } from 'react';
import FocusTrap from 'focus-trap-react';
import { Button, Card } from '../design-system';
import { X, UploadCloud, Loader2 } from 'lucide-react';

export default function UploadModal({ open, onClose, onUpload }: {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!open) return null;

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // reset status when opened
    setStatusMessage(null);
    // focus will be managed by focus-trap's initialFocus option
    return () => {
      // restore focus when modal unmounts
      previouslyFocused.current?.focus();
    };
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const handleFile = (files: FileList | null) => {
    if (!files || !files.length) return;
    setFile(files[0]);
  };

  const submit = async () => {
    if (!file) return;
    setLoading(true);
    setStatusMessage('Uploading...');
    try {
      await onUpload(file);
      setStatusMessage('Upload complete');
      // small delay to allow screen-reader to announce
      setTimeout(() => setStatusMessage(null), 1500);
      setFile(null);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setStatusMessage(`Upload failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <FocusTrap
        focusTrapOptions={{
          initialFocus: () => dialogRef.current as HTMLElement,
          escapeDeactivates: true,
          onDeactivate: () => onClose(),
        }}
      >
        <div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-dialog-title"
          className="relative z-10 w-full max-w-3xl rounded-2xl"
          style={{ background: 'var(--surface-1)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', padding: '0', borderRadius: '1rem' }}
        >
        <Card className="w-full h-full border-0 shadow-none bg-transparent">
        <div className="flex justify-between items-start p-6">
          <h3 id="upload-dialog-title" className="text-xl font-semibold">Upload Your Files</h3>
          <button aria-label="Close" onClick={onClose} className="rounded-full bg-white p-2 shadow">
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>

        <div className="px-6 pb-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="mb-4 rounded-xl border border-dashed p-8 text-center"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
          >
            {!file ? (
              <>
                <UploadCloud className="mx-auto h-10 w-10" style={{ color: 'var(--accent-2)' }} />
                <div className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>Drop files here or</div>
                <div className="mt-3">
                  <input ref={inputRef} type="file" hidden onChange={(e) => handleFile(e.target.files)} />
                  <Button onClick={() => inputRef.current?.click()} style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>Choose file</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{file.name}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => setFile(null)} style={{ borderColor: 'var(--border)' }}>Remove</Button>
                  <Button onClick={submit} disabled={loading} style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', padding: '10px 18px', fontSize: '0.95rem', fontWeight: 600 }}>
                    {loading ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading</span> : 'Upload'}
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Accepted: CSV, XLSX. Max 15 MB.</div>
          <div aria-live="polite" className="sr-only">{statusMessage}</div>
        </div>
        </Card>
        </div>
      </FocusTrap>
    </div>
  );
}
