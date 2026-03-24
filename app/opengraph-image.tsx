import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '競売物件データAPI - 裁判所競売情報をAPIで取得';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ゴールドトップバー */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: '#F59E0B',
          }}
        />

        {/* 背景グリッド装飾 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* バッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: 9999,
            padding: '8px 24px',
            marginBottom: 32,
            color: '#F59E0B',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          REST API / DaaS
        </div>

        {/* メインタイトル */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#F8FAFC',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          競売物件データAPI
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: 28,
            color: '#F59E0B',
            fontWeight: 700,
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          裁判所競売情報を、APIで。
        </div>

        {/* 特徴バッジ群 */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {['毎日自動更新', '47都道府県対応', '構造化JSON', 'Webhook通知'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                padding: '10px 20px',
                color: '#CBD5E1',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            color: 'rgba(148,163,184,0.8)',
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          auction-property-api.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
