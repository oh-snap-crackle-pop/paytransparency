import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useToasts } from '@/lib/toast';
import { cn } from '@/lib/cn';

const variantConfig = {
  default: { Icon: Info, classes: 'bg-surface-0 border-ink-200 text-ink-900' },
  success: { Icon: CheckCircle2, classes: 'bg-status-okSoft border-emerald-200 text-emerald-900' },
  error: { Icon: AlertCircle, classes: 'bg-status-riskSoft border-red-200 text-red-900' },
} as const;

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => {
        const cfg = variantConfig[t.variant ?? 'default'];
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-card-hover min-w-[280px] max-w-md',
              cfg.classes,
            )}
          >
            <cfg.Icon className="h-4 w-4 shrink-0" />
            <span className="text-sm">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
