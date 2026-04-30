import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { gapByDepartment } from '@/lib/analytics';
import { departmentById } from '@/data/departments';
import { useT } from '@/lib/i18n';

export function DepartmentGapBar() {
  const { lang, t } = useT();
  const data = gapByDepartment().map((d) => ({
    name: departmentById[d.departmentId].name[lang],
    mean: +(d.meanGap * 100).toFixed(1),
    median: +(d.medianGap * 100).toFixed(1),
    flagged: d.flagged,
    headcount: d.headcount,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={{ stroke: '#CBD5E1' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value: number, name) => [`${value}%`, name === 'mean' ? 'Mean' : 'Median']}
        />
        <ReferenceLine
          y={5}
          stroke="#DC2626"
          strokeDasharray="4 4"
          label={{ value: t('dashboard.threshold'), fill: '#DC2626', fontSize: 11, position: 'right' }}
        />
        <Bar dataKey="mean" radius={[4, 4, 0, 0]} maxBarSize={28}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.flagged ? '#DC2626' : '#2563A8'}
              fillOpacity={d.flagged ? 0.92 : 0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
