'use client';
import { useState } from 'react';

const PLAN_OPTIONS = [
  { value: 'starter', label: 'Starter - 月額 ¥2,980（1,000リクエスト/日）' },
  { value: 'basic', label: 'Basic - 月額 ¥9,800（10,000リクエスト/日）' },
  { value: 'pro', label: 'Pro - 月額 ¥29,800（50,000リクエスト/日）' },
  { value: 'business', label: 'Business - 月額 ¥59,800（200,000リクエスト/日）' },
  { value: 'enterprise', label: 'Enterprise - 月額 ¥98,000〜（無制限リクエスト）' },
];

type FormState = {
  company: string;
  contact: string;
  email: string;
  phone: string;
  plan: string;
  note: string;
};

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error' | 'supabase_error';

export default function InvoicePage() {
  const [form, setForm] = useState<FormState>({
    company: '',
    contact: '',
    email: '',
    phone: '',
    plan: 'standard',
    note: '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      // Supabaseへのinsert試行
      const res = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        if (data?.fallback_email) {
          setStatus('supabase_error');
          setErrorMessage(data.fallback_email);
        } else {
          setStatus('error');
          setErrorMessage(data?.message || '送信に失敗しました。');
        }
      }
    } catch {
      setStatus('supabase_error');
      setErrorMessage('info@auction-property-api.vercel.app');
    }
  };

  const selectedPlanLabel = PLAN_OPTIONS.find((p) => p.value === form.plan)?.label ?? '';

  if (status === 'success') {
    return (
      <main
        style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        aria-label="請求書払い申請完了ページ"
      >
        <div
          className="backdrop-blur-md bg-white/5 border border-white/10"
          style={{ borderRadius: 20, padding: 48, maxWidth: 520, width: '100%', textAlign: 'center' }}
        >
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#14532D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M8 16l6 6 10-12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#F8FAFC', marginBottom: 12 }}>
            申請を受け付けました
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7, marginBottom: 8 }}>
            3営業日以内にご登録のメールアドレス宛にご連絡します。
          </p>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 32 }}>
            お急ぎの場合は info@auction-property-api.vercel.app までお問い合わせください。
          </p>
          <a
            href="/"
            aria-label="トップページに戻る"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#F59E0B',
              color: '#0F172A',
              textDecoration: 'none',
              padding: '12px 28px',
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              minHeight: 44,
            }}
          >
            トップページへ戻る
          </a>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', padding: '48px 24px' }}
      aria-label="請求書払い申請ページ"
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <a
            href="/"
            aria-label="競売物件データAPI トップページへ戻る"
            style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            トップへ戻る
          </a>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>
          請求書払い申請
        </h1>
        <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: 32, lineHeight: 1.7 }}>
          法人・官公庁向けの請求書（インボイス）払いに対応しています。
          お申し込み後、<strong style={{ color: '#F8FAFC' }}>3営業日以内</strong>にご担当者様へご連絡いたします。
        </p>

        {/* Info card */}
        <div
          className="backdrop-blur-sm bg-white/5 border border-white/10"
          style={{ borderRadius: 12, padding: '16px 20px', marginBottom: 32, display: 'flex', gap: 12, alignItems: 'flex-start' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="10" cy="10" r="9" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M10 9v5M10 7v.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <p style={{ margin: 0, fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
              クレジットカード決済をご希望の場合は
              <a href="/#plans" aria-label="プランページへ移動" style={{ color: '#F59E0B', textDecoration: 'underline', margin: '0 4px' }}>プランページ</a>
              からお申し込みいただけます。インボイス登録番号の発行も対応しています。
            </p>
          </div>
        </div>

        {/* Form */}
        <div
          className="backdrop-blur-md bg-white/5 border border-white/10"
          style={{ borderRadius: 20, padding: 32 }}
        >
          <form onSubmit={handleSubmit} noValidate aria-label="請求書払い申請フォーム">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Company */}
              <div>
                <label
                  htmlFor="invoice-company"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  会社名 <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="invoice-company"
                  name="company"
                  type="text"
                  required
                  aria-label="会社名を入力（必須）"
                  aria-required="true"
                  placeholder="株式会社サンプル"
                  value={form.company}
                  onChange={handleChange}
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

              {/* Contact */}
              <div>
                <label
                  htmlFor="invoice-contact"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  担当者名 <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="invoice-contact"
                  name="contact"
                  type="text"
                  required
                  aria-label="担当者名を入力（必須）"
                  aria-required="true"
                  placeholder="山田 太郎"
                  value={form.contact}
                  onChange={handleChange}
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

              {/* Email */}
              <div>
                <label
                  htmlFor="invoice-email"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  メールアドレス <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  id="invoice-email"
                  name="email"
                  type="email"
                  required
                  aria-label="メールアドレスを入力（必須）"
                  aria-required="true"
                  placeholder="yamada@example.com"
                  value={form.email}
                  onChange={handleChange}
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

              {/* Phone */}
              <div>
                <label
                  htmlFor="invoice-phone"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  電話番号
                </label>
                <input
                  id="invoice-phone"
                  name="phone"
                  type="tel"
                  aria-label="電話番号を入力（任意）"
                  placeholder="03-0000-0000"
                  value={form.phone}
                  onChange={handleChange}
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

              {/* Plan */}
              <div>
                <label
                  htmlFor="invoice-plan"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  希望プラン <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  id="invoice-plan"
                  name="plan"
                  required
                  aria-label="希望プランを選択（必須）"
                  aria-required="true"
                  value={form.plan}
                  onChange={handleChange}
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
                  {PLAN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div>
                <label
                  htmlFor="invoice-note"
                  style={{ fontSize: 14, color: '#CBD5E1', display: 'block', marginBottom: 6, fontWeight: 600 }}
                >
                  備考・ご要望
                </label>
                <textarea
                  id="invoice-note"
                  name="note"
                  aria-label="備考やご要望を入力（任意）"
                  placeholder="ご要望・ご質問など"
                  rows={4}
                  value={form.note}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    backgroundColor: '#0F172A',
                    color: '#F8FAFC',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    padding: '12px 14px',
                    fontSize: 14,
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: 100,
                  }}
                />
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  style={{ backgroundColor: '#7F1D1D', borderRadius: 8, padding: '12px 16px', border: '1px solid #EF4444' }}
                >
                  <p style={{ margin: 0, fontSize: 14, color: '#FCA5A5' }}>
                    {errorMessage || '送信に失敗しました。しばらくしてから再度お試しください。'}
                  </p>
                </div>
              )}

              {status === 'supabase_error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="backdrop-blur-sm bg-white/5 border border-white/10"
                  style={{ borderRadius: 8, padding: '12px 16px' }}
                >
                  <p style={{ margin: 0, fontSize: 14, color: '#94A3B8' }}>
                    フォーム送信に問題が発生しました。以下のメールアドレスまで直接お送りください。
                  </p>
                  <a
                    href={`mailto:${errorMessage}?subject=請求書払い申請: ${selectedPlanLabel}&body=会社名: ${form.company}%0A担当者: ${form.contact}%0Aプラン: ${selectedPlanLabel}`}
                    aria-label="メールで申請する"
                    style={{ display: 'inline-block', marginTop: 8, color: '#F59E0B', textDecoration: 'underline', fontSize: 15, fontWeight: 600 }}
                  >
                    {errorMessage}
                  </a>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading' || !form.company || !form.contact || !form.email}
                aria-label="請求書払い申請を送信する"
                style={{
                  backgroundColor: (status === 'loading' || !form.company || !form.contact || !form.email) ? '#334155' : '#F59E0B',
                  color: (status === 'loading' || !form.company || !form.contact || !form.email) ? '#94A3B8' : '#0F172A',
                  border: 'none',
                  borderRadius: 10,
                  padding: '14px 24px',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: (status === 'loading' || !form.company || !form.contact || !form.email) ? 'not-allowed' : 'pointer',
                  minHeight: 44,
                  width: '100%',
                  transition: 'background-color 0.2s',
                }}
              >
                {status === 'loading' ? '送信中...' : '申請を送信する'}
              </button>

              <p style={{ margin: 0, fontSize: 13, color: '#475569', textAlign: 'center' }}>
                お申し込み後、3営業日以内にご連絡いたします。
              </p>
            </div>
          </form>
        </div>

        {/* Plan comparison */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', marginBottom: 16 }}>プラン比較</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              {
                name: 'Starter',
                price: '¥2,980/月',
                features: ['1,000リクエスト/日', '47都道府県対応', 'メールサポート', '個人利用可'],
              },
              {
                name: 'Basic',
                price: '¥9,800/月',
                features: ['10,000リクエスト/日', '47都道府県対応', 'メールサポート', '商用利用可', 'Webhook通知（5件まで）'],
              },
              {
                name: 'Pro',
                price: '¥29,800/月',
                features: ['50,000リクエスト/日', '47都道府県対応', '優先サポート', '商用利用可', 'Webhook通知（無制限）'],
              },
              {
                name: 'Business',
                price: '¥59,800/月',
                features: ['200,000リクエスト/日', '47都道府県対応', '優先サポート', '商用利用可', 'Webhook通知（無制限）', 'SLA 99.5%保証'],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: '¥98,000〜/月',
                features: ['無制限リクエスト', '47都道府県対応', '専任サポート', '商用利用可', 'Webhook通知（無制限）', 'SLA 99.9%保証', 'カスタムデータフィールド'],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`backdrop-blur-md border ${plan.highlighted ? 'border-amber-500/40' : 'border-white/10'}`}
                style={{
                  backgroundColor: plan.highlighted ? 'rgba(245,158,11,0.05)' : 'rgba(255,255,255,0.03)',
                  borderRadius: 16,
                  padding: 24,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 4 }}>{plan.name}</h3>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#F59E0B', marginBottom: 16 }}>{plan.price}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#94A3B8' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8l4 4 6-7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
