import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { useT } from '@/lib/i18n';
import { useToasts } from '@/lib/toast';
import { reviewProposals, reviewCycle } from '@/data/reviewCycle';
import { employeeById } from '@/data/employees';
import { departmentById } from '@/data/departments';
import { jobLevelById } from '@/data/jobLevels';
import { formatEUR, formatPercent } from '@/lib/format';

export function ReviewCyclePage() {
  const { t, lang } = useT();
  const showToast = useToasts((s) => s.show);
  const [decided, setDecided] = useState<Record<string, 'approved' | 'returned'>>({});

  const totalCount = reviewProposals.length;
  const flaggedCount = reviewProposals.filter((p) => p.biasFlag).length;

  function approve(id: string) {
    setDecided((d) => ({ ...d, [id]: 'approved' }));
    showToast(t('review.toastApproved'), 'success');
  }
  function sendBack(id: string) {
    setDecided((d) => ({ ...d, [id]: 'returned' }));
    showToast(t('review.toastReturned'), 'default');
  }
  function approveSafe() {
    const next = { ...decided };
    for (const p of reviewProposals) {
      if (!p.biasFlag && !next[p.id]) next[p.id] = 'approved';
    }
    setDecided(next);
    showToast(t('review.approveAll'), 'success');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('review.title')}
        subtitle={t('review.subtitle')}
        actions={
          <>
            <Badge variant="warn">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t('review.summary', { count: totalCount, flagged: flaggedCount })}
            </Badge>
            <Button onClick={approveSafe}>
              <CheckCircle2 className="h-4 w-4" />
              {t('review.approveAll')}
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-0 pt-0">
          <Table>
            <THead>
              <TR>
                <TH>{t('review.table.employee')}</TH>
                <TH>{t('review.table.role')}</TH>
                <TH className="text-right">{t('review.table.current')}</TH>
                <TH className="text-right">{t('review.table.proposed')}</TH>
                <TH className="text-right">{t('review.table.change')}</TH>
                <TH>{t('review.table.bias')}</TH>
                <TH className="text-right">{t('review.table.action')}</TH>
              </TR>
            </THead>
            <TBody>
              {reviewProposals.map((p) => {
                const emp = employeeById[p.employeeId];
                const level = jobLevelById[emp.jobLevelId];
                const status = decided[p.id];
                return (
                  <TR
                    key={p.id}
                    className={p.biasFlag ? 'bg-status-warnSoft/40' : ''}
                  >
                    <TD>
                      <div className="text-sm font-medium text-ink-900">
                        {emp.firstName} {emp.lastName}
                      </div>
                      <div className="text-xs text-ink-500">
                        {departmentById[emp.departmentId].name[lang]} ·{' '}
                        {emp.gender === 'female' ? t('common.female') : t('common.male')}
                      </div>
                    </TD>
                    <TD className="text-sm text-ink-700">
                      {level.code} · {level.name[lang]}
                    </TD>
                    <TD className="text-right text-sm tabular-nums text-ink-700">
                      {formatEUR(p.currentSalary, lang)}
                    </TD>
                    <TD className="text-right text-sm font-semibold tabular-nums text-ink-900">
                      {formatEUR(p.proposedSalary, lang)}
                    </TD>
                    <TD className="text-right text-sm font-semibold tabular-nums text-emerald-700">
                      +{formatPercent(p.changePct, lang)}
                    </TD>
                    <TD>
                      {p.biasFlag ? (
                        <Badge variant="warn">
                          <AlertTriangle className="h-3 w-3" />
                          {t('review.biasWarning')}
                        </Badge>
                      ) : (
                        <Badge variant="ok">{t('review.biasOk')}</Badge>
                      )}
                    </TD>
                    <TD className="text-right">
                      {status ? (
                        <Badge variant={status === 'approved' ? 'ok' : 'neutral'}>
                          {status === 'approved'
                            ? t('justifications.statusApproved')
                            : t('common.sendBack')}
                        </Badge>
                      ) : (
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" variant="outline" onClick={() => sendBack(p.id)}>
                            {t('common.sendBack')}
                          </Button>
                          <Button size="sm" onClick={() => approve(p.id)}>
                            {t('common.approve')}
                          </Button>
                        </div>
                      )}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-ink-500">
        {reviewCycle.label[lang]} · {reviewCycle.startDate} – {reviewCycle.endDate}
      </p>
    </div>
  );
}
