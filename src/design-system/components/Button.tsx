import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'alert' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-md',
  secondary: 'bg-surface border border-border text-text hover:bg-surface-elevated focus:ring-primary',
  success: 'bg-success text-white hover:bg-success/90 focus:ring-success',
  warning: 'bg-warning text-white hover:bg-warning/90 focus:ring-warning',
  alert: 'bg-alert text-white hover:bg-alert/90 focus:ring-alert',
  ghost: 'bg-transparent text-text hover:bg-surface focus:ring-primary',
  outline: 'bg-transparent border border-border text-text hover:bg-surface-elevated focus:ring-primary',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', block, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], block && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
