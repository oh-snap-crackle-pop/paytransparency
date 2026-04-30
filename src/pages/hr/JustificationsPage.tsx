import { useState } from 'react';
import { Download, ShieldCheck, Lock, FileText } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Sheet } from '@/components/ui/Sheet';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { useT } from '@/lib/i18n';
import { useToasts } from '@/lib/toast';
import { justifications, type Justification } from '@/data/justifications';
import { employeeById } from '@/data/employees';
import { departmentById } from '@/data/departments';
import { formatEUR, formatDate, formatPercent } from '@/lib/format';

const categoryVariant: Record<Justification['category'], 'info' | 'neutral' | 'warn' | 'ok'> = {
  seniority: 'neutral',
  market: 'info',
  performance: 'ok',
  scarce: 'warn',
  promotion: 'info',
  correction: 'warn',
};

export function JustificationsPage() {
  const { t, lang } = useT();
  const showToast = useToasts((s) => s.show);
  const [active, setActive] = useState<Justification | null>(null);

  const sorted = [...justifications].sort(
    (a, b) => new Date(b.decidedAt).getTime() - new Date(a.decidedAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('justifications.title')}
        subtitle={t('justifications.subtitle')}
        actions={
          <Button
            variant="primary"
            onClick={() => showToast(t('justifications.exportLog'), 'success')}
          >
            <Download className="h-4 w-4" />
            {t('justifications.exportLog')}
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0 pt-0">
          <Table>
            <THead>
              <TR>
                <TH>{t('justifications.table.employee')}</TH>
                <TH>{t('justifications.table.change')}</TH>
                <TH>{t('justifications.table.decidedBy')}</TH>
                <TH>{t('justifications.table.date')}</TH>
                <TH>{t('justifications.table.category')}</TH>
                <TH className="text-right">{t('justifications.table.status')}</TH>
              </TR>
            </THead>
            <TBody>
              {sorted.map((j) => {
                const emp = employeeById[j.employeeId];
                return (
                  <TR
                    key={j.id}
                    className="cursor-pointer"
                    onClick={() => setActive(j)}
                  >
                    <TD>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-integrata-100 text-xs font-semibold text-integrata-900">
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-ink-900">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-xs text-ink-500">
                            {departmentById[emp.departmentId].name[lang]} · {emp.jobLevelId}
                          </div>
                        </div>
                      </div>
                    </TD>
                    <TD className="tabular-nums">
                      <div className="text-sm font-semibold text-emerald-700">
                        +{formatPercent(j.changePct, lang)}
                      </div>
                      <div className="text-xs text-ink-500">
                        {formatEUR(j.fromSalary, lang)} → {formatEUR(j.toSalary, lang)}
                      </div>
                    </TD>
                    <TD className="text-sm text-ink-700">{j.decidedBy}</TD>
                    <TD className="text-sm text-ink-700 tabular-nums">
                      {formatDate(j.decidedAt, lang)}
                    </TD>
                    <TD>
                      <Badge variant={categoryVariant[j.category]}>
                        {t(`justifications.categories.${j.category}` as Parameters<typeof t>[0])}
                      </Badge>
                    </TD>
                    <TD className="text-right">
                      <Badge variant={j.status === 'approved' ? 'ok' : 'warn'}>
                        {j.status === 'approved'
                          ? t('justifications.statusApproved')
                          : t('justifications.statusPending')}
                      </Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        title={t('justifications.drawerTitle')}
        description={active?.id}
      >
        {active && (
          <div className="space-y-6">
            <div className="rounded-md border border-ink-200 bg-surface-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-integrata-100 text-sm font-semibold text-integrata-900">
                  {employeeById[active.employeeId].firstName[0]}
                  {employeeById[active.employeeId].lastName[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">
                    {employeeById[active.employeeId].firstName}{' '}
                    {employeeById[active.employeeId].lastName}
                  </div>
                  <div className="text-xs text-ink-500">
                    {departmentById[employeeById[active.employeeId].departmentId].name[lang]} ·{' '}
                    {employeeById[active.employeeId].jobLevelId}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat label={t('justifications.table.change')} value={`+${formatPercent(active.changePct, lang)}`} />
              <Stat
                label={t('common.salary')}
                value={`${formatEUR(active.fromSalary, lang)} → ${formatEUR(active.toSalary, lang)}`}
              />
              <Stat label={t('justifications.table.decidedBy')} value={active.decidedBy} />
              <Stat
                label={t('justifications.table.date')}
                value={formatDate(active.decidedAt, lang)}
              />
            </div>

            <div>
              <Badge variant={categoryVariant[active.category]} className="mb-2">
                {t(`justifications.categories.${active.category}` as Parameters<typeof t>[0])}
              </Badge>
              <p className="text-sm leading-relaxed text-ink-800 text-pretty">
                {active.rationale[lang]}
              </p>
            </div>

            {active.attachments.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  {t('justifications.attachments')}
                </div>
                <ul className="space-y-1.5">
                  {active.attachments.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 rounded-md border border-ink-200 bg-surface-0 px-3 py-2 text-xs text-ink-700"
                    >
                      <FileText className="h-3.5 w-3.5 text-ink-500" />
                      <span className="truncate">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-status-okSoft px-3 py-2 text-xs text-emerald-900">
              <Lock className="h-3.5 w-3.5" />
              <span>{t('justifications.immutable')}</span>
              <ShieldCheck className="ml-auto h-3.5 w-3.5" />
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-200 bg-surface-0 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-ink-900">{value}</div>
    </div>
  );
}
