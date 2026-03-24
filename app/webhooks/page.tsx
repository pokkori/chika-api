'use client';
import { useState, useEffect } from 'react';

const TRIGGER_OPTIONS = [
  { id: 'new_property', label: '新規物件追加', desc: '新しい競売物件が登録されたとき' },
  { id: 'price_update', label: '価格更新', desc: '売却基準額が変更されたとき' },
  { id: 'auction_result', label: '落札結果', desc: '競売が落札・取消になったとき' },
];

type WebhookForm = {
  url: string;
  triggers: string[];
  prefecture: string;
  property_type: string;
};

type TestStatus = 'idle' | 'sending' | 'success' | 'error';
type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

function LoginRequired() {
  return (
    <main
      style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      aria-label="Webhook設定ページ - 認証が必要"
    >
      <div
        className="backdrop-blur-md bg-white/5 border border-white/10"
        style={{ borderRadius: 20, padding: 48, maxWidth: 440, width: '100%', textAlign: 'center' }}
      >
        <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect x="6" y="12" width="16" height="11" rx="2" stroke="#F59E0B" strokeWidth="2" />
            <path d="M10 12V9a4 4 0 018 0v3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
          ログインが必要です
        </h1>
        <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, marginBottom: 28 }}>
          Webhook設定にはアカウントが必要です。無料プランでも登録可能です。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href="/api/auth/register"
            aria-label="無料でアカウントを作成してWebhookを設定する"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              textDecoration: 'none',
              padding: '13px 24px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              minHeight: 44,
            }}
          >
            無料で登録する
          </a>
          <a
            href="/api/auth/login"
            aria-label="既存のアカウントでログインする"
            className="backdrop-blur-sm bg-white/5 border border-white/10"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F8FAFC',
              textDecoration: 'none',
              padding: '13px 24px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              minHeight: 44,
            }}
          >
            ログイン
          </a>
        </div>
      </div>
    </main>
  );
}

export default function WebhooksPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [form, setForm] = useState<WebhookForm>({
    url: '',
    triggers: ['new_property'],
    prefecture: '',
    property_type: '',
  });
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [testMessage, setTestMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [savedWebhooks, setSavedWebhooks] = useState<Array<{ id: string; url: string; triggers: string[]; created_at: string }>>([]);

  useEffect(() => {
    // 認証状態をチェック
    fetch('/api/auth/status')
      .then((r) => r.json())
      .then((d) => setAuthenticated(d.authenticated === true))
      .catch(() => setAuthenticated(false));
  }, []);

  if (authenticated === null) {
    return (
      <main
        style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label="Webhook設定ページ - 読み込み中"
        aria-busy="true"
      >
        <p style={{ fontSize: 16, color: '#94A3B8' }}>読み込み中...</p>
      </main>
    );
  }

  if (!authenticated) {
    return <LoginRequired />;
  }

  const toggleTrigger = (id: string) => {
    setForm((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(id)
        ? prev.triggers.filter((t) => t !== id)
        : [...prev.triggers, id],
    }));
  };

  const handleTestSend = async () => {
    if (!form.url) {
      setTestMessage('Webhook URLを入力してください。');
      setTestStatus('error');
      return;
    }
    setTestStatus('sending');
    setTestMessage('');
    try {
      // ダミーPOSTをWebhook URLへ送信
      const dummyPayload = {
        event: 'test',
        source: 'auction-property-api',
        timestamp: new Date().toISOString(),
        data: {
          id: 'sandbox_13_R6_ke_0001',
          court: '東京地方裁判所',
          address: '東京都渋谷区代々木1-1-1（テスト送信）',
          base_price: 18500000,
          status: 'open',
          note: 'これはWebhookのテスト送信です。',
        },
      };
      const res = await fetch(form.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Source': 'auction-property-api-test' },
        body: JSON.stringify(dummyPayload),
        mode: 'no-cors', // CORSを回避
      });
      // no-corsの場合は常にopaqueなので成功扱い
      void res;
      setTestStatus('success');
      setTestMessage('テスト送信が完了しました。Webhook URLを確認してください。');
    } catch (err) {
      setTestStatus('error');
      setTestMessage(`送信に失敗しました: ${String(err)}`);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url || form.triggers.length === 0) return;
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: form.url,
          triggers: form.triggers,
          prefecture: form.prefecture || undefined,
          property_type: form.property_type || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaveStatus('success');
        setSavedWebhooks((prev) => [
          ...prev,
          { id: data.webhook_id || `wh_${Date.now()}`, url: form.url, triggers: form.triggers, created_at: new Date().toISOString() },
        ]);
        setForm({ url: '', triggers: ['new_property'], prefecture: '', property_type: '' });
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  };

  return (
    <main
      style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', padding: '48px 24px' }}
      aria-label="Webhook通知設定ページ"
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <a
            href="/docs"
            aria-label="APIドキュメントへ戻る"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            APIドキュメントへ
          </a>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>
          Webhook通知設定
        </h1>
        <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 36, lineHeight: 1.7 }}>
          条件に合致する新着競売物件が追加された際に、指定のURLへPOSTで通知します。
          ProプランおよびEnterpriseプランで利用可能です。
        </p>

        {/* Form */}
        <div
          className="backdrop-blur-md bg-white/5 border border-white/10"
          style={{ borderRadius: 20, padding: 32, marginBottom: 32 }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', marginBottom: 24 }}>
            新しいWebhookを追加
          </h2>

          <form onSubmit={handleSave} noValidate aria-label="Webhook登録フォーム">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* URL */}
              <div>
                <label
                  htmlFor="webhook-url"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  Webhook URL <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="webhook-url"
                  type="url"
                  required
                  aria-label="Webhook通知先URLを入力（https必須、必須項目）"
                  aria-required="true"
                  placeholder="https://your-server.example.com/webhook"
                  value={form.url}
                  onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                  style={{
                    width: '100%',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: '12px 14px',
                    fontSize: 14,
                    minHeight: 44,
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>
                  HTTPSのURLを指定してください。POSTリクエストで通知が届きます。
                </p>
              </div>

              {/* Triggers */}
              <div>
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 12, fontWeight: 600 }}>
                    通知トリガー <span style={{ color: '#EF4444' }}>*（1つ以上選択）</span>
                  </legend>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {TRIGGER_OPTIONS.map((trigger) => (
                      <label
                        key={trigger.id}
                        htmlFor={`trigger-${trigger.id}`}
                        className="backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                        style={{
                          borderRadius: 8,
                          padding: '12px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          minHeight: 44,
                          borderColor: form.triggers.includes(trigger.id) ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)',
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`trigger-${trigger.id}`}
                          checked={form.triggers.includes(trigger.id)}
                          onChange={() => toggleTrigger(trigger.id)}
                          aria-label={`${trigger.label}トリガーを${form.triggers.includes(trigger.id) ? '無効' : '有効'}にする`}
                          style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#F59E0B' }}
                        />
                        <div>
                          <p style={{ margin: 0, fontSize: 14, color: '#F8FAFC', fontWeight: 600 }}>{trigger.label}</p>
                          <p style={{ margin: 0, fontSize: 12, color: '#64748B' }}>{trigger.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              {/* Prefecture filter */}
              <div>
                <label
                  htmlFor="webhook-prefecture"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  都道府県フィルター
                  <span style={{ fontSize: 12, color: '#475569', marginLeft: 8, fontWeight: 400 }}>（省略時は全国）</span>
                </label>
                <input
                  id="webhook-prefecture"
                  type="text"
                  aria-label="都道府県コードでフィルターする（任意）例: 13=東京都"
                  placeholder="13（東京都）/ 27（大阪府）/ 全国は空欄"
                  value={form.prefecture}
                  onChange={(e) => setForm((prev) => ({ ...prev, prefecture: e.target.value }))}
                  style={{
                    width: '100%',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: '12px 14px',
                    fontSize: 14,
                    minHeight: 44,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Property type filter */}
              <div>
                <label
                  htmlFor="webhook-property-type"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  物件種別フィルター
                  <span style={{ fontSize: 12, color: '#475569', marginLeft: 8, fontWeight: 400 }}>（省略時は全種別）</span>
                </label>
                <select
                  id="webhook-property-type"
                  aria-label="物件種別でフィルターする（任意）"
                  value={form.property_type}
                  onChange={(e) => setForm((prev) => ({ ...prev, property_type: e.target.value }))}
                  style={{
                    width: '100%',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: '12px 14px',
                    fontSize: 14,
                    minHeight: 44,
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">全種別</option>
                  <option value="apartment">マンション・アパート</option>
                  <option value="building">戸建・建物</option>
                  <option value="land">土地</option>
                  <option value="farm">農地・山林</option>
                </select>
              </div>

              {/* Test send + Save buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleTestSend}
                  disabled={testStatus === 'sending' || !form.url}
                  aria-label="Webhook URLへテスト送信する"
                  className="backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  style={{
                    color: '#F8FAFC',
                    borderRadius: 8,
                    padding: '12px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: (testStatus === 'sending' || !form.url) ? 'not-allowed' : 'pointer',
                    minHeight: 44,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    opacity: !form.url ? 0.5 : 1,
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M13 3L3 8l4 2 2 4 4-11z" stroke="#94A3B8" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  {testStatus === 'sending' ? '送信中...' : 'テスト送信'}
                </button>

                <button
                  type="submit"
                  disabled={saveStatus === 'saving' || !form.url || form.triggers.length === 0}
                  aria-label="Webhookを保存・登録する"
                  style={{
                    backgroundColor: (saveStatus === 'saving' || !form.url || form.triggers.length === 0) ? '#334155' : '#F59E0B',
                    color: (saveStatus === 'saving' || !form.url || form.triggers.length === 0) ? '#94A3B8' : '#0F172A',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: (saveStatus === 'saving' || !form.url || form.triggers.length === 0) ? 'not-allowed' : 'pointer',
                    minHeight: 44,
                    flex: 1,
                  }}
                >
                  {saveStatus === 'saving' ? '保存中...' : 'Webhookを登録'}
                </button>
              </div>

              {/* Test status message */}
              {testMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    backgroundColor: testStatus === 'success' ? '#14532D' : '#7F1D1D',
                    borderRadius: 8,
                    padding: '10px 14px',
                    border: `1px solid ${testStatus === 'success' ? '#22C55E40' : '#EF444440'}`,
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13, color: testStatus === 'success' ? '#86EFAC' : '#FCA5A5' }}>
                    {testMessage}
                  </p>
                </div>
              )}

              {saveStatus === 'success' && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{ backgroundColor: '#14532D', borderRadius: 8, padding: '10px 14px', border: '1px solid #22C55E40' }}
                >
                  <p style={{ margin: 0, fontSize: 13, color: '#86EFAC' }}>
                    Webhookを登録しました。
                  </p>
                </div>
              )}

              {saveStatus === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  style={{ backgroundColor: '#7F1D1D', borderRadius: 8, padding: '10px 14px', border: '1px solid #EF444440' }}
                >
                  <p style={{ margin: 0, fontSize: 13, color: '#FCA5A5' }}>
                    登録に失敗しました。ProプランまたはEnterpriseプランへのアップグレードが必要です。
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Registered webhooks */}
        {savedWebhooks.length > 0 && (
          <div
            className="backdrop-blur-md bg-white/5 border border-white/10"
            style={{ borderRadius: 20, padding: 24 }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 16 }}>
              登録済みWebhook ({savedWebhooks.length}件)
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }} aria-label="登録済みWebhook一覧">
              {savedWebhooks.map((wh) => (
                <li
                  key={wh.id}
                  className="backdrop-blur-sm bg-white/5 border border-white/10"
                  style={{ borderRadius: 10, padding: '12px 16px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22C55E', flexShrink: 0 }} aria-hidden="true" />
                    <code style={{ fontSize: 13, color: '#60A5FA', wordBreak: 'break-all' }}>{wh.url}</code>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingLeft: 16 }}>
                    {wh.triggers.map((t) => (
                      <span
                        key={t}
                        style={{ fontSize: 11, backgroundColor: '#1E293B', color: '#94A3B8', borderRadius: 4, padding: '2px 8px' }}
                      >
                        {TRIGGER_OPTIONS.find((o) => o.id === t)?.label ?? t}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payload example */}
        <div
          className="backdrop-blur-md bg-white/5 border border-white/10"
          style={{ borderRadius: 20, padding: 24, marginTop: 24 }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
            Webhookペイロード例
          </h2>
          <p style={{ fontSize: 14, color: '#94A3B8', marginBottom: 12 }}>
            通知時に以下のJSONがPOSTされます。
          </p>
          <pre
            aria-label="Webhookペイロードのサンプル"
            style={{
              backgroundColor: '#0F172A',
              borderRadius: 8,
              padding: 16,
              fontSize: 12,
              color: '#E2E8F0',
              overflow: 'auto',
              border: '1px solid #334155',
              margin: 0,
            }}
          >
            {JSON.stringify({
              event: 'new_property',
              source: 'auction-property-api',
              timestamp: '2026-03-24T09:00:00Z',
              data: {
                id: 'court_13_R6_ke_1234',
                court: '東京地方裁判所',
                address: '東京都渋谷区代々木1-1-1',
                property_type: 'apartment',
                base_price: 12000000,
                auction_end_date: '2026-04-22',
                status: 'open',
              },
            }, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
