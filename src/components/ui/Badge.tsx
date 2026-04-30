import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const badge = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-ink-700 border-ink-200',
        info: 'bg-integrata-100 text-integrata-700 border-integrata-200',
        ok: 'bg-status-okSoft text-emerald-800 border-emerald-200',
        warn: 'bg-status-warnSoft text-amber-800 border-amber-200',
        risk: 'bg-status-riskSoft text-red-800 border-red-200',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}
