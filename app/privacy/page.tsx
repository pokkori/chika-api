export default function Privacy() {
  return (
    <div
      style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'sans-serif',
        lineHeight: 1.8,
        color: '#e2e8f0',
        background: '#0f172a',
        minHeight: '100vh',
      }}
    >
      <h1>プライバシーポリシー</h1>
      <p>
        競売物件データAPI（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
      </p>
      <h2>収集する情報</h2>
      <p>
        本サービスのAPIをご利用の際、メールアドレス・APIキー・リクエストログを収集します。
        競売物件の検索条件（都道府県・価格帯など）もログとして記録されますが、個人を特定できる情報の収集は行いません。
      </p>
      <h2>情報の利用目的</h2>
      <ul>
        <li>APIキーの発行・管理・利用制限の管理</li>
        <li>不正アクセス・異常リクエストの検知と防止</li>
        <li>使用量ダッシュボードへのデータ提供</li>
        <li>サービスの改善・障害対応</li>
      </ul>
      <p>収集した情報は上記目的以外には利用せず、第三者へは提供しません。</p>
      <h2>Cookieおよびローカルストレージについて</h2>
      <p>
        本サービスでは、連続利用日数（ストリーク）の管理のためにブラウザのローカルストレージを使用します。
        外部の広告サービスへの情報提供は行いません。
      </p>
      <h2>データの保管期間</h2>
      <p>
        リクエストログは90日間保管後、自動的に削除されます。
        アカウント削除をご希望の場合はお問い合わせください。
      </p>
      <h2>データソースについて</h2>
      <p>
        本サービスが提供する競売物件データは、裁判所が公開する公示情報（bit.sikkou.jp）および官報（kanpou.npb.go.jp）から取得しています。
        いずれも公開情報であり、個人情報を含まない公示データのみを収集・提供しています。
      </p>
      <h2>お問い合わせ</h2>
      <p>
        X:{' '}
        <a
          href="https://twitter.com/levona_design"
          aria-label="Xアカウント @levona_design へ移動"
          style={{ color: '#F59E0B' }}
        >
          @levona_design
        </a>
      </p>
      <p style={{ marginTop: '24px' }}>
        <a
          href="/"
          aria-label="競売物件データAPI トップページへ戻る"
          style={{ color: '#F59E0B', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
        >
          トップに戻る
        </a>
      </p>
    </div>
  );
}
