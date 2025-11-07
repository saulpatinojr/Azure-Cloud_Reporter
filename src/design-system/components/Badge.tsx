import type { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'primary' | 'outline' | 'destructive';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  primary: 'bg-indigo-100 text-indigo-700',
  outline: 'border border-slate-200 bg-transparent text-slate-600',
  destructive: 'bg-red-100 text-red-700',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
