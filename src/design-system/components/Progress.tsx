import { cn } from '../../utils/helpers';

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-200', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary/90 to-accent/90 transition-[width] duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
