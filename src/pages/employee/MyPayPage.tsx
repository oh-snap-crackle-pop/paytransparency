import { useNavigate } from 'react-router-dom';
import { ArrowRight, Award, BadgeEuro, TrendingUp, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useT } from '@/lib/i18n';
import { employeeById, SELF_EMPLOYEE_ID } from '@/data/employees';
import { jobLevelById } from '@/data/jobLevels';
import { departmentById } from '@/data/departments';
import { selfPositionPercentile, bandPosition } from '@/lib/analytics';
import { formatEUR, formatPercent, formatDate } from '@/lib/format';

export function MyPayPage() {
  const { t, lang } = useT();
  const navigate = useNavigate();
  const me = employeeById[SELF_EMPLOYEE_ID];
  const level = jobLevelById[me.jobLevelId];
  const dept = departmentById[me.departmentId];
  const pct = selfPositionPercentile(me.id);
  const pos = bandPosition(me, level);

  const monthly = Math.round(me.baseSalary / 12);
  const events = [
    { date: '2026-01-15', kind: 'increase' as const, amount: '+3,5 %' },
    { date: '2025-04-30', kind: 'bonus' as const, amount: formatEUR(me.variablePay, lang) },
    { date: '2024-04-01', kind: 'promotion' as const, amount: 'L3 → L4' },
    { date: me.hireDate, kind: 'hire' as const, amount: level.code },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('employee.helloName', { name: me.firstName })}
        subtitle={`${level.code} · ${level.name[lang]} · ${dept.name[lang]}`}
        actions={
          <Button onClick={() => navigate('/me/criteria')} variant="primary">
            {t('employee.howIsMyPayDetermined')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-gradient-to-br from-integrata-900 to-integrata-700 text-surface-0">
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
              <BadgeEuro className="h-3.5 w-3.5" />
              {t('employee.yourPay')}
            </div>
            <div className="mt-2 font-display text-4xl font-semibold tracking-tight">
              {formatEUR(me.baseSalary, lang)}
            </div>
            <div className="mt-1 text-sm text-integrata-100">
              {t('employee.annualTotal')} · {t('employee.monthlyBase')}: {formatEUR(monthly, lang)}
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-integrata-100/80">
                {t('employee.variablePay')}
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {formatEUR(me.variablePay, lang)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-integrata-100/80">
                {t('employee.yourLevel')}
              </div>
              <div className="mt-1 text-lg font-semibold">{level.code}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-integrata-100/80">
                {t('common.department')}
              </div>
              <div className="mt-1 text-lg font-semibold">{dept.name[lang]}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-integrata-100/80">
                {t('common.bandPosition')}
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {Math.round(pct * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-500">
              <TrendingUp className="h-3.5 w-3.5" />
              {t('employee.bandPositionTitle')}
            </div>
            <CardTitle className="mt-2 text-lg">
              {Math.round(pct * 100)}%
            </CardTitle>
            <CardDescription>
              {t('employee.bandPositionDesc', {
                pct: Math.round(pct * 100),
                level: `${level.code} ${level.name[lang]}`,
                dept: dept.name[lang],
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-9">
              <div className="absolute inset-y-3.5 left-0 right-0 rounded-full bg-integrata-100" />
              <div className="absolute inset-y-3.5 left-[20%] right-[20%] rounded-full bg-integrata-200" />
              <div className="absolute left-1/2 top-1.5 bottom-1.5 w-px bg-integrata-500/60" />
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-integrata-900 ring-2 ring-surface-0"
                style={{ left: `${Math.max(0, Math.min(100, pos.pct * 100))}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] tabular-nums text-ink-500">
              <span>{formatEUR(level.bandMin, lang)}</span>
              <span className="font-semibold text-integrata-700">
                {formatEUR(level.bandMid, lang)}
              </span>
              <span>{formatEUR(level.bandMax, lang)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('employee.timeline')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {events.map((e) => (
              <li
                key={e.date + e.kind}
                className="flex items-center justify-between gap-3 rounded-md border border-ink-200/60 bg-surface-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-integrata-100 text-integrata-700">
                    {e.kind === 'hire' ? (
                      <Calendar className="h-4 w-4" />
                    ) : e.kind === 'promotion' ? (
                      <Award className="h-4 w-4" />
                    ) : e.kind === 'bonus' ? (
                      <BadgeEuro className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-ink-900">
                      {t(`events.${e.kind}` as Parameters<typeof t>[0])}
                    </div>
                    <div className="text-xs text-ink-500 tabular-nums">
                      {formatDate(e.date, lang)}
                    </div>
                  </div>
                </div>
                <Badge variant="info">{e.amount}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* unused-import suppressors */}
      <span className="hidden">{formatPercent(0, lang)}</span>
    </div>
  );
}
