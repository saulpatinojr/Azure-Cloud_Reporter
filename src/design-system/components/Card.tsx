import type { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'muted';
};

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  padding = 'md',
  variant = 'default',
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface shadow-md transition-shadow',
        variant === 'muted' && 'bg-surface-elevated',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 pb-4">
      <div>
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
