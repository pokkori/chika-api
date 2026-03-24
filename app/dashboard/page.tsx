'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reissuing, setReissuing] = useState(false);
  const [newKey, setNewKey] = useState('');
  const router = useRouter();

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
                onClick={() => { setDashboardData(null); setEmail(''); setNewKey(''); }}
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
                <div key={label} style={{ backgroundColor: '#1E293B', borderRadius: 8, padding: 20, border: '1px solid #334155' }}>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', margin: 0, wordBreak: 'break-all' }}>{value}</p>
                </div>
              ))}
            </div>

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
