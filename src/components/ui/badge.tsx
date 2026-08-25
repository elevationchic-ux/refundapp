import * as React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-indigo-600 text-white border-transparent',
  secondary: 'bg-gray-100 text-gray-800 border-transparent',
  outline: 'bg-transparent text-gray-700 border-gray-300',
  destructive: 'bg-red-100 text-red-800 border-transparent',
  success: 'bg-emerald-100 text-emerald-800 border-transparent',
  warning: 'bg-amber-100 text-amber-800 border-transparent',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
