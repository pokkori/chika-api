import { PlanCard } from '@/components/PlanCard';
import { CopyableCode } from '@/components/CopyableCode';
import { StreakBadge } from '@/components/StreakBadge';

const curlExample = `curl -H "X-API-Key: YOUR_API_KEY" \\
  "https://chika-api.vercel.app/api/v1/land-price?prefecture=13&city=13101&year=2024"`;

const SHARE_TEXT = encodeURIComponent(
  'ChikaAPI - 地価データREST API。国土交通省の地価データをシンプルなAPIで取得 #ChikaAPI #不動産テック #API https://chika-api.vercel.app'
);

export default function HomePage() {
  return (
    <main style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}>
      {/* Hero */}
      <section
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
            color: '#60A5FA',
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
          ChikaAPI
          <StreakBadge streakKey="chika_api" />
          <br />
          <span style={{ color: '#3B82F6' }}>地価データREST API</span>
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
          国土交通省の公示地価・路線価・基準地価データを
          シンプルなREST APIで即時取得。
          不動産テック・フィンテック開発に最適。
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/api/auth/register"
            aria-label="無料でChikaAPIを始める"
            style={{
              backgroundColor: '#3B82F6',
              color: '#F8FAFC',
              padding: '14px 32px',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 44,
            }}
          >
            無料で始める
          </a>
          <a
            href="/docs"
            aria-label="APIドキュメントを見る"
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
            aria-label="ChikaAPIをXでシェアする"
            className="bg-black text-white rounded-lg px-4 py-2"
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

      {/* Features */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 48, color: '#F8FAFC' }}
        >
          ChikaAPIの特徴
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
                  <rect width="32" height="32" rx="8" fill="#1E3A5F" />
                  <path d="M8 16h16M16 8v16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              ),
              title: '全国30万地点',
              desc: '国土交通省の公示地価・基準地価・路線価を網羅。都市部から地方まで全国対応。',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#1E3A5F" />
                  <circle cx="16" cy="16" r="6" stroke="#3B82F6" strokeWidth="2.5" />
                  <path d="M16 8v3M16 21v3M8 16h3M21 16h3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ),
              title: 'リアルタイム取得',
              desc: 'Redisキャッシュで平均レスポンス200ms以内。最新の地価データをスピーディに取得。',
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect width="32" height="32" rx="8" fill="#1E3A5F" />
                  <path d="M8 24L12 16L16 20L20 12L24 16" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: '99.9% SLA',
              desc: 'Vercel Edge + Upstash Redisによる高可用性。本番環境のサービスに安心して組み込める。',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg rounded-2xl"
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

      {/* Code Sample */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '60px 24px',
        }}
      >
        <h2
          style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 16, color: '#F8FAFC' }}
        >
          3行で地価データを取得
        </h2>
        <p style={{ fontSize: 16, color: '#94A3B8', textAlign: 'center', marginBottom: 32 }}>
          APIキーを取得したらすぐに使えます
        </p>
        <CopyableCode code={curlExample} language="bash" />
      </section>

      {/* Pricing */}
      <section
        id="pricing"
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {(['free', 'basic', 'pro', 'enterprise'] as const).map((plan) => (
            <PlanCard key={plan} plan={plan} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section
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
            a: '国土交通省の公示地価は年1回（1月1日時点）、基準地価は年1回（7月1日時点）更新されます。APIのキャッシュは24時間です。',
          },
          {
            q: '商用利用は可能ですか？',
            a: 'はい。Basicプラン以上で商用利用が可能です。Freeプランは個人・試作目的のみとなります。',
          },
          {
            q: 'KOMOJUでの決済はいつ開始しますか？',
            a: '現在KOMOJU審査中です。審査通過後にBasic/Pro/Enterpriseプランのお申し込みが可能になります。',
          },
        ].map(({ q, a }) => (
          <details
            key={q}
            style={{
              backgroundColor: '#1E293B',
              borderRadius: 8,
              marginBottom: 12,
              border: '1px solid #334155',
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
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '0 24px 60px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 16 }}>
          ChikaAPIを知人・同僚にシェアしよう
        </p>
        <a
          href={`https://twitter.com/intent/tweet?text=${SHARE_TEXT}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ChikaAPIをXでシェアする"
          className="bg-black text-white rounded-lg px-4 py-2"
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
        style={{
          borderTop: '1px solid #1E293B',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <a
            href="/docs"
            aria-label="APIドキュメントページへ"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
          >
            APIドキュメント
          </a>
          <a
            href="/dashboard"
            aria-label="ダッシュボードページへ"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
          >
            ダッシュボード
          </a>
          <a
            href="https://github.com"
            aria-label="GitHubリポジトリへ（外部リンク）"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
          >
            GitHub
          </a>
        </div>
        <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
          &copy; 2024 ChikaAPI. データ出典: 国土交通省 不動産情報ライブラリ
        </p>
      </footer>
    </main>
  );
}
