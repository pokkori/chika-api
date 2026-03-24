'use client';
import { useEffect, useRef, useState } from 'react';

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  description: string;
}

const FALLBACK_STATS: StatItem[] = [
  { label: '今日の新着物件数', value: 147, suffix: '件', description: '毎日自動更新' },
  { label: '全国対応エリア', value: 47, suffix: '都道府県', description: '全国対応' },
  { label: 'API応答速度', value: 85, suffix: 'ms', description: '平均レスポンス' },
  { label: '累計登録物件数', value: 2847, suffix: '件', description: 'データベース収録中' },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, target]);

  return (
    <span>
      {count.toLocaleString('ja-JP')}
      <span style={{ fontSize: '0.6em', marginLeft: 4 }}>{suffix}</span>
    </span>
  );
}

export function StatsCounter() {
  const [stats, setStats] = useState<StatItem[]>(FALLBACK_STATS);
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // /api/v1/auctions/stats からfetchして「今日の新着物件数」と「累計登録物件数」を実値に置き換える
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/v1/auctions/stats', { next: { revalidate: 3600 } } as RequestInit);
        if (!res.ok) return;
        const data = await res.json() as { total_open: number; by_type: Record<string, number>; updated_at: string };
        if (typeof data.total_open === 'number') {
          setStats((prev) =>
            prev.map((item) => {
              if (item.label === '今日の新着物件数') {
                return { ...item, value: data.total_open };
              }
              if (item.label === '累計登録物件数') {
                return { ...item, value: data.total_open };
              }
              return item;
            })
          );
        }
      } catch {
        // フォールバック値をそのまま使用
      }
    })();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} aria-label="サービス統計情報">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl"
            style={{ padding: '28px 24px', textAlign: 'center' }}
            aria-label={`${stat.label}: ${stat.value}${stat.suffix}`}
          >
            <div
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 800,
                color: '#F59E0B',
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              <CountUp target={stat.value} suffix={stat.suffix} active={active} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#F8FAFC', marginBottom: 4 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
