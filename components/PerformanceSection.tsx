'use client';
import { useEffect, useRef, useState } from 'react';

const BAR_DATA = [
  { day: '月', requests: 82, color: '#3B82F6' },
  { day: '火', requests: 95, color: '#3B82F6' },
  { day: '水', requests: 71, color: '#3B82F6' },
  { day: '木', requests: 110, color: '#3B82F6' },
  { day: '金', requests: 134, color: '#F59E0B' },
  { day: '土', requests: 88, color: '#3B82F6' },
  { day: '日', requests: 147, color: '#22C55E' },
];

const MAX_VAL = 160;

export function PerformanceSection() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} aria-label="APIパフォーマンス統計">
      <div
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl"
        style={{ padding: '32px 28px' }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', margin: '0 0 8px' }}>
          今週のリクエスト数推移
        </h3>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 24px' }}>
          日曜: 147件（今週最多）
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            height: 120,
          }}
          role="img"
          aria-label="今週のAPIリクエスト数棒グラフ"
        >
          {BAR_DATA.map((item) => {
            const heightPct = (item.requests / MAX_VAL) * 100;
            return (
              <div
                key={item.day}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}
              >
                <span style={{ fontSize: 10, color: '#94A3B8' }}>{item.requests}</span>
                <div
                  style={{
                    width: '100%',
                    height: active ? `${heightPct}%` : '0%',
                    backgroundColor: item.color,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transitionDelay: `${BAR_DATA.indexOf(item) * 80}ms`,
                  }}
                  aria-label={`${item.day}曜日: ${item.requests}リクエスト`}
                />
                <span style={{ fontSize: 11, color: '#64748B' }}>{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}
      >
        {[
          { label: '今日の新着物件数', value: '147件', icon: '#22C55E' },
          { label: '全国対応エリア', value: '47都道府県', icon: '#3B82F6' },
          { label: 'API応答速度', value: '平均85ms', icon: '#F59E0B' },
        ].map((item) => (
          <div
            key={item.label}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl"
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
            aria-label={`${item.label}: ${item.value}`}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.icon, flexShrink: 0 }} aria-hidden="true" />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F8FAFC' }}>{item.value}</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
