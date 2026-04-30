import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { gapTrend } from '@/lib/analytics';

export function GapTrendLine() {
  const data = gapTrend().map((p) => ({
    quarter: p.quarter,
    gap: +(p.gap * 100).toFixed(2),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
        <defs>
          <linearGradient id="gapFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563A8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2563A8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#E2E8F0" vertical={false} />
        <XAxis
          dataKey="quarter"
          tick={{ fill: '#64748B', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: '#CBD5E1' }}
        />
        <YAxis
          tickFormatter={(v) => `${v}%`}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [`${v}%`, 'Mean gap']}
        />
        <ReferenceLine y={5} stroke="#DC2626" strokeDasharray="4 4" />
        <Area
          type="monotone"
          dataKey="gap"
          stroke="#15406B"
          strokeWidth={2.5}
          fill="url(#gapFill)"
          dot={{ r: 3, fill: '#15406B' }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
