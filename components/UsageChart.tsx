'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface UsageData {
  date: string;
  count: number;
}

interface UsageChartProps {
  data: UsageData[];
  dailyLimit: number;
}

export function UsageChart({ data, dailyLimit }: UsageChartProps) {
  return (
    <div
      role="img"
      aria-label="過去30日間のAPI使用量グラフ"
      style={{ width: '100%', height: 300 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#334155' }}
            domain={[0, dailyLimit]}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#F8FAFC', fontSize: 14 }}
            formatter={(value: number) => [`${value.toLocaleString()} リクエスト`, '使用量']}
          />
          <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
