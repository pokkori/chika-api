import { ApiPlayground } from '@/components/ApiPlayground';

export default function DocsPage() {
  return (
    <main
      style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}
      aria-label="競売物件データAPI ドキュメント"
    >
      {/* Header */}
      <header
        aria-label="ドキュメントヘッダー"
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
          aria-label="競売物件データAPI トップページへ戻る"
          style={{
            color: '#F59E0B',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: 18,
            minHeight: 44,
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          競売物件データAPI
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
            競売物件エンドポイント
          </p>
          {[
            { href: '#auctions', label: 'GET /api/v1/auctions', desc: '競売物件一覧', method: 'GET' },
            { href: '#auctions-id', label: 'GET /api/v1/auctions/{id}', desc: '競売物件詳細', method: 'GET' },
            { href: '#auctions-stats', label: 'GET /api/v1/auctions/stats', desc: '統計情報', method: 'GET' },
            { href: '#webhooks', label: 'POST /api/v1/webhooks', desc: 'Webhook登録', method: 'POST' },
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
              <span style={{ fontSize: 11, color: item.method === 'POST' ? '#F59E0B' : '#22C55E', fontFamily: 'monospace', display: 'block' }}>
                {item.method}
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8', display: 'block' }}>{item.desc}</span>
            </a>
          ))}

          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600, marginTop: 24, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            認証
          </p>
          {[
            { href: '#register', label: 'POST /api/auth/register', desc: 'メール登録', method: 'POST' },
            { href: '#apikey', label: 'GET /api/auth/apikey', desc: 'APIキー確認', method: 'GET' },
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
              <span style={{ fontSize: 11, color: item.method === 'POST' ? '#F59E0B' : '#22C55E', fontFamily: 'monospace', display: 'block' }}>
                {item.method}
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8', display: 'block' }}>{item.desc}</span>
            </a>
          ))}
        </nav>

        {/* Main Content */}
        <div style={{ padding: '40px 48px', overflowX: 'hidden' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>
            競売物件データAPI ドキュメント
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 40, lineHeight: 1.7 }}>
            APIキーはすべてのリクエストで <code style={{ backgroundColor: '#1E293B', padding: '2px 8px', borderRadius: 4, fontSize: 14 }}>X-API-Key</code> ヘッダーで送信してください。
          </p>

          {/* Authentication Section */}
          <section id="auth" aria-label="認証方法" style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F59E0B', marginBottom: 16 }}>
              認証
            </h2>
            <div style={{ backgroundColor: '#1E293B', borderRadius: 8, padding: 20, border: '1px solid #334155' }}>
              <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 12 }}>
                競売物件一覧・詳細APIは認証が必要です。統計APIは認証不要です。
              </p>
              <pre style={{ margin: 0, fontSize: 13, color: '#E2E8F0' }}>
                {`X-API-Key: auction_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
              </pre>
            </div>
          </section>

          {/* auctions list */}
          <section id="auctions" aria-label="競売物件一覧エンドポイント" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ backgroundColor: '#14532D', color: '#22C55E', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>GET</span>
              <code style={{ fontSize: 16, color: '#F8FAFC' }}>/api/v1/auctions</code>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>競売物件一覧</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>
              裁判所の競売物件一覧を取得します。都道府県・物件種別・価格帯でフィルタリング可能です。
            </p>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#CBD5E1', marginBottom: 12 }}>パラメータ</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }} aria-label="競売物件一覧APIパラメータ">
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  {['パラメータ', '型', '必須', '説明'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'prefecture', type: 'string', required: false, desc: '都道府県コード（2桁）例: 13=東京都' },
                  { name: 'category', type: 'string', required: false, desc: '物件種別: land|building|apartment|farm' },
                  { name: 'min_price', type: 'integer', required: false, desc: '最低売却基準額（円）' },
                  { name: 'max_price', type: 'integer', required: false, desc: '最高売却基準額（円）' },
                  { name: 'status', type: 'string', required: false, desc: '状態: open|sold|cancelled（デフォルト: open）' },
                  { name: 'limit', type: 'integer', required: false, desc: '取得件数（最大100、デフォルト20）' },
                  { name: 'offset', type: 'integer', required: false, desc: 'ページング開始位置（デフォルト0）' },
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

            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#CBD5E1', marginBottom: 12 }}>レスポンス例</h3>
            <pre style={{ backgroundColor: '#1E293B', borderRadius: 8, padding: 20, fontSize: 13, color: '#E2E8F0', overflow: 'auto', border: '1px solid #334155' }}>
              {JSON.stringify({
                total: 1243,
                limit: 20,
                offset: 0,
                items: [{
                  id: 'court_13_R6_ke_1234',
                  court: '東京地方裁判所',
                  case_number: '令6(ケ)第1234号',
                  property_type: 'apartment',
                  address: '東京都渋谷区代々木1-1-1',
                  base_price: 12000000,
                  auction_end_date: '2024-04-22',
                  status: 'open',
                  court_url: 'https://bit.sikkou.jp/app/case/detail/...',
                  scraped_at: '2024-03-24T09:00:00Z',
                }],
              }, null, 2)}
            </pre>
          </section>

          {/* auctions detail */}
          <section id="auctions-id" aria-label="競売物件詳細エンドポイント" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ backgroundColor: '#14532D', color: '#22C55E', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>GET</span>
              <code style={{ fontSize: 16, color: '#F8FAFC' }}>/api/v1/auctions/{'{id}'}</code>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>競売物件詳細</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>
              IDを指定して競売物件の詳細情報を取得します。存在しない場合は404を返します。
            </p>
          </section>

          {/* stats */}
          <section id="auctions-stats" aria-label="統計情報エンドポイント" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ backgroundColor: '#14532D', color: '#22C55E', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>GET</span>
              <code style={{ fontSize: 16, color: '#F8FAFC' }}>/api/v1/auctions/stats</code>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>統計情報（認証不要）</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>
              全プランで認証なしに利用可能。現在公開中の競売物件数を物件種別ごとに取得します。
            </p>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#CBD5E1', marginBottom: 12 }}>レスポンス例</h3>
            <pre style={{ backgroundColor: '#1E293B', borderRadius: 8, padding: 20, fontSize: 13, color: '#E2E8F0', overflow: 'auto', border: '1px solid #334155' }}>
              {JSON.stringify({ total_open: 1243, by_type: { apartment: 512, land: 398, building: 287, farm: 46 }, updated_at: '2024-03-24T09:00:00Z' }, null, 2)}
            </pre>
          </section>

          {/* webhooks */}
          <section id="webhooks" aria-label="Webhook登録エンドポイント" style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ backgroundColor: '#78350F', color: '#F59E0B', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>POST</span>
              <code style={{ fontSize: 16, color: '#F8FAFC' }}>/api/v1/webhooks</code>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>Webhook登録（Proプラン以上）</h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>
              条件に合致する新着競売物件が追加された際に指定URLへPOSTで通知します。
            </p>
          </section>

          {/* Playground */}
          <section aria-label="APIプレイグラウンド" style={{ marginBottom: 64 }}>
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
