'use client';

type PlanType = 'free' | 'starter' | 'basic' | 'pro' | 'enterprise';

interface PlanCardProps {
  plan: PlanType;
  onSelect?: (plan: PlanType) => void;
}

const PLAN_DATA: Record<PlanType, {
  name: string;
  price: string;
  priceNote: string;
  daily: string;
  features: string[];
  buttonLabel: string;
  cardStyle: React.CSSProperties;
  popular: boolean;
}> = {
  free: {
    name: 'Free',
    price: '無料',
    priceNote: '永久無料',
    daily: '100',
    features: ['100リクエスト/日', '競売物件一覧API', '統計API（認証不要）', 'コミュニティサポート'],
    buttonLabel: '無料で始める',
    cardStyle: { backgroundColor: '#1E293B', border: '1px solid #334155' },
    popular: false,
  },
  starter: {
    name: 'Starter',
    price: '2,980円',
    priceNote: '/月',
    daily: '1,000',
    features: ['1,000リクエスト/日', '競売物件全件取得', '詳細API', 'メールサポート'],
    buttonLabel: 'Starterプランを選択',
    cardStyle: { backgroundColor: '#1E293B', border: '1px solid #38BDF8' },
    popular: false,
  },
  basic: {
    name: 'Basic',
    price: '9,800円',
    priceNote: '/月',
    daily: '10,000',
    features: ['10,000リクエスト/日', '競売物件全件取得', '詳細API', 'CSV出力', 'メールサポート'],
    buttonLabel: 'Basicプランを選択',
    cardStyle: { backgroundColor: '#1E293B', border: '1px solid #F59E0B' },
    popular: false,
  },
  pro: {
    name: 'Pro',
    price: '29,800円',
    priceNote: '/月',
    daily: '100,000',
    features: ['100,000リクエスト/日', 'Webhook通知', '物件アラート', '優先サポート', 'SLA 99.9%'],
    buttonLabel: 'Proプランを選択',
    cardStyle: { backgroundColor: '#1E293B', border: '2px solid #F59E0B' },
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: '98,000円〜',
    priceNote: '/月（要お問い合わせ）',
    daily: '無制限',
    features: ['無制限リクエスト', '専用クローラー', 'SLA 99.9%', '専任サポート', 'カスタム連携'],
    buttonLabel: 'お問い合わせ',
    cardStyle: { backgroundColor: '#1E293B', border: '2px solid #8B5CF6' },
    popular: false,
  },
};

const BUTTON_COLORS: Record<PlanType, string> = {
  free: '#334155',
  starter: '#38BDF8',
  basic: '#3B82F6',
  pro: '#F59E0B',
  enterprise: '#8B5CF6',
};

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  const data = PLAN_DATA[plan];

  return (
    <div
      className="backdrop-blur-md hover:-translate-y-1 transition-transform duration-300"
      style={{
        ...data.cardStyle,
        borderRadius: 12,
        padding: 24,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        background: 'rgba(30, 41, 59, 0.7)',
      }}
    >
      {data.popular && (
        <div
          aria-label="人気のプラン"
          style={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#F59E0B',
            color: '#0F172A',
            padding: '4px 16px',
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          人気No.1
        </div>
      )}

      <div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>{data.name}</h3>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: plan === 'enterprise' ? 22 : 32, fontWeight: 700, color: '#F8FAFC' }}>{data.price}</span>
          <span style={{ fontSize: 13, color: '#94A3B8' }}>{data.priceNote}</span>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.features.map((feature) => (
          <li key={feature} style={{ fontSize: 14, color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8L6.5 11.5L13 4.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect?.(plan)}
        aria-label={plan === 'enterprise' ? 'Enterpriseプランのお問い合わせページへ移動する' : `${data.name}プランを選択して決済へ進む`}
        style={{
          marginTop: 'auto',
          backgroundColor: BUTTON_COLORS[plan],
          color: plan === 'pro' || plan === 'starter' ? '#0F172A' : '#F8FAFC',
          border: 'none',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 44,
          width: '100%',
        }}
      >
        {data.buttonLabel}
      </button>
    </div>
  );
}
