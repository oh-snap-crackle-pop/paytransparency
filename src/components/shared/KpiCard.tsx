import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  trend?: { delta: string; direction: 'up' | 'down' | 'flat' };
  variant?: 'default' | 'warn' | 'risk' | 'ok';
  icon?: ReactNode;
}

const variantClasses: Record<NonNullable<KpiCardProps['variant']>, string> = {
  default: 'bg-surface-0 text-ink-900 border-ink-200/60',
  ok: 'bg-status-okSoft text-emerald-900 border-emerald-200',
  warn: 'bg-status-warnSoft text-amber-900 border-amber-200',
  risk: 'bg-status-riskSoft text-red-900 border-red-200',
};

export function KpiCard({ label, value, hint, trend, variant = 'default', icon }: KpiCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border p-5 shadow-card',
        variantClasses[variant],
      )}
    >
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide opacity-70">
        <span>{label}</span>
        {icon}
      </div>
      <div className="font-display text-3xl font-semibold tracking-tight">{value}</div>
      <div className="flex items-center justify-between text-xs">
        <span className="opacity-70">{hint}</span>
        {trend && (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 font-semibold',
              trend.direction === 'down' && 'bg-emerald-100 text-emerald-800',
              trend.direction === 'up' && 'bg-red-100 text-red-800',
              trend.direction === 'flat' && 'bg-ink-100 text-ink-700',
            )}
          >
            {trend.direction === 'down' ? '↓' : trend.direction === 'up' ? '↑' : '→'} {trend.delta}
          </span>
        )}
      </div>
    </div>
  );
}
