import { Layers3, LineChart, Target, Sparkles, Send } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useT } from '@/lib/i18n';
import { useToasts } from '@/lib/toast';
import { employeeById, SELF_EMPLOYEE_ID } from '@/data/employees';
import { jobLevelById } from '@/data/jobLevels';
import { departmentById } from '@/data/departments';
import { bandMedianForLevel } from '@/lib/analytics';
import { formatEUR } from '@/lib/format';

const criteria = [
  { iconKey: 'level', icon: Layers3, titleKey: 'employee.criteriaJobLevel', descKey: 'employee.criteriaJobLevelDesc' },
  { iconKey: 'market', icon: LineChart, titleKey: 'employee.criteriaMarket', descKey: 'employee.criteriaMarketDesc' },
  { iconKey: 'performance', icon: Target, titleKey: 'employee.criteriaPerformance', descKey: 'employee.criteriaPerformanceDesc' },
  { iconKey: 'scarce', icon: Sparkles, titleKey: 'employee.criteriaScarcity', descKey: 'employee.criteriaScarcityDesc' },
] as const;

export function CriteriaPage() {
  const { t, lang } = useT();
  const showToast = useToasts((s) => s.show);
  const me = employeeById[SELF_EMPLOYEE_ID];
  const level = jobLevelById[me.jobLevelId];
  const dept = departmentById[me.departmentId];
  const median = bandMedianForLevel(me.jobLevelId, me.departmentId);

  const myPosition = (me.baseSalary - level.bandMin) / (level.bandMax - level.bandMin);
  const medianPosition = (median - level.bandMin) / (level.bandMax - level.bandMin);

  return (
    <div className="space-y-6">
      <PageHeader title={t('employee.criteriaTitle')} subtitle={t('employee.criteriaSubtitle')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {criteria.map((c) => (
          <Card key={c.titleKey}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-integrata-100 text-integrata-700">
                <c.icon className="h-5 w-5" />
              </div>
              <CardTitle className="mt-3 text-base">{t(c.titleKey)}</CardTitle>
              <CardDescription>{t(c.descKey)}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('employee.comparisonTitle')}</CardTitle>
          <CardDescription>{t('employee.comparisonDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-surface-50 p-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
              {level.code} · {level.name[lang]} · {dept.name[lang]}
            </div>
            <div className="relative h-14">
              <div className="absolute inset-y-5 left-0 right-0 rounded-full bg-integrata-100" />
              <div className="absolute inset-y-5 left-[20%] right-[20%] rounded-full bg-integrata-200" />
              <span
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${Math.max(0, Math.min(100, medianPosition * 100))}%` }}
              >
                <span className="block h-3.5 w-3.5 rounded-full bg-integrata-500 ring-2 ring-surface-0" />
                <span className="absolute left-1/2 mt-1 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wide text-integrata-700">
                  {t('employee.bandMedian')}
                </span>
              </span>
              <span
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${Math.max(0, Math.min(100, myPosition * 100))}%` }}
              >
                <span className="block h-4 w-4 rounded-full bg-integrata-900 ring-2 ring-surface-0" />
                <span className="absolute left-1/2 -mt-6 -translate-x-1/2 rounded bg-integrata-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-surface-0">
                  {t('employee.you')}
                </span>
              </span>
            </div>
            <div className="mt-3 flex justify-between text-[11px] tabular-nums text-ink-500">
              <span>{formatEUR(level.bandMin, lang)}</span>
              <span>{formatEUR(level.bandMid, lang)}</span>
              <span>{formatEUR(level.bandMax, lang)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-200/60 pt-4">
              <div>
                <div className="text-xs text-ink-500">{t('employee.you')}</div>
                <div className="font-display text-xl font-semibold tabular-nums text-ink-900">
                  {formatEUR(me.baseSalary, lang)}
                </div>
              </div>
              <div>
                <div className="text-xs text-ink-500">{t('employee.bandMedian')}</div>
                <div className="font-display text-xl font-semibold tabular-nums text-integrata-700">
                  {formatEUR(median, lang)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              variant="outline"
              onClick={() => showToast(t('employee.requestSent'), 'success')}
            >
              <Send className="h-4 w-4" />
              {t('employee.requestInfo')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
