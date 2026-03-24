import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | 競売物件データAPI',
  description: '競売物件データAPIの利用規約です。サービスの利用条件・禁止事項・免責事項・準拠法について定めています。',
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    title: '第1条（サービスの概要）',
    content: `本サービス「競売物件データAPI」（以下「本サービス」）は、裁判所公示の不動産競売情報をRESTful APIとして提供するData as a Service（DaaS）です。運営者（以下「当社」）は、本利用規約（以下「本規約」）に従って本サービスを提供します。`,
  },
  {
    title: '第2条（利用登録）',
    content: `利用者は、当社所定の方法により利用登録を申請し、当社がこれを承認することで本サービスを利用できます。当社は、以下の場合に利用登録を拒否することがあります。\n・虚偽の情報を申告した場合\n・過去に本規約違反を行った場合\n・その他当社が不適切と判断した場合`,
  },
  {
    title: '第3条（APIキーの管理）',
    content: `利用者は、当社から発行されたAPIキーを自己の責任で管理するものとします。APIキーの第三者への貸与・譲渡・売買は禁止します。APIキーの漏洩が判明した場合、速やかにダッシュボードより再発行してください。APIキーの不正使用による損害について、当社は責任を負いません。`,
  },
  {
    title: '第4条（利用料金・プラン）',
    content: `本サービスは無料プラン（Free）および有料プラン（Starter・Basic・Pro・Enterprise）を提供します。有料プランの料金は当社ウェブサイトに記載の通りです。月次課金プランの途中解約による日割り返金は行いません。当社は料金改定を行う場合、30日前までにウェブサイトまたはメールで通知します。`,
  },
  {
    title: '第5条（禁止事項）',
    content: `利用者は以下の行為を行ってはなりません。\n・本サービスのAPIデータを無断で第三者に再販・再配布する行為\n・APIキーを複数人で共有して利用制限を回避する行為\n・大量の自動リクエストによりサービスに過負荷をかける行為\n・不正アクセス・サーバーへの攻撃行為\n・法令または公序良俗に反する目的での利用\n・競合サービスの構築を目的とした大規模クローリング`,
  },
  {
    title: '第6条（データの利用制限）',
    content: `本サービスが提供するデータは、裁判所公示情報をもとに作成されたものです。Freeプランは個人・試作目的のみの利用とし、商用利用はBasicプラン以上を要します。APIレスポンスの二次加工・販売を行う場合はEnterpriseプランのご契約が必要です。`,
  },
  {
    title: '第7条（サービスの変更・停止）',
    content: `当社は、以下の場合にサービスを停止・変更することがあります。\n・システムメンテナンスの実施時\n・天災・事故・その他不可抗力による障害時\n・法令改正によりサービス提供が困難になった場合\n計画メンテナンスは事前にウェブサイトで告知します。緊急メンテナンスは事後告知となる場合があります。`,
  },
  {
    title: '第8条（免責事項）',
    content: `当社は以下について一切の責任を負いません。\n・提供データの正確性・完全性・最新性\n・本サービスの利用により生じた損害（逸失利益を含む）\n・第三者との間で生じたトラブル\n・天災・不可抗力による障害\nデータは情報提供を目的としており、投資判断の根拠とする場合はご自身の責任において行ってください。`,
  },
  {
    title: '第9条（知的財産権）',
    content: `本サービスに関する著作権・商標権その他の知的財産権は当社または正当な権利を有する第三者に帰属します。利用者は、本規約の定める範囲を超えて本サービスのコンテンツを複製・転用することを禁じます。`,
  },
  {
    title: '第10条（準拠法・管轄裁判所）',
    content: `本規約は日本法に準拠します。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。`,
  },
];

export default function TermsPage() {
  return (
    <main style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC' }}>
      <header style={{ backgroundColor: '#1E293B', borderBottom: '1px solid #334155', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <a
          href="/"
          aria-label="競売物件データAPI トップページへ戻る"
          style={{ color: '#F59E0B', textDecoration: 'none', fontWeight: 700, fontSize: 18, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
        >
          競売物件データAPI
        </a>
        <span style={{ color: '#475569', fontSize: 14 }}>/</span>
        <span style={{ color: '#F8FAFC', fontSize: 14 }}>利用規約</span>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '40px 48px',
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700, color: '#F8FAFC', marginBottom: 8 }}>
            利用規約
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 40 }}>
            最終更新日: 2026年3月24日
          </p>

          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.8, marginBottom: 40 }}>
            本利用規約（以下「本規約」）は、競売物件データAPI（以下「当社」）が提供する「競売物件データAPI」（以下「本サービス」）の利用条件を定めるものです。利用者は本規約に同意の上、本サービスをご利用ください。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {SECTIONS.map((section) => (
              <section key={section.title} aria-labelledby={section.title}>
                <h2
                  id={section.title}
                  style={{ fontSize: 18, fontWeight: 700, color: '#F8FAFC', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {section.title}
                </h2>
                <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <div
            style={{
              marginTop: 48,
              padding: '20px 24px',
              background: 'rgba(59,130,246,0.08)',
              border: '1px solid rgba(59,130,246,0.2)',
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>
              本規約に関するお問い合わせは、
              <a
                href="/"
                aria-label="トップページのお問い合わせフォームへ"
                style={{ color: '#3B82F6', textDecoration: 'none', marginLeft: 4, marginRight: 4 }}
              >
                トップページ
              </a>
              のお問い合わせフォームよりご連絡ください。
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          <a
            href="/privacy"
            aria-label="プライバシーポリシーページへ"
            style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
          >
            プライバシーポリシー
          </a>
          <a
            href="/legal"
            aria-label="特定商取引法に基づく表記ページへ"
            style={{ fontSize: 14, color: '#64748B', textDecoration: 'none', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
          >
            特定商取引法に基づく表記
          </a>
        </div>
      </div>
    </main>
  );
}
