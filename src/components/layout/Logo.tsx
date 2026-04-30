import { useT } from '@/lib/i18n';

export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-integrata-900 text-surface-0 shadow-sm">
        <span className="font-display text-base font-extrabold leading-none tracking-tight">i</span>
      </div>
      {!compact && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[15px] font-bold tracking-tight text-ink-900">
            integrata
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-integrata-500">
            {t('brand.productName')}
          </span>
        </div>
      )}
    </div>
  );
}
