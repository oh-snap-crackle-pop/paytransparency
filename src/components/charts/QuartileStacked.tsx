import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { quartileDistribution } from '@/lib/analytics';
import { useT } from '@/lib/i18n';

export function QuartileStacked() {
  const { t } = useT();
  const data = quartileDistribution().map((b) => {
    const total = b.female + b.male;
    return {
      name: `Q${b.quartile}`,
      female: total > 0 ? +((b.female / total) * 100).toFixed(1) : 0,
      male: total > 0 ? +((b.male / total) * 100).toFixed(1) : 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
        <CartesianGrid stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#CBD5E1' }} />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
          width={40}
        />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => `${v}%`}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: '#475569' }}
          formatter={(value) => (value === 'female' ? t('common.female') : t('common.male'))}
        />
        <Bar dataKey="female" stackId="a" fill="#2563A8" radius={[0, 0, 0, 0]} />
        <Bar dataKey="male" stackId="a" fill="#0A2540" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
