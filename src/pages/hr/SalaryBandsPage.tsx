import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useT } from '@/lib/i18n';
import { distributionByLevel, outliers, bandPosition } from '@/lib/analytics';
import { departments, departmentById } from '@/data/departments';
import { formatEUR } from '@/lib/format';
import { useToasts } from '@/lib/toast';
import { cn } from '@/lib/cn';

export function SalaryBandsPage() {
  const { t, lang } = useT();
  const showToast = useToasts((s) => s.show);
  const [dept, setDept] = useState<string>('all');
  const [colorByGender, setColorByGender] = useState(true);

  const filterDept = dept === 'all' ? undefined : dept;
  const distribution = useMemo(() => distributionByLevel(filterDept), [filterDept]);
  const outlierList = useMemo(() => outliers(filterDept), [filterDept]);

  const departmentOptions = [
    { value: 'all', label: t('common.all') },
    ...departments.map((d) => ({ value: d.id, label: d.name[lang] })),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('bands.title')}
        subtitle={t('bands.subtitle')}
        actions={
          <>
            <Select
              value={dept}
              onValueChange={setDept}
              options={departmentOptions}
              ariaLabel={t('bands.departmentFilter')}
              size="sm"
            />
            <button
              onClick={() => setColorByGender((v) => !v)}
              className={cn(
                'inline-flex h-8 items-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors',
                colorByGender
                  ? 'border-integrata-300 bg-integrata-50 text-integrata-900'
                  : 'border-ink-200 bg-surface-0 text-ink-600 hover:bg-surface-50',
              )}
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-integrata-500" />
              <span className="inline-flex h-2 w-2 rounded-full bg-integrata-900" />
              {t('bands.genderOverlay')}
            </button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>
            {dept === 'all' ? t('bands.title') : departmentById[dept].name[lang]}
          </CardTitle>
          <CardDescription>
            {distribution.reduce((acc, d) => acc + d.count, 0)} {t('common.employees').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hidden grid-cols-[80px_1fr_120px_120px_120px_60px] items-center gap-4 border-b border-ink-200 pb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500 lg:grid">
            <div>{t('bands.levelHeader')}</div>
            <div>{t('bands.distributionHeader')}</div>
            <div className="text-right">{t('bands.minHeader')}</div>
            <div className="text-right">{t('bands.midHeader')}</div>
            <div className="text-right">{t('bands.maxHeader')}</div>
            <div className="text-right">{t('bands.countHeader')}</div>
          </div>

          <div className="divide-y divide-ink-200/60">
            {distribution.map(({ level, members, count }) => (
              <div
                key={level.id}
                className="grid grid-cols-1 items-center gap-3 py-4 lg:grid-cols-[80px_1fr_120px_120px_120px_60px] lg:gap-4"
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-integrata-900 px-2 py-0.5 text-xs font-bold text-white">
                    {level.code}
                  </span>
                  <span className="text-sm font-medium text-ink-800 lg:hidden">{level.name[lang]}</span>
                </div>

                <div className="relative">
                  <div className="hidden text-xs text-ink-500 lg:block">{level.name[lang]}</div>
                  <BandStrip
                    members={members}
                    levelMin={level.bandMin}
                    levelMax={level.bandMax}
                    colorByGender={colorByGender}
                  />
                </div>

                <div className="text-right text-sm tabular-nums text-ink-600">
                  {formatEUR(level.bandMin, lang)}
                </div>
                <div className="text-right text-sm font-semibold tabular-nums text-ink-900">
                  {formatEUR(level.bandMid, lang)}
                </div>
                <div className="text-right text-sm tabular-nums text-ink-600">
                  {formatEUR(level.bandMax, lang)}
                </div>
                <div className="text-right text-sm font-semibold tabular-nums text-ink-700">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-status-warn" />
            {t('bands.outliersTitle')}
          </CardTitle>
          <CardDescription>
            {outlierList.length} {t('common.employees').toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {outlierList.length === 0 ? (
            <div className="rounded-md border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">
              —
            </div>
          ) : (
            <ul className="space-y-2">
              {outlierList.slice(0, 12).map(({ employee, level, position }) => {
                const isAbove = position.status === 'aboveBand';
                return (
                  <li
                    key={employee.id}
                    className="flex items-center justify-between gap-4 rounded-md border border-ink-200/60 bg-surface-50 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          isAbove
                            ? 'bg-status-riskSoft text-red-700'
                            : 'bg-status-warnSoft text-amber-800',
                        )}
                      >
                        {isAbove ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-ink-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="truncate text-xs text-ink-500">
                          {departmentById[employee.departmentId].name[lang]} ·{' '}
                          {level.code} {level.name[lang]}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold tabular-nums text-ink-900">
                          {formatEUR(employee.baseSalary, lang)}
                        </div>
                        <div className="text-[11px] text-ink-500 tabular-nums">
                          {formatEUR(level.bandMin, lang)} – {formatEUR(level.bandMax, lang)}
                        </div>
                      </div>
                      <Badge variant={isAbove ? 'risk' : 'warn'}>
                        {isAbove ? t('bands.aboveBand') : t('bands.belowBand')}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          showToast(
                            `${t('bands.quickJustify')}: ${employee.firstName} ${employee.lastName}`,
                            'success',
                          )
                        }
                      >
                        {t('bands.quickJustify')}
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface BandStripProps {
  members: ReturnType<typeof distributionByLevel>[number]['members'];
  levelMin: number;
  levelMax: number;
  colorByGender: boolean;
}

function BandStrip({ members, levelMin, levelMax, colorByGender }: BandStripProps) {
  return (
    <div className="relative h-9 mt-1.5">
      <div className="absolute inset-y-3.5 left-0 right-0 rounded-full bg-integrata-100" />
      <div className="absolute inset-y-3.5 left-[20%] right-[20%] rounded-full bg-integrata-200" />
      <div className="absolute left-1/2 top-1.5 bottom-1.5 w-px bg-integrata-500/60" aria-hidden />
      {members.map(({ employee, position }) => {
        const left = Math.max(-4, Math.min(104, position.pct * 100));
        const isOutlier = position.status !== 'inBand';
        let color = 'bg-integrata-700';
        if (colorByGender) {
          color = employee.gender === 'female' ? 'bg-integrata-500' : 'bg-integrata-900';
        }
        if (isOutlier) {
          color = position.status === 'aboveBand' ? 'bg-status-risk' : 'bg-status-warn';
        }
        return (
          <span
            key={employee.id}
            title={`${employee.firstName} ${employee.lastName} · ${formatEUR(employee.baseSalary, 'fi')}`}
            className={cn(
              'absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface-0',
              color,
            )}
            style={{ left: `${left}%` }}
          />
        );
      })}
      <div className="pointer-events-none absolute inset-x-0 -top-0.5 flex justify-between text-[10px] uppercase tracking-wide text-ink-400">
        <span>min</span>
        <span>max</span>
      </div>
    </div>
  );
}

// re-export type so tsx can see the inferred member shape
export type _BandStripMembers = BandStripProps['members'];
// suppress unused
void bandPosition;
