'use client';
import { useEffect, useState } from 'react';
import { UsageChart } from '@/components/UsageChart';

interface UsageData {
  date: string;
  count: number;
}

interface DashboardData {
  usage: UsageData[];
  plan: string;
  daily_limit: number;
  key_prefix: string;
}

interface AuctionProperty {
  id: string;
  building_name?: string;
  address?: string;
  base_price?: number;
  property_type?: string;
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  starter: 'Starter',
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const MOCK_PROPERTIES: AuctionProperty[] = [
  { id: 'mock-1', building_name: '東京都渋谷区マンション', address: '東京都', base_price: 12500000, property_type: 'apartment' },
  { id: 'mock-2', building_name: '大阪府堺市一戸建て', address: '大阪府', base_price: 6800000, property_type: 'building' },
  { id: 'mock-3', building_name: '神奈川県横浜市土地', address: '神奈川県', base_price: 9200000, property_type: 'land' },
];

function formatPrice(price?: number): string {
  if (!price) return '---';
  if (price >= 100000000) return `${(price / 100000000).toFixed(1)}億円`;
  if (price >= 10000) return `${Math.floor(price / 10000).toLocaleString()}万円`;
  return `${price.toLocaleString()}円`;
}

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reissuing, setReissuing] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [topProperties, setTopProperties] = useState<AuctionProperty[]>([]);
  const [webhookCount, setWebhookCount] = useState<number | null>(null);

  const fetchUsage = async (userEmail: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard/usage', {
        headers: { Authorization: `Bearer ${userEmail}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'データ取得に失敗しました');
      }
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await fetchUsage(email);
  };

  const handleReissue = async () => {
    if (!confirm('APIキーを再発行しますか？旧キーは即座に無効化されます。')) return;
    setReissuing(true);
    try {
      const res = await fetch('/api/auth/apikey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setNewKey(data.api_key ?? '');
        await fetchUsage(email);
      } else {
        setError(data.error ?? '再発行に失敗しました');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setReissuing(false);
    }
  };

  // 今日の新着物件TOP3を取得
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/v1/auctions?limit=3&status=open', {
          headers: { 'X-API-Key': 'auction_demo' },
        });
        if (res.ok) {
          const json = await res.json();
          const items: AuctionProperty[] = json.items ?? [];
          setTopProperties(items.length > 0 ? items : MOCK_PROPERTIES);
        } else {
          setTopProperties(MOCK_PROPERTIES);
        }
      } catch {
        setTopProperties(MOCK_PROPERTIES);
      }
    };
    fetchProperties();
  }, []);

  // Webhook登録数チェック
  useEffect(() => {
    if (!dashboardData) return;
    const checkWebhooks = async () => {
      try {
        const res = await fetch('/api/v1/webhooks', {
          headers: { 'X-API-Key': 'auction_demo' },
        });
        if (res.ok) {
          const json = await res.json();
          const count = Array.isArray(json.items) ? json.items.length : (Array.isArray(json) ? json.length : 0);
          setWebhookCount(count);
        } else {
          // 401/403はAPIキー未設定ゆえ0扱い
          setWebhookCount(0);
        }
      } catch {
        setWebhookCount(0);
      }
    };
    checkWebhooks();
  }, [dashboardData]);

  const todayUsage = dashboardData?.usage?.find(
    (u) => u.date === new Date().toISOString().slice(0, 10)
  )?.count ?? 0;

  return (
    <main style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <a
          href="/"
          aria-label="競売物件データAPI トップページへ戻る"
          style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 700, fontSize: 18, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
        >
          競売物件データAPI
        </a>
        <span style={{ color: '#475569', fontSize: 14 }}>/</span>
        <span style={{ color: '#F8FAFC', fontSize: 14 }}>ダッシュボード</span>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {!dashboardData ? (
          /* Login Form */
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>
              ダッシュボードにログイン
            </h1>
            <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 32 }}>
              登録したメールアドレスでAPIの使用量を確認できます。
            </p>
            <form onSubmit={handleLogin} noValidate>
              <label
                htmlFor="dashboard-email"
                style={{ fontSize: 14, color: '#94A3B8', display: 'block', marginBottom: 8 }}
              >
                メールアドレス
              </label>
              <input
                id="dashboard-email"
                type="email"
                aria-label="登録済みメールアドレスを入力"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  backgroundColor: '#1E293B',
                  color: '#F8FAFC',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '12px 16px',
                  fontSize: 16,
                  marginBottom: 16,
                  minHeight: 44,
                }}
              />
              {error && (
                <p role="alert" style={{ color: '#EF4444', fontSize: 14, marginBottom: 16 }}>{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || !email}
                aria-label="メールアドレスでダッシュボードにアクセス"
                style={{
                  width: '100%',
                  backgroundColor: loading ? '#334155' : '#3B82F6',
                  color: '#F8FAFC',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  minHeight: 44,
                }}
              >
                {loading ? '確認中...' : 'ダッシュボードを開く'}
              </button>
            </form>
            <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 24, textAlign: 'center' }}>
              まだ登録していない方は{' '}
              <a
                href="/#pricing"
                aria-label="料金プランページへ移動して登録する"
                style={{ color: '#3B82F6', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
              >
                こちらから無料登録
              </a>
            </p>
          </div>
        ) : (
          /* Dashboard */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>使用量ダッシュボード</h1>
              <button
                onClick={() => { setDashboardData(null); setEmail(''); setNewKey(''); setWebhookCount(null); }}
                aria-label="ダッシュボードからログアウト"
                style={{
                  backgroundColor: 'transparent',
                  color: '#94A3B8',
                  border: '1px solid #334155',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 14,
                  cursor: 'pointer',
                  minHeight: 44,
                }}
              >
                ログアウト
              </button>
            </div>

            {/* Webhook未設定バナー */}
            {webhookCount === 0 && (
              <div
                role="alert"
                style={{
                  backgroundColor: '#422006',
                  border: '2px solid #F59E0B',
                  borderRadius: 8,
                  padding: '14px 20px',
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 4v5m0 3h.01" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#FCD34D' }}>
                    新着物件の自動通知を設定しましょう
                  </span>
                </div>
                <a
                  href="/webhooks"
                  aria-label="Webhook通知設定ページへ移動"
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#0F172A',
                    textDecoration: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Webhookを設定する
                </a>
              </div>
            )}

            {newKey && (
              <div
                role="alert"
                style={{
                  backgroundColor: '#14532D',
                  border: '1px solid #22C55E',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 24,
                }}
              >
                <p style={{ fontSize: 14, color: '#22C55E', fontWeight: 600, marginBottom: 8 }}>
                  新しいAPIキーが発行されました（この表示は1回限りです）
                </p>
                <code style={{ fontSize: 14, color: '#F8FAFC', wordBreak: 'break-all' }}>{newKey}</code>
              </div>
            )}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: '現在のプラン', value: PLAN_LABELS[dashboardData.plan] ?? dashboardData.plan },
                { label: '日次上限', value: dashboardData.daily_limit >= 99999999 ? '無制限' : `${dashboardData.daily_limit.toLocaleString()} req/日` },
                { label: '本日の使用量', value: `${todayUsage.toLocaleString()} req` },
                { label: 'APIキー', value: dashboardData.key_prefix },
              ].map(({ label, value }) => (
                <div key={label} className="backdrop-blur-md bg-white/5 border border-white/10" style={{ borderRadius: 8, padding: 20 }}>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', margin: 0, wordBreak: 'break-all' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Upgrade CTA（Freeプランのみ） */}
            {dashboardData.plan === 'free' && (
              <div
                aria-label="Proプランへのアップグレード案内"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.08) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(245,158,11,0.35)',
                  borderRadius: 16,
                  padding: '28px 32px',
                  marginBottom: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minWidth: 260 }}>
                  {/* アイコン */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                        stroke="#0F172A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#F59E0B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        margin: '0 0 6px',
                      }}
                    >
                      Freeプラン制限中
                    </p>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: '#F8FAFC', margin: '0 0 8px' }}>
                      Proプランにアップグレードして制限を解除
                    </h3>
                    <p style={{ fontSize: 14, color: '#CBD5E1', margin: 0, lineHeight: 1.6 }}>
                      日次100リクエスト制限を解除。Webhook通知・商用利用・47都道府県フィルタが無制限に。
                      月額¥49,800で本格的な不動産データ活用を始めましょう。
                    </p>
                    <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                      {[
                        { label: '日次リクエスト', free: '100', pro: '無制限' },
                        { label: 'Webhook通知', free: '不可', pro: '可' },
                        { label: '商用利用', free: '不可', pro: '可' },
                      ].map((item) => (
                        <div key={item.label}>
                          <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 2px', fontWeight: 600 }}>
                            {item.label}
                          </p>
                          <p style={{ fontSize: 13, color: '#F59E0B', margin: 0, fontWeight: 700 }}>
                            {item.pro}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                  <a
                    href="/#plans"
                    aria-label="Proプランにアップグレードして制限を解除する"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      backgroundColor: '#F59E0B',
                      color: '#0F172A',
                      textDecoration: 'none',
                      borderRadius: 10,
                      padding: '14px 28px',
                      fontSize: 15,
                      fontWeight: 800,
                      minHeight: 44,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 0 24px rgba(245,158,11,0.35)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                        stroke="#0F172A"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Proプランへアップグレード
                  </a>
                  <a
                    href="/docs#sandbox"
                    aria-label="APIドキュメントを確認する"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94A3B8',
                      textDecoration: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      minHeight: 44,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    プラン詳細を確認する
                  </a>
                </div>
              </div>
            )}

            {/* 今日のお宝物件候補TOP3 */}
            {topProperties.length > 0 && (
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: 24,
                  marginBottom: 32,
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F8FAFC', marginBottom: 4, margin: '0 0 4px' }}>
                  今日のお宝物件候補
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
                  現在公開中の競売物件から最新3件を表示しています
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  {topProperties.map((prop, i) => (
                    <div
                      key={prop.id}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8,
                        padding: 16,
                      }}
                      aria-label={`物件${i + 1}: ${prop.building_name ?? '物件名不明'}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: i === 0 ? '#F59E0B' : i === 1 ? '#94A3B8' : '#CD7C2F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#0F172A',
                          }}
                          aria-hidden="true"
                        >
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {prop.property_type === 'apartment' ? 'マンション' : prop.property_type === 'land' ? '土地' : prop.property_type === 'building' ? '一戸建て' : '物件'}
                        </span>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#F8FAFC', margin: '0 0 8px', lineHeight: 1.4 }}>
                        {prop.building_name ?? '物件名未登録'}
                      </p>
                      <p style={{ fontSize: 13, color: '#94A3B8', margin: '0 0 12px' }}>
                        {prop.address ?? '所在地未登録'}
                      </p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#22C55E', margin: 0 }}>
                        {formatPrice(prop.base_price)}
                        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 400, marginLeft: 4 }}>売却基準額</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chart */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: 12, padding: 24, border: '1px solid #334155', marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F8FAFC', marginBottom: 24 }}>過去30日間のAPI使用量</h2>
              <UsageChart data={dashboardData.usage} dailyLimit={dashboardData.daily_limit} />
            </div>

            {/* Reissue Key */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: 12, padding: 24, border: '1px solid #334155' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#F8FAFC', marginBottom: 8 }}>APIキー管理</h2>
              <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 16 }}>
                現在のキー: <code style={{ color: '#F8FAFC' }}>{dashboardData.key_prefix}</code>
              </p>
              {error && (
                <p role="alert" style={{ color: '#EF4444', fontSize: 14, marginBottom: 16 }}>{error}</p>
              )}
              <button
                onClick={handleReissue}
                disabled={reissuing}
                aria-label="APIキーを再発行する（旧キーは無効化されます）"
                style={{
                  backgroundColor: reissuing ? '#334155' : '#7C3AED',
                  color: '#F8FAFC',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: reissuing ? 'not-allowed' : 'pointer',
                  minHeight: 44,
                }}
              >
                {reissuing ? '処理中...' : 'APIキーを再発行'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
