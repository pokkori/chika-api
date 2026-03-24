'use client';
import {
  BarChart,
  Bar,
  Cell,
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

function getBarColor(count: number, dailyLimit: number): string {
  if (dailyLimit <= 0) return '#3B82F6';
  const ratio = count / dailyLimit;
  if (ratio >= 0.8) return '#EF4444'; // 80%以上: 赤・危険
  if (ratio >= 0.6) return '#F59E0B'; // 60〜80%: 黄・警告
  return '#3B82F6';                   // 0〜60%: 青
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
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.count, dailyLimit)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
