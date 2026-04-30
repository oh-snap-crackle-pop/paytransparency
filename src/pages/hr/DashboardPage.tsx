import { ArrowRight, ShieldCheck, ShieldAlert, Users, TrendingDown, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { KpiCard } from '@/components/shared/KpiCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DepartmentGapBar } from '@/components/charts/DepartmentGapBar';
import { QuartileStacked } from '@/components/charts/QuartileStacked';
import { GapTrendLine } from '@/components/charts/GapTrendLine';
import { useT } from '@/lib/i18n';
import { headline, gapByDepartment } from '@/lib/analytics';
import { departmentById } from '@/data/departments';
import { formatPercent, formatNumber } from '@/lib/format';

export function DashboardPage() {
  const { t, lang } = useT();
  const navigate = useNavigate();
  const h = headline();
  const flagged = gapByDepartment()
    .filter((d) => d.flagged)
    .sort((a, b) => b.meanGap - a.meanGap);

  const compliant = h.flaggedDepartments === 0;

  return (
    <div className="space-y-6">
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t('dashboard.kpiMeanGap')}
          value={formatPercent(h.meanGap, lang)}
          hint={t('dashboard.threshold')}
          variant={h.meanGap >= 0.05 ? 'risk' : 'ok'}
          icon={<Scale className="h-4 w-4" />}
          trend={{ delta: '0.7 pp', direction: 'down' }}
        />
        <KpiCard
          label={t('dashboard.kpiMedianGap')}
          value={formatPercent(h.medianGap, lang)}
          hint={t('dashboard.threshold')}
          variant={h.medianGap >= 0.05 ? 'risk' : 'ok'}
          icon={<TrendingDown className="h-4 w-4" />}
          trend={{ delta: '0.4 pp', direction: 'down' }}
        />
        <KpiCard
          label={t('dashboard.kpiHeadcount')}
          value={formatNumber(h.headcount, lang)}
          hint="Q1 2026"
          icon={<Users className="h-4 w-4" />}
        />
        <KpiCard
          label={t('dashboard.kpiCompliance')}
          value={
            <span className="inline-flex items-center gap-2">
              {compliant ? (
                <ShieldCheck className="h-7 w-7" />
              ) : (
                <ShieldAlert className="h-7 w-7" />
              )}
              <span className="text-xl">
                {compliant ? t('common.inCompliance') : t('common.actionRequired')}
              </span>
            </span>
          }
          hint={
            compliant
              ? 'EU 2023/970'
              : `${h.flaggedDepartments} ${t('common.departments').toLowerCase()} > 5 %`
          }
          variant={compliant ? 'ok' : 'warn'}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.byDepartment')}</CardTitle>
            <CardDescription>{t('dashboard.byDepartmentSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <DepartmentGapBar />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.actionTitle')}</CardTitle>
            <CardDescription>
              {flagged.length} {t('common.departments').toLowerCase()} ≥ 5 %
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {flagged.slice(0, 5).map((d) => (
                <li
                  key={d.departmentId}
                  className="flex items-center justify-between gap-3 rounded-md border border-ink-200/60 bg-surface-50 p-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-ink-900">
                      {departmentById[d.departmentId].name[lang]}
                    </div>
                    <div className="text-xs text-ink-500">
                      {d.headcount} {t('common.employees').toLowerCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="risk">{formatPercent(d.meanGap, lang)}</Badge>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full"
              variant="primary"
              onClick={() => navigate('/hr/justifications')}
            >
              {t('dashboard.openAssessment')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quartileTitle')}</CardTitle>
            <CardDescription>{t('dashboard.quartileSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <QuartileStacked />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.trendTitle')}</CardTitle>
            <CardDescription>{t('dashboard.trendSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <GapTrendLine />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
