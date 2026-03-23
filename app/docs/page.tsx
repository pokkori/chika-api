import { ApiPlayground } from '@/components/ApiPlayground';

export default function DocsPage() {
  return (
    <main style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#1E293B',
          borderBottom: '1px solid #334155',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <a
          href="/"
          aria-label="トップページへ戻る"
          style={{
            color: '#3B82F6',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 18,
            minHeight: 44,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          ChikaAPI
        </a>
        <span style={{ color: '#475569', fontSize: 14 }}>/</span>
        <span style={{ color: '#F8FAFC', fontSize: 14 }}>APIドキュメント</span>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        {/* Sidebar */}
        <nav
          aria-label="APIエンドポイント一覧"
          style={{
            backgroundColor: '#0F172A',
            borderRight: '1px solid #1E293B',
            padding: '24px 16px',
            position: 'sticky',
            top: 0,
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
          }}
        >
          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            エンドポイント
          </p>
          {[
            { href: '#land-price', label: 'GET /api/v1/land-price', desc: '地価検索' },
            { href: '#trend', label: 'GET /api/v1/land-price/trend', desc: '周辺地価推移' },
            { href: '#route-price', label: 'GET /api/v1/route-price', desc: '路線価検索' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-label={`${item.desc}エンドポイントへ移動`}
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: 6,
                textDecoration: 'none',
                marginBottom: 4,
                minHeight: 44,
              }}
            >
              <span style={{ fontSize: 11, color: '#22C55E', fontFamily: 'monospace', display: 'block' }}>GET</span>
              <span style={{ fontSize: 12, color: '#94A3B8', display: 'block' }}>{item.desc}</span>
            </a>
          ))}

          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginTop: 24, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            認証
          </p>
          {[
            { href: '#register', label: 'POST /api/auth/register', desc: 'メール登録' },
            { href: '#apikey', label: 'GET /api/auth/apikey', desc: 'APIキー確認' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-label={`${item.desc}エンドポイントへ移動`}
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: 6,
                textDecoration: 'none',
                marginBottom: 4,
                minHeight: 44,
              }}
            >
              <span style={{ fontSize: 11, color: '#F59E0B', fontFamily: 'monospace', display: 'block' }}>POST</span>
              <span style={{ fontSize: 12, color: '#94A3B8', display: 'block' }}>{item.desc}</span>
            </a>
          ))}
        </nav>

        {/* Main Content */}
        <div style={{ padding: '40px 48px', overflowX: 'hidden' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>
            ChikaAPI ドキュメント
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 40, lineHeight: 1.7 }}>
            APIキーはすべてのリクエストで <code style={{ backgroundColor: '#1E293B', padding: '2px 8px', borderRadius: 4, fontSize: 14 }}>X-API-Key</code> ヘッダーで送信してください。
          </p>

          {/* Authentication Section */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#3B82F6', marginBottom: 16 }}>
              認証
            </h2>
            <div style={{ backgroundColor: '#1E293B', borderRadius: 8, padding: 20, border: '1px solid #334155' }}>
              <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 12 }}>すべてのAPIリクエストにAPIキーが必要です。</p>
              <pre style={{ margin: 0, fontSize: 13, color: '#E2E8F0' }}>
                {`X-API-Key: chika_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
              </pre>
            </div>
          </section>

          {/* land-price */}
          <section id="land-price" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ backgroundColor: '#14532D', color: '#22C55E', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>GET</span>
              <code style={{ fontSize: 16, color: '#F8FAFC' }}>/api/v1/land-price</code>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>地価検索</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>
              都道府県コード・市区町村コード・年・用途区分で地価データを検索します。
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#CBD5E1', marginBottom: 12 }}>パラメータ</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  {['パラメータ', '型', '必須', '説明'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'prefecture', type: 'integer', required: true, desc: '都道府県コード（例: 13=東京都）' },
                  { name: 'city', type: 'integer', required: false, desc: '市区町村コード（例: 13101=千代田区）' },
                  { name: 'year', type: 'integer', required: false, desc: '公示年（例: 2024）' },
                  { name: 'use_category', type: 'string', required: false, desc: '用途区分: 住宅地|商業地|工業地' },
                  { name: 'limit', type: 'integer', required: false, desc: '件数上限（デフォルト100、最大1000）' },
                ].map((p) => (
                  <tr key={p.name} style={{ borderBottom: '1px solid #1E293B' }}>
                    <td style={{ padding: '8px 12px', fontSize: 13, color: '#60A5FA', fontFamily: 'monospace' }}>{p.name}</td>
                    <td style={{ padding: '8px 12px', fontSize: 13, color: '#94A3B8' }}>{p.type}</td>
                    <td style={{ padding: '8px 12px', fontSize: 13, color: p.required ? '#EF4444' : '#475569' }}>{p.required ? '必須' : '任意'}</td>
                    <td style={{ padding: '8px 12px', fontSize: 13, color: '#94A3B8' }}>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* trend */}
          <section id="trend" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ backgroundColor: '#14532D', color: '#22C55E', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>GET</span>
              <code style={{ fontSize: 16, color: '#F8FAFC' }}>/api/v1/land-price/trend</code>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>周辺地価推移</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>
              緯度・経度を指定して、半径内の地価の経年推移データを取得します。
            </p>
          </section>

          {/* route-price */}
          <section id="route-price" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ backgroundColor: '#14532D', color: '#22C55E', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>GET</span>
              <code style={{ fontSize: 16, color: '#F8FAFC' }}>/api/v1/route-price</code>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>路線価検索</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>
              路線名（例: 山手線）ごとの各駅周辺の路線価を取得します。
            </p>
          </section>

          {/* Playground */}
          <section style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 24 }}>
              API Playground
            </h2>
            <ApiPlayground />
          </section>
        </div>
      </div>
    </main>
  );
}
