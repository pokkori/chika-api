'use client';
import { useState } from 'react';
import { ApiPlayground } from '@/components/ApiPlayground';

const SANDBOX_KEY = 'sk_sandbox_demo_12345';

const ENDPOINTS = [
  {
    id: 'sandbox',
    method: 'GET',
    path: '/api/sandbox',
    summary: 'サンドボックス（登録不要）',
    description: '登録不要のサンドボックスAPIです。固定のAPIキー（sk_sandbox_demo_12345）で5件のサンプル競売物件データを取得できます。1時間に10回まで利用可能。',
    auth: 'sk_sandbox_demo_12345',
    params: [
      { name: 'prefecture', type: 'string', required: false, desc: '都道府県コード（例: 13=東京都、27=大阪府）' },
      { name: 'property_type', type: 'string', required: false, desc: 'apartment / land / building / farm' },
      { name: 'status', type: 'string', required: false, desc: 'open / sold / cancelled' },
    ],
    responseExample: {
      sandbox: true,
      note: 'このレスポンスはサンドボックス用のサンプルデータです。',
      total: 5,
      limit: 5,
      offset: 0,
      items: [
        {
          id: 'sandbox_13_R6_ke_0001',
          court: '東京地方裁判所',
          case_number: '令6(ケ)第0001号',
          property_type: 'apartment',
          address: '東京都渋谷区代々木1-1-1',
          area_sqm: 65.2,
          base_price: 18500000,
          appraisal_price: 24000000,
          price_ratio: 0.771,
          status: 'open',
          auction_end_date: '2026-04-22',
        },
      ],
    },
    curlExample: `curl -H "X-API-Key: sk_sandbox_demo_12345" \\
  "https://auction-property-api.vercel.app/api/sandbox"`,
    pythonExample: `import requests

headers = {"X-API-Key": "sk_sandbox_demo_12345"}
response = requests.get(
    "https://auction-property-api.vercel.app/api/sandbox",
    headers=headers
)
data = response.json()
print(f"件数: {data['total']}")
for item in data["items"]:
    print(f"  {item['court']} - {item['address']} - {item['base_price']:,}円")`,
    jsExample: `const res = await fetch(
  "https://auction-property-api.vercel.app/api/sandbox",
  { headers: { "X-API-Key": "sk_sandbox_demo_12345" } }
);
const data = await res.json();
console.log(\`件数: \${data.total}\`);
data.items.forEach(item => {
  console.log(\`\${item.court} - \${item.address} - \${item.base_price.toLocaleString()}円\`);
});`,
  },
  {
    id: 'auctions',
    method: 'GET',
    path: '/api/v1/auctions',
    summary: '競売物件一覧',
    description: '裁判所の競売物件一覧を取得します。都道府県・物件種別・価格帯でフィルタリング可能。BasicプランはAPIキー必須。',
    auth: 'auction_xxxxxxxxxxxxxxxxxxxxxxxx',
    params: [
      { name: 'prefecture', type: 'string', required: false, desc: '都道府県コード（2桁）例: 13=東京都' },
      { name: 'category', type: 'string', required: false, desc: '物件種別: land|building|apartment|farm' },
      { name: 'min_price', type: 'integer', required: false, desc: '最低売却基準額（円）' },
      { name: 'max_price', type: 'integer', required: false, desc: '最高売却基準額（円）' },
      { name: 'status', type: 'string', required: false, desc: '状態: open|sold|cancelled（デフォルト: open）' },
      { name: 'limit', type: 'integer', required: false, desc: '取得件数（最大100、デフォルト20）' },
      { name: 'offset', type: 'integer', required: false, desc: 'ページング開始位置（デフォルト0）' },
    ],
    responseExample: {
      total: 1243,
      limit: 20,
      offset: 0,
      items: [
        {
          id: 'court_13_R6_ke_1234',
          court: '東京地方裁判所',
          case_number: '令6(ケ)第1234号',
          property_type: 'apartment',
          address: '東京都渋谷区代々木1-1-1',
          base_price: 12000000,
          auction_end_date: '2026-04-22',
          status: 'open',
          scraped_at: '2026-03-24T09:00:00Z',
        },
      ],
    },
    curlExample: `curl -H "X-API-Key: YOUR_API_KEY" \\
  "https://auction-property-api.vercel.app/api/v1/auctions?prefecture=13&status=open"`,
    pythonExample: `import requests

headers = {"X-API-Key": "YOUR_API_KEY"}
params = {"prefecture": "13", "status": "open", "limit": 20}
response = requests.get(
    "https://auction-property-api.vercel.app/api/v1/auctions",
    headers=headers,
    params=params
)
data = response.json()
print(f"総件数: {data['total']}")
for item in data["items"]:
    print(f"  {item['address']} - {item['base_price']:,}円")`,
    jsExample: `const params = new URLSearchParams({ prefecture: "13", status: "open", limit: "20" });
const res = await fetch(
  \`https://auction-property-api.vercel.app/api/v1/auctions?\${params}\`,
  { headers: { "X-API-Key": "YOUR_API_KEY" } }
);
const data = await res.json();
console.log(\`総件数: \${data.total}\`);
data.items.forEach(item => {
  console.log(\`\${item.address} - \${item.base_price.toLocaleString()}円\`);
});`,
  },
  {
    id: 'auctions-id',
    method: 'GET',
    path: '/api/v1/auctions/{id}',
    summary: '競売物件詳細',
    description: 'IDを指定して競売物件の詳細情報を取得します。存在しない場合は404を返します。',
    auth: 'auction_xxxxxxxxxxxxxxxxxxxxxxxx',
    params: [
      { name: 'id', type: 'string', required: true, desc: '物件ID（例: court_13_R6_ke_1234）' },
    ],
    responseExample: {
      id: 'court_13_R6_ke_1234',
      court: '東京地方裁判所',
      case_number: '令6(ケ)第1234号',
      property_type: 'apartment',
      address: '東京都渋谷区代々木1-1-1',
      area_sqm: 65.2,
      base_price: 12000000,
      appraisal_price: 16000000,
      price_ratio: 0.75,
      floor: '5F',
      building_age_years: 12,
      auction_start_date: '2026-04-01',
      auction_end_date: '2026-04-22',
      status: 'open',
      court_url: 'https://bit.sikkou.jp/app/case/detail/...',
      scraped_at: '2026-03-24T09:00:00Z',
    },
    curlExample: `curl -H "X-API-Key: YOUR_API_KEY" \\
  "https://auction-property-api.vercel.app/api/v1/auctions/court_13_R6_ke_1234"`,
    pythonExample: `import requests

headers = {"X-API-Key": "YOUR_API_KEY"}
property_id = "court_13_R6_ke_1234"
response = requests.get(
    f"https://auction-property-api.vercel.app/api/v1/auctions/{property_id}",
    headers=headers
)
item = response.json()
print(f"{item['court']} / {item['address']}")
print(f"売却基準額: {item['base_price']:,}円 (評価額の{item['price_ratio']*100:.1f}%)")`,
    jsExample: `const propertyId = "court_13_R6_ke_1234";
const res = await fetch(
  \`https://auction-property-api.vercel.app/api/v1/auctions/\${propertyId}\`,
  { headers: { "X-API-Key": "YOUR_API_KEY" } }
);
const item = await res.json();
console.log(\`\${item.court} / \${item.address}\`);
console.log(\`売却基準額: \${item.base_price.toLocaleString()}円\`);`,
  },
  {
    id: 'stats',
    method: 'GET',
    path: '/api/v1/auctions/stats',
    summary: '統計情報（認証不要）',
    description: '全プランで認証なしに利用可能。現在公開中の競売物件数を物件種別ごとに取得します。',
    auth: null,
    params: [],
    responseExample: {
      total_open: 1243,
      by_type: { apartment: 512, land: 398, building: 287, farm: 46 },
      updated_at: '2026-03-24T09:00:00Z',
    },
    curlExample: `curl "https://auction-property-api.vercel.app/api/v1/auctions/stats"`,
    pythonExample: `import requests

response = requests.get(
    "https://auction-property-api.vercel.app/api/v1/auctions/stats"
)
data = response.json()
print(f"公開中の競売物件: {data['total_open']}件")
for ptype, count in data["by_type"].items():
    print(f"  {ptype}: {count}件")`,
    jsExample: `const res = await fetch(
  "https://auction-property-api.vercel.app/api/v1/auctions/stats"
);
const data = await res.json();
console.log(\`公開中の競売物件: \${data.total_open}件\`);
Object.entries(data.by_type).forEach(([type, count]) => {
  console.log(\`  \${type}: \${count}件\`);
});`,
  },
  {
    id: 'webhooks',
    method: 'POST',
    path: '/api/v1/webhooks',
    summary: 'Webhook登録（Proプラン以上）',
    description: '条件に合致する新着競売物件が追加された際に指定URLへPOSTで通知します。Proプラン以上で利用可能。',
    auth: 'auction_xxxxxxxxxxxxxxxxxxxxxxxx',
    params: [
      { name: 'url', type: 'string', required: true, desc: 'Webhook通知先URL（https必須）' },
      { name: 'prefecture', type: 'string', required: false, desc: '対象都道府県コード（省略時は全国）' },
      { name: 'property_type', type: 'string', required: false, desc: 'apartment / land / building / farm' },
      { name: 'max_price', type: 'integer', required: false, desc: '最高売却基準額（円）' },
    ],
    responseExample: {
      webhook_id: 'wh_xxxxxxxxxxxxxxxxxxx',
      url: 'https://your-server.example.com/webhook',
      status: 'active',
      created_at: '2026-03-24T10:00:00Z',
    },
    curlExample: `curl -X POST \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://your-server.example.com/webhook","prefecture":"13"}' \\
  "https://auction-property-api.vercel.app/api/v1/webhooks"`,
    pythonExample: `import requests

headers = {
    "X-API-Key": "YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "url": "https://your-server.example.com/webhook",
    "prefecture": "13",
    "property_type": "apartment"
}
response = requests.post(
    "https://auction-property-api.vercel.app/api/v1/webhooks",
    headers=headers,
    json=payload
)
data = response.json()
print(f"Webhook登録完了: {data['webhook_id']}")`,
    jsExample: `const res = await fetch(
  "https://auction-property-api.vercel.app/api/v1/webhooks",
  {
    method: "POST",
    headers: {
      "X-API-Key": "YOUR_API_KEY",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://your-server.example.com/webhook",
      prefecture: "13",
      property_type: "apartment",
    }),
  }
);
const data = await res.json();
console.log(\`Webhook登録完了: \${data.webhook_id}\`);`,
  },
];

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    GET: { bg: '#14532D', text: '#22C55E' },
    POST: { bg: '#78350F', text: '#F59E0B' },
    DELETE: { bg: '#7F1D1D', text: '#EF4444' },
  };
  const c = colors[method] ?? colors.GET;
  return (
    <span
      style={{
        backgroundColor: c.bg,
        color: c.text,
        padding: '3px 10px',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'monospace',
      }}
    >
      {method}
    </span>
  );
}

function TryItOut({ endpoint }: { endpoint: typeof ENDPOINTS[0] }) {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string>('');
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const isSandbox = endpoint.id === 'sandbox';

  const handleTry = async () => {
    setLoading(true);
    setResponse('');
    setStatus(null);
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : 'https://auction-property-api.vercel.app';
      let url: string;

      if (endpoint.id === 'auctions-id') {
        const id = params['id'] || 'court_13_R6_ke_1234';
        url = `${base}/api/v1/auctions/${encodeURIComponent(id)}`;
      } else if (endpoint.id === 'sandbox') {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => { if (v) searchParams.set(k, v); });
        url = `${base}/api/sandbox${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      } else {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => { if (v) searchParams.set(k, v); });
        url = `${base}${endpoint.path}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
      }

      const headers: Record<string, string> = {};
      if (endpoint.auth) {
        headers['X-API-Key'] = isSandbox ? SANDBOX_KEY : (endpoint.auth || '');
      }

      if (endpoint.method === 'POST') {
        headers['Content-Type'] = 'application/json';
        const body: Record<string, string | number> = {};
        Object.entries(params).forEach(([k, v]) => {
          if (v) body[k] = isNaN(Number(v)) ? v : Number(v);
        });
        const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
        setStatus(res.status);
        const json = await res.json();
        setResponse(JSON.stringify(json, null, 2));
      } else {
        const res = await fetch(url, { headers });
        setStatus(res.status);
        const json = await res.json();
        setResponse(JSON.stringify(json, null, 2));
      }
    } catch (err) {
      setResponse(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`${endpoint.summary} のTry it outを${open ? '閉じる' : '開く'}`}
        aria-expanded={open}
        className="backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-200"
        style={{
          color: '#F59E0B',
          borderRadius: 6,
          padding: '8px 18px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 44,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 3l6 5-6 5V3z" fill="#F59E0B" />
        </svg>
        {open ? 'Try it out を閉じる' : 'Try it out（今すぐ試す）'}
        {isSandbox && (
          <span style={{ fontSize: 11, backgroundColor: '#F59E0B', color: '#0F172A', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>
            登録不要
          </span>
        )}
      </button>

      {open && (
        <div
          className="backdrop-blur-md bg-white/5 border border-white/10"
          style={{ borderRadius: 12, padding: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {isSandbox && (
            <div style={{ backgroundColor: '#1E293B', borderRadius: 8, padding: '10px 14px', border: '1px solid #F59E0B40' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>
                サンドボックスAPIキー（自動設定済み）:{' '}
                <code style={{ color: '#F59E0B', fontFamily: 'monospace' }}>{SANDBOX_KEY}</code>
              </p>
            </div>
          )}

          {endpoint.params.map((param) => (
            <div key={param.name}>
              <label
                htmlFor={`try-${endpoint.id}-${param.name}`}
                style={{ fontSize: 13, color: '#94A3B8', display: 'block', marginBottom: 4 }}
              >
                {param.name}
                {param.required && <span style={{ color: '#EF4444', marginLeft: 4 }}>*必須</span>}
                <span style={{ color: '#475569', marginLeft: 8, fontSize: 12 }}>({param.type})</span>
              </label>
              <input
                id={`try-${endpoint.id}-${param.name}`}
                type="text"
                aria-label={`${param.name}パラメータを入力: ${param.desc}`}
                placeholder={param.desc}
                value={params[param.name] ?? ''}
                onChange={(e) => setParams((prev) => ({ ...prev, [param.name]: e.target.value }))}
                style={{
                  width: '100%',
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  border: '1px solid #334155',
                  borderRadius: 6,
                  padding: '10px 12px',
                  fontSize: 13,
                  minHeight: 44,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          <button
            onClick={handleTry}
            disabled={loading}
            aria-label={`${endpoint.summary} を実行する`}
            style={{
              backgroundColor: loading ? '#334155' : '#F59E0B',
              color: loading ? '#F8FAFC' : '#0F172A',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              minHeight: 44,
            }}
          >
            {loading ? '実行中...' : 'Execute'}
          </button>

          {(response || status !== null) && (
            <div>
              {status !== null && (
                <p style={{ fontSize: 14, color: status < 400 ? '#22C55E' : '#EF4444', marginBottom: 6 }}>
                  ステータス: {status}
                </p>
              )}
              <pre
                aria-label="APIレスポンス結果"
                style={{
                  backgroundColor: '#0F172A',
                  padding: 14,
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#E2E8F0',
                  overflowX: 'auto',
                  maxHeight: 320,
                  overflowY: 'auto',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  border: '1px solid #334155',
                }}
              >
                {response}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeTabs({ curl, python, js }: { curl: string; python: string; js: string }) {
  const [tab, setTab] = useState<'curl' | 'python' | 'js'>('curl');
  const code = tab === 'curl' ? curl : tab === 'python' ? python : js;
  const label = tab === 'curl' ? 'bash' : tab === 'python' ? 'python' : 'javascript';

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
        {(['curl', 'python', 'js'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-label={`${t === 'js' ? 'JavaScript' : t} コード例を表示`}
            aria-pressed={tab === t}
            style={{
              backgroundColor: tab === t ? '#1E293B' : 'transparent',
              color: tab === t ? '#F8FAFC' : '#64748B',
              border: tab === t ? '1px solid #334155' : '1px solid transparent',
              borderBottom: 'none',
              borderRadius: '6px 6px 0 0',
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: tab === t ? 600 : 400,
              minHeight: 36,
            }}
          >
            {t === 'js' ? 'JavaScript' : t === 'curl' ? 'cURL' : 'Python'}
          </button>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '0 6px 6px 6px',
            border: '1px solid #334155',
            padding: '4px 12px 2px',
          }}
        >
          <span style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>{label}</span>
        </div>
        <pre
          aria-label={`${label}コード例`}
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '0 0 8px 8px',
            border: '1px solid #334155',
            borderTop: 'none',
            padding: '16px 20px',
            fontSize: 13,
            color: '#E2E8F0',
            overflowX: 'auto',
            margin: 0,
            whiteSpace: 'pre',
          }}
        >
          {code}
        </pre>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [activeId, setActiveId] = useState('sandbox');

  return (
    <main
      style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}
      aria-label="競売物件データAPI ドキュメント"
    >
      {/* Header */}
      <header
        aria-label="ドキュメントヘッダー"
        className="backdrop-blur-md bg-white/5 border-b border-white/10"
        style={{ padding: '0 24px', display: 'flex', alignItems: 'center', gap: 24, height: 56, position: 'sticky', top: 0, zIndex: 50 }}
      >
        <a
          href="/"
          aria-label="競売物件データAPI トップページへ戻る"
          style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 700, fontSize: 16, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
        >
          競売物件データAPI
        </a>
        <span style={{ color: '#334155' }}>|</span>
        <span style={{ color: '#94A3B8', fontSize: 14 }}>APIリファレンス</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
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
            href="/api/auth/register"
            aria-label="無料でAPIキーを取得する"
            style={{
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
              minHeight: 36,
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0 16px',
              borderRadius: 6,
            }}
          >
            無料で始める
          </a>
        </div>
      </header>

      {/* Sandbox CTA Banner */}
      <div
        className="backdrop-blur-sm bg-white/5 border-b border-white/10"
        style={{ padding: '12px 24px', textAlign: 'center' }}
      >
        <p style={{ margin: 0, fontSize: 14, color: '#94A3B8' }}>
          登録不要で今すぐ試せる -{' '}
          <code style={{ color: '#F59E0B', fontFamily: 'monospace', fontSize: 13 }}>X-API-Key: {SANDBOX_KEY}</code>
          {' '} でサンドボックスAPIにアクセス可能
          <a
            href="#sandbox"
            onClick={() => setActiveId('sandbox')}
            aria-label="サンドボックスAPIのドキュメントへジャンプ"
            style={{ color: '#F59E0B', textDecoration: 'underline', marginLeft: 12, fontSize: 14 }}
          >
            Try it out
          </a>
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        {/* Sidebar */}
        <nav
          aria-label="APIエンドポイント一覧サイドバー"
          style={{
            borderRight: '1px solid #1E293B',
            padding: '24px 16px',
            position: 'sticky',
            top: 56,
            height: 'calc(100vh - 100px)',
            overflowY: 'auto',
          }}
        >
          <p style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            サンドボックス
          </p>
          {ENDPOINTS.filter((e) => e.id === 'sandbox').map((ep) => (
            <a
              key={ep.id}
              href={`#${ep.id}`}
              onClick={() => setActiveId(ep.id)}
              aria-label={`${ep.summary}のドキュメントへ移動`}
              aria-current={activeId === ep.id ? 'page' : undefined}
              style={{
                display: 'flex',
                padding: '8px 10px',
                borderRadius: 6,
                textDecoration: 'none',
                marginBottom: 2,
                backgroundColor: activeId === ep.id ? '#1E293B' : 'transparent',
                minHeight: 44,
                alignItems: 'center',
                gap: 8,
              } as React.CSSProperties}
            >
              <span style={{ fontSize: 10, color: '#F59E0B', fontFamily: 'monospace', fontWeight: 700, flexShrink: 0 }}>
                {ep.method}
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{ep.path}</span>
            </a>
          ))}

          <p style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            競売物件エンドポイント
          </p>
          {ENDPOINTS.filter((e) => e.id !== 'sandbox').map((ep) => (
            <a
              key={ep.id}
              href={`#${ep.id}`}
              onClick={() => setActiveId(ep.id)}
              aria-label={`${ep.summary}のドキュメントへ移動`}
              aria-current={activeId === ep.id ? 'page' : undefined}
              style={{
                display: 'flex',
                padding: '8px 10px',
                borderRadius: 6,
                textDecoration: 'none',
                marginBottom: 2,
                backgroundColor: activeId === ep.id ? '#1E293B' : 'transparent',
                minHeight: 44,
                alignItems: 'center',
                gap: 8,
              } as React.CSSProperties}
            >
              <span style={{
                fontSize: 10,
                color: ep.method === 'POST' ? '#F59E0B' : '#22C55E',
                fontFamily: 'monospace',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {ep.method}
              </span>
              <span style={{ fontSize: 12, color: '#94A3B8' }}>{ep.summary}</span>
            </a>
          ))}

          <div style={{ marginTop: 24, borderTop: '1px solid #1E293B', paddingTop: 16 }}>
            <p style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              その他
            </p>
            <a
              href="/webhooks"
              aria-label="Webhook設定ページへ移動"
              style={{ display: 'flex', padding: '8px 10px', borderRadius: 6, textDecoration: 'none', fontSize: 12, color: '#94A3B8', minHeight: 44, alignItems: 'center' }}
            >
              Webhook設定UI
            </a>
            <a
              href="/invoice"
              aria-label="請求書払い申請ページへ移動"
              style={{ display: 'flex', padding: '8px 10px', borderRadius: 6, textDecoration: 'none', fontSize: 12, color: '#94A3B8', minHeight: 44, alignItems: 'center' }}
            >
              請求書払い申請
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <div style={{ padding: '40px 48px', overflowX: 'hidden', maxWidth: '100%' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>
            APIリファレンス
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 12, lineHeight: 1.7 }}>
            認証は <code style={{ backgroundColor: '#1E293B', padding: '2px 8px', borderRadius: 4, fontSize: 14 }}>X-API-Key</code> ヘッダーで行います。
            サンドボックスキー <code style={{ backgroundColor: '#1E293B', padding: '2px 8px', borderRadius: 4, fontSize: 13, color: '#F59E0B' }}>{SANDBOX_KEY}</code> で登録不要で試せます。
          </p>

          <div
            className="backdrop-blur-sm bg-white/5 border border-white/10"
            style={{ borderRadius: 12, padding: '14px 20px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="#F59E0B" strokeWidth="1.5" />
              <path d="M10 9v5M10 7v.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p style={{ margin: 0, fontSize: 14, color: '#94A3B8' }}>
              本番APIキーは <a href="/api/auth/register" aria-label="APIキー取得ページへ" style={{ color: '#F59E0B', textDecoration: 'underline' }}>無料登録</a> で即時発行。
              法人・請求書払いは <a href="/invoice" aria-label="請求書払い申請ページへ" style={{ color: '#F59E0B', textDecoration: 'underline' }}>こちら</a>。
            </p>
          </div>

          {ENDPOINTS.map((ep) => (
            <section
              key={ep.id}
              id={ep.id}
              aria-label={`${ep.summary} エンドポイント`}
              style={{ marginBottom: 72, scrollMarginTop: 100 }}
            >
              <div
                className="backdrop-blur-md bg-white/5 border border-white/10"
                style={{ borderRadius: 16, padding: 28 }}
              >
                {/* Endpoint header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <MethodBadge method={ep.method} />
                  <code style={{ fontSize: 16, color: '#F8FAFC', fontFamily: 'monospace' }}>{ep.path}</code>
                  {ep.id === 'sandbox' && (
                    <span style={{ fontSize: 12, backgroundColor: '#F59E0B20', color: '#F59E0B', border: '1px solid #F59E0B40', borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>
                      登録不要
                    </span>
                  )}
                  {ep.auth === null && (
                    <span style={{ fontSize: 12, backgroundColor: '#22C55E20', color: '#22C55E', border: '1px solid #22C55E40', borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>
                      認証不要
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>{ep.summary}</h2>
                <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 24, lineHeight: 1.7 }}>{ep.description}</p>

                {/* Parameters table */}
                {ep.params.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#CBD5E1', marginBottom: 10 }}>パラメータ</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label={`${ep.summary} パラメータ一覧`}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #334155' }}>
                            {['名前', '型', '必須', '説明'].map((h) => (
                              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#475569', fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map((p) => (
                            <tr key={p.name} style={{ borderBottom: '1px solid #1E293B' }}>
                              <td style={{ padding: '8px 12px', fontSize: 13, color: '#60A5FA', fontFamily: 'monospace' }}>{p.name}</td>
                              <td style={{ padding: '8px 12px', fontSize: 13, color: '#94A3B8' }}>{p.type}</td>
                              <td style={{ padding: '8px 12px', fontSize: 13, color: p.required ? '#EF4444' : '#475569' }}>{p.required ? '必須' : '任意'}</td>
                              <td style={{ padding: '8px 12px', fontSize: 13, color: '#94A3B8' }}>{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Response example */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#CBD5E1', marginBottom: 10 }}>レスポンス例</h3>
                  <pre
                    aria-label={`${ep.summary} レスポンス例`}
                    style={{
                      backgroundColor: '#0F172A',
                      borderRadius: 8,
                      padding: 16,
                      fontSize: 12,
                      color: '#E2E8F0',
                      overflow: 'auto',
                      border: '1px solid #334155',
                      margin: 0,
                      maxHeight: 280,
                    }}
                  >
                    {JSON.stringify(ep.responseExample, null, 2)}
                  </pre>
                </div>

                {/* Code examples */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#CBD5E1', marginBottom: 10 }}>コード例</h3>
                  <CodeTabs curl={ep.curlExample} python={ep.pythonExample} js={ep.jsExample} />
                </div>

                {/* Try it out */}
                <TryItOut endpoint={ep} />
              </div>
            </section>
          ))}

          {/* API Playground section */}
          <section aria-label="APIプレイグラウンド（詳細）" style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 16 }}>
              API Playground（全エンドポイント対応）
            </h2>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 20 }}>
              本番APIキーをお持ちの場合はこちらから全エンドポイントを試せます。
            </p>
            <ApiPlayground />
          </section>
        </div>
      </div>
    </main>
  );
}
