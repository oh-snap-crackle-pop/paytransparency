import { Eye, Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useT } from '@/lib/i18n';
import { useToasts } from '@/lib/toast';
import { formatDate } from '@/lib/format';

interface ReportTpl {
  titleKey: 'reports.article9Title' | 'reports.article10Title' | 'reports.article5Title';
  descKey: 'reports.article9Desc' | 'reports.article10Desc' | 'reports.article5Desc';
  due: string;
  badge: string;
  badgeVariant: 'info' | 'warn' | 'ok';
  exports: ('pdf' | 'xlsx')[];
}

const reports: ReportTpl[] = [
  {
    titleKey: 'reports.article9Title',
    descKey: 'reports.article9Desc',
    due: '2027-06-07',
    badge: 'EU 2023/970 · Art. 9',
    badgeVariant: 'info',
    exports: ['pdf', 'xlsx'],
  },
  {
    titleKey: 'reports.article10Title',
    descKey: 'reports.article10Desc',
    due: '2026-09-30',
    badge: 'EU 2023/970 · Art. 10',
    badgeVariant: 'warn',
    exports: ['pdf'],
  },
  {
    titleKey: 'reports.article5Title',
    descKey: 'reports.article5Desc',
    due: '—',
    badge: 'EU 2023/970 · Art. 5',
    badgeVariant: 'ok',
    exports: ['pdf'],
  },
];

const sharedLog = [
  { who: 'Henna Salminen', date: '2026-04-22', kind: 'rangeShared' as const },
  { who: 'Otto Niemi',     date: '2026-04-19', kind: 'requested'   as const, status: 'delivered' as const },
  { who: 'Iida Lehtonen',  date: '2026-04-15', kind: 'rangeShared' as const },
  { who: 'Veera Salo',     date: '2026-04-08', kind: 'requested'   as const, status: 'delivered' as const },
  { who: 'Sami Korhonen',  date: '2026-03-29', kind: 'rangeShared' as const },
];

export function ReportsPage() {
  const { t, lang } = useT();
  const showToast = useToasts((s) => s.show);

  function fakeExport(label: string, format: 'pdf' | 'xlsx') {
    showToast(`${label} (${format.toUpperCase()})`, 'success');
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.titleKey}>
            <CardHeader>
              <Badge variant={r.badgeVariant} className="mb-3">
                {r.badge}
              </Badge>
              <CardTitle className="text-lg">{t(r.titleKey)}</CardTitle>
              <CardDescription>{t(r.descKey)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2 text-xs text-ink-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{t('reports.nextDue')}:</span>
                <span className="font-semibold tabular-nums text-ink-700">
                  {r.due === '—' ? '—' : formatDate(r.due, lang)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => showToast(t('common.preview'), 'default')}>
                  <Eye className="h-3.5 w-3.5" />
                  {t('common.preview')}
                </Button>
                {r.exports.includes('pdf') && (
                  <Button size="sm" onClick={() => fakeExport(t(r.titleKey), 'pdf')}>
                    <FileText className="h-3.5 w-3.5" />
                    PDF
                  </Button>
                )}
                {r.exports.includes('xlsx') && (
                  <Button size="sm" variant="secondary" onClick={() => fakeExport(t(r.titleKey), 'xlsx')}>
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Excel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('reports.sharedLogTitle')}</CardTitle>
          <CardDescription>{t('reports.sharedLogSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-ink-200/60">
            {sharedLog.map((row, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-integrata-100 text-xs font-semibold text-integrata-900">
                    {row.who.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-900">{row.who}</div>
                    <div className="text-xs text-ink-500 tabular-nums">
                      {formatDate(row.date, lang)}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={row.kind === 'rangeShared' ? 'info' : 'ok'}
                  className="capitalize"
                >
                  <Download className="h-3 w-3" />
                  {row.kind === 'rangeShared'
                    ? t('reports.rangeShared')
                    : t('reports.delivered')}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
