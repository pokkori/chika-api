'use client';
import { useState } from 'react';
import { PlanCard } from '@/components/PlanCard';
import { CopyableCode } from '@/components/CopyableCode';
import { StreakBadge } from '@/components/StreakBadge';
import { StatsCounter } from '@/components/StatsCounter';
import { PerformanceSection } from '@/components/PerformanceSection';

const curlExample = `curl -H "X-API-Key: YOUR_API_KEY" \\
  "https://auction-property-api.vercel.app/api/v1/auctions?prefecture=13&status=open"`;

const SHARE_TEXT = encodeURIComponent(
  '競売物件データAPI - 裁判所競売情報をAPIで取得。毎日自動更新の競売・訳あり物件データ #競売物件 #不動産投資 #API https://auction-property-api.vercel.app'
);

export default function HomePage() {
  const [planEmail, setPlanEmail] = useState('');
  const [planLoading, setPlanLoading] = useState<string | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<string | null>(null);

  const handlePlanSelect = async (plan: string) => {
    if (plan === 'free') {
      window.location.href = '/api/auth/register';
      return;
    }
    if (plan === 'enterprise') {
      window.location.href = '/invoice';
      return;
    }
    // Starter / Basic / Pro: KOMOJUチェックアウト
    setShowEmailModal(plan);
  };

  const handleCheckout = async () => {
    if (!planEmail.trim() || !showEmailModal) return;
    setPlanLoading(showEmailModal);
    setPlanError(null);
    try {
      const res = await fetch('/api/komoju/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: showEmailModal, email: planEmail.trim() }),
      });
      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        setPlanError(data.error || '決済セッションの作成に失敗しました。しばらく後にお試しください。');
        setPlanLoading(null);
      }
    } catch {
      setPlanError('通信エラーが発生しました。しばらく後にお試しください。');
      setPlanLoading(null);
    }
  };

  return (
    <main
      style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}
      aria-label="競売物件データAPI トップページ"
    >
      {/* Hero */}
      <section
        aria-label="サービス紹介"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        <div
          className="inline-block backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg rounded-2xl"
          style={{
            color: '#F59E0B',
            padding: '4px 16px',
            fontSize: 14,
            marginBottom: 24,
          }}
        >
          無料プランあり - クレジットカード不要
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 24px',
            color: '#F8FAFC',
          }}
        >
          競売物件データAPI
          <StreakBadge streakKey="auction_api" />
          <br />
          <span style={{ color: '#F59E0B' }}>裁判所競売情報を、APIで。</span>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: '#94A3B8',
            maxWidth: 600,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}
        >
          裁判所の競売物件・訳あり激安物件データを毎日自動収集。
          REST APIで即時取得。不動産投資家・テック企業向け。
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/api/auth/register"
            aria-label="無料で競売物件データAPIを始める"
            className="hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300"
            style={{
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
            }}
          >
            無料で始める
          </a>
          <a
            href="/docs#sandbox"
            aria-label="登録不要のサンドボックスAPIを今すぐ試す"
            className="hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300"
            style={{
              backgroundColor: 'transparent',
              color: '#F59E0B',
              padding: '14px 28px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
              border: '1px solid rgba(245,158,11,0.4)',
              gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l6 5-6 5V3z" fill="#F59E0B" />
            </svg>
            サンドボックスで今すぐ試す（登録不要）
          </a>
          <a
            href="/docs"
            aria-label="APIドキュメントを見る"
            className="hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: 'transparent',
              color: '#F8FAFC',
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
              border: '1px solid #334155',
            }}
          >
            APIドキュメント
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${SHARE_TEXT}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="競売物件データAPIをXでシェアする"
            className="bg-black text-white rounded-lg px-4 py-2 hover:scale-105 transition-all duration-300"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              minHeight: 44,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xでシェア
          </a>
        </div>
      </section>

      {/* Stats Counter */}
      <section
        aria-label="サービス統計"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px 60px',
        }}
      >
        <StatsCounter />
      </section>

      {/* Features */}
      <section
        aria-label="サービスの特徴"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 48, color: '#F8FAFC' }}
        >
          競売物件データAPIの特徴
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#1E293B" />
                  <path d="M8 22l4-8 4 4 4-12 4 8" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: '毎日自動更新',
              desc: 'Vercel Cronで毎日午前9時に裁判所公示情報をクロール。常に最新の競売物件データを提供。',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#1E293B" />
                  <circle cx="16" cy="16" r="6" stroke="#F59E0B" strokeWidth="2.5" />
                  <path d="M16 8v3M16 21v3M8 16h3M21 16h3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
              title: '47都道府県対応',
              desc: '全国の地方裁判所・支部の競売物件情報を網羅。都市部から地方の掘り出し物件まで一括取得。',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#1E293B" />
                  <path d="M10 22V14M16 22V10M22 22V16" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              ),
              title: '構造化データ',
              desc: '裁判所HTML→構造化JSONに変換済み。物件種別・面積・売却基準額・入札期限を即座に取得可能。',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg rounded-2xl hover:-translate-y-1 transition-transform duration-300"
              style={{
                padding: 28,
              }}
            >
              <div style={{ marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BIT Comparison */}
      <section
        aria-label="競売物件データAPI vs BIT 比較表"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#F8FAFC' }}
        >
          競売物件データAPI vs BIT（裁判所Webサイト）
        </h2>
        <p style={{ fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 40 }}>
          手動でBITを確認する時代は終わりました
        </p>
        <div
          className="backdrop-blur-md bg-white/5 border border-white/10"
          style={{ borderRadius: 16, overflow: 'hidden' }}
        >
          <table
            aria-label="競売物件データAPIとBITの機能比較表"
            style={{ width: '100%', borderCollapse: 'collapse' }}
          >
            <thead>
              <tr style={{ backgroundColor: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>
                  比較項目
                </th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 15, color: '#F59E0B', fontWeight: 700 }}>
                  競売物件データAPI
                </th>
                <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 14, color: '#64748B', fontWeight: 600 }}>
                  BIT（裁判所Webサイト）
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { item: 'データ形式', api: '構造化JSON（即時パース可）', bit: 'HTML（スクレイピング必要）' },
                { item: 'API対応', api: 'REST API（全エンドポイント）', bit: 'なし' },
                { item: 'Webhook通知', api: '条件フィルタ付き自動通知', bit: 'なし' },
                { item: 'Sandboxモード', api: 'デモAPIキーで即試用', bit: 'なし' },
                { item: '自動更新', api: '毎日午前9時に全国自動クロール', bit: '手動確認が必要' },
                { item: '47都道府県', api: '全国一括取得可', bit: '都道府県ごとに個別アクセス' },
                { item: 'フィルタリング', api: '価格帯・物件種別・地域で絞込み', bit: '絞込機能が限定的' },
              ].map(({ item, api, bit }, i) => (
                <tr
                  key={item}
                  style={{
                    borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <td style={{ padding: '14px 20px', fontSize: 14, color: '#CBD5E1', fontWeight: 600 }}>
                    {item}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#22C55E' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8l4 4 6-7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {api}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#64748B' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 4l8 8M12 4l-8 8" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {bit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a
            href="/api/auth/register"
            aria-label="無料で競売物件データAPIを始める"
            className="hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300"
            style={{
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
            }}
          >
            無料で始める
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section
        aria-label="ユーザーの声"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#F8FAFC' }}
        >
          ユーザーの声
        </h2>
        <p style={{ fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 48 }}>
          不動産投資家からエンジニアまで幅広くご利用いただいています
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {[
            {
              quote: '不動産投資の物件探しが劇的に効率化されました。毎朝APIで最新情報を自動取得しています。',
              name: '田中様',
              role: '不動産投資家',
              region: '東京都',
            },
            {
              quote: 'Webhook連携でSlack通知を設定したら、良物件を見逃すことがなくなりました。',
              name: '山田様',
              role: '不動産仲介業',
              region: '大阪府',
            },
            {
              quote: 'Sandbox APIで開発・テストして本番移行がスムーズでした。ドキュメントも充実しています。',
              name: '鈴木様',
              role: 'フィンテックエンジニア',
              region: '福岡県',
            },
          ].map((t) => (
            <div
              key={t.name}
              className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg rounded-2xl hover:-translate-y-1 transition-transform duration-300"
              style={{ padding: 28 }}
            >
              {/* 引用符SVGアイコン */}
              <svg
                width="36"
                height="28"
                viewBox="0 0 36 28"
                fill="none"
                aria-hidden="true"
                style={{ marginBottom: 16 }}
              >
                <path
                  d="M0 28V17.6C0 13.493 1.067 10.08 3.2 7.36 5.387 4.587 8.587 2.507 12.8 1.12L14.88 4.48C12.16 5.44 10.08 6.827 8.64 8.64 7.253 10.4 6.56 12.373 6.56 14.56H13.44V28H0ZM22.56 28V17.6C22.56 13.493 23.627 10.08 25.76 7.36 27.947 4.587 31.147 2.507 35.36 1.12L37.44 4.48C34.72 5.44 32.64 6.827 31.2 8.64 29.813 10.4 29.12 12.373 29.12 14.56H36V28H22.56Z"
                  fill="#F59E0B"
                  fillOpacity="0.5"
                />
              </svg>
              <p
                style={{
                  fontSize: 15,
                  color: '#CBD5E1',
                  lineHeight: 1.75,
                  margin: '0 0 24px',
                }}
              >
                {t.quote}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#0F172A',
                  }}
                  aria-hidden="true"
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
                    {t.name}
                  </p>
                  <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>
                    {t.role}（{t.region}）
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Code Sample */}
      <section
        aria-label="APIサンプルコード"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#F8FAFC' }}
        >
          3行で競売物件データを取得
        </h2>
        <p style={{ fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 32 }}>
          APIキーを取得したらすぐに使えます
        </p>
        <CopyableCode code={curlExample} language="bash" />
      </section>

      {/* Performance Section */}
      <section
        aria-label="APIパフォーマンス"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px 60px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#F8FAFC' }}
        >
          APIパフォーマンス
        </h2>
        <p style={{ fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 32 }}>
          安定稼働・高速レスポンスを実現
        </p>
        <PerformanceSection />
      </section>

      {/* Pricing */}
      <section
        id="plans"
        aria-label="料金プラン一覧"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#F8FAFC' }}
        >
          料金プラン
        </h2>
        <p style={{ fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 48 }}>
          無料プランから始めて、必要に応じてアップグレード
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {(['free', 'starter', 'basic', 'pro', 'enterprise'] as const).map((plan) => (
            <PlanCard key={plan} plan={plan} onSelect={handlePlanSelect} />
          ))}
        </div>

        {/* メールアドレス入力モーダル */}
        {showEmailModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${showEmailModal}プランのチェックアウト`}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 24,
            }}
          >
            <div
              className="backdrop-blur-md bg-white/5 border border-white/20 shadow-2xl"
              style={{ borderRadius: 16, padding: 32, maxWidth: 440, width: '100%' }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', margin: '0 0 8px' }}>
                {showEmailModal.charAt(0).toUpperCase() + showEmailModal.slice(1)}プランへアップグレード
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', margin: '0 0 20px', lineHeight: 1.6 }}>
                メールアドレスを入力してKOMOJU決済へ進みます。
              </p>
              <label htmlFor="checkout-email" style={{ fontSize: 14, color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                メールアドレス
              </label>
              <input
                id="checkout-email"
                type="email"
                aria-label="KOMOJUチェックアウト用メールアドレスを入力"
                placeholder="you@example.com"
                value={planEmail}
                onChange={(e) => setPlanEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCheckout(); }}
                style={{
                  width: '100%',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 15,
                  minHeight: 44,
                  marginBottom: 16,
                  boxSizing: 'border-box',
                }}
              />
              {planError && (
                <p style={{ fontSize: 13, color: '#EF4444', marginBottom: 12 }}>{planError}</p>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={handleCheckout}
                  disabled={!!planLoading || !planEmail.trim()}
                  aria-label="KOMOJUチェックアウトへ進む"
                  style={{
                    flex: 1,
                    backgroundColor: planLoading ? '#334155' : '#F59E0B',
                    color: planLoading ? '#F8FAFC' : '#0F172A',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 20px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: planLoading ? 'not-allowed' : 'pointer',
                    minHeight: 44,
                  }}
                >
                  {planLoading ? '処理中...' : '決済へ進む'}
                </button>
                <button
                  onClick={() => { setShowEmailModal(null); setPlanError(null); setPlanEmail(''); }}
                  aria-label="チェックアウトをキャンセル"
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#94A3B8',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: '12px 20px',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    minHeight: 44,
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 請求書払い案内 */}
        <div
          className="backdrop-blur-sm bg-white/5 border border-white/10"
          style={{
            borderRadius: 16,
            padding: '24px 28px',
            marginTop: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#F8FAFC', margin: '0 0 6px' }}>
              法人・官公庁向け 請求書払い対応
            </h3>
            <p style={{ fontSize: 14, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
              クレジットカード不要。インボイス対応の請求書払いをご利用いただけます。
              お申し込み後3営業日以内にご連絡します。
            </p>
          </div>
          <a
            href="/invoice"
            aria-label="請求書払いの申請フォームへ移動する"
            className="hover:scale-105 transition-all duration-200"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'transparent',
              color: '#F59E0B',
              textDecoration: 'none',
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              minHeight: 44,
              border: '1px solid rgba(245,158,11,0.4)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="3" y="2" width="10" height="12" rx="1.5" stroke="#F59E0B" strokeWidth="1.5" />
              <path d="M6 6h4M6 8.5h4M6 11h2" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            請求書払いを申請する
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-label="よくある質問"
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 40, color: '#F8FAFC' }}
        >
          よくある質問
        </h2>
        {[
          {
            q: 'APIキーはすぐに発行されますか？',
            a: 'はい。メールアドレスを登録するだけで即座に発行されます。クレジットカードは不要です。',
          },
          {
            q: 'データの更新頻度はどのくらいですか？',
            a: '裁判所公示情報に基づき毎日自動更新されます。更新時刻は日本時間午前9時です。',
          },
          {
            q: '商用利用は可能ですか？',
            a: 'はい。Basicプラン以上で商用利用が可能です。Freeプランは個人・試作目的のみとなります。',
          },
          {
            q: 'Webhook通知はどのプランから使えますか？',
            a: 'BasicプランおよびProプラン以上でご利用いただけます。指定条件（都道府県・物件種別・価格帯）に合致する新着物件を自動通知します。',
          },
          {
            q: '画像データは含まれますか？',
            a: 'はい、物件写真URLが含まれます（画像ファイル自体はBITリンクです）。',
          },
          {
            q: '稼働率（SLA）はどのくらいですか？',
            a: '99.5%以上のアップタイムを保証しています。Businessプラン以上ではSLA証明書を発行します。',
          },
          {
            q: '解約はいつでも可能ですか？',
            a: 'はい、月次契約のため翌月に解約可能です。年間契約は期間中の解約は対応しておりません。',
          },
          {
            q: '無料トライアルはありますか？',
            a: 'Sandboxモード（デモAPIキー）で制限付き無料試用が可能です。本番APIは7日間無料トライアル付きです。',
          },
          {
            q: 'KOMOJUでの決済はいつ開始しますか？',
            a: '現在KOMOJU審査中です。審査通過後にBasic/Pro/Enterpriseプランのお申し込みが可能になります。',
          },
          {
            q: '請求書払い（インボイス）には対応していますか？',
            a: 'はい。法人・官公庁向けに請求書払いを提供しています。/invoice ページからお申し込みください。インボイス登録番号の発行にも対応しています。',
          },
        ].map(({ q, a }) => (
          <details
            key={q}
            className="backdrop-blur-md bg-white/5 border border-white/10"
            style={{
              borderRadius: 8,
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            <summary
              aria-label={q}
              style={{
                padding: '16px 20px',
                fontSize: 16,
                fontWeight: 600,
                color: '#F8FAFC',
                cursor: 'pointer',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: 44,
              }}
            >
              {q}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p style={{ padding: '0 20px 16px', fontSize: 14, color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>
              {a}
            </p>
          </details>
        ))}
      </section>

      {/* Share Section */}
      <section
        aria-label="シェアセクション"
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '0 24px 60px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 16 }}>
          競売物件データAPIを知人・同僚にシェアしよう
        </p>
        <a
          href={`https://twitter.com/intent/tweet?text=${SHARE_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="競売物件データAPIをXでシェアする"
          className="bg-black text-white rounded-lg px-4 py-2 hover:scale-105 transition-all duration-300"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 44,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Xでシェアする
        </a>
      </section>

      {/* Footer */}
      <footer
        aria-label="フッター"
        style={{
          borderTop: '1px solid #1E293B',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <nav aria-label="フッターナビゲーション">
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <a
              href="/docs"
              aria-label="APIドキュメントページへ"
              style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              Docs
            </a>
            <a
              href="/webhooks"
              aria-label="Webhook設定ページへ"
              style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              Webhooks
            </a>
            <a
              href="/invoice"
              aria-label="請求書払い申請ページへ"
              style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              請求書払い
            </a>
            <a
              href="/dashboard"
              aria-label="ダッシュボードページへ"
              style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              ダッシュボード
            </a>
            <a
              href="/legal"
              aria-label="特商法表記ページへ"
              style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              特商法表記
            </a>
            <a
              href="/privacy"
              aria-label="プライバシーポリシーページへ"
              style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
            >
              プライバシーポリシー
            </a>
          </div>
        </nav>
        <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
          &copy; 2024 競売物件データAPI. 裁判所公示情報を利用。
        </p>
      </footer>
    </main>
  );
}
