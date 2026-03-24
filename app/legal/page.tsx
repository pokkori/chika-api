export default function Legal() {
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
      <h1>特定商取引法に基づく表記</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '16px' }}>
        <tbody>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>販売事業者</td>
            <td style={{ padding: '8px', border: '1px solid #334155' }}>ポッコリラボ</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>所在地</td>
            <td style={{ padding: '8px', border: '1px solid #334155' }}>お問い合わせ後に開示します</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>連絡先</td>
            <td style={{ padding: '8px', border: '1px solid #334155' }}>X: @levona_design</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>料金</td>
            <td style={{ padding: '8px', border: '1px solid #334155' }}>
              Starterプラン: 月額2,980円 / Basicプラン: 月額9,800円 / Proプラン: 月額29,800円 / Businessプラン: 月額59,800円 / Enterpriseプラン: 月額98,000円〜
            </td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>支払方法</td>
            <td style={{ padding: '8px', border: '1px solid #334155' }}>クレジットカード（KOMOJU経由）</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>返金ポリシー</td>
            <td style={{ padding: '8px', border: '1px solid #334155' }}>購入後7日以内にお問い合わせください</td>
          </tr>
          <tr>
            <td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>役務の提供時期</td>
            <td style={{ padding: '8px', border: '1px solid #334155' }}>APIキー発行後、即時</td>
          </tr>
        </tbody>
      </table>
      <h2 style={{ marginTop: '32px' }}>利用規約</h2>
      <p>
        本サービス（競売物件データAPI）は、裁判所が公開する競売物件情報をREST APIとして提供します。
        商用利用はBasicプラン以上へのご加入が必要です。Freeプランは個人・試作目的のみとなります。
      </p>
      <h2>禁止事項</h2>
      <ul>
        <li>本サービスのデータの無断再配布・転売</li>
        <li>APIキーの第三者への譲渡・共有</li>
        <li>本サービスへの過負荷攻撃・不正アクセス</li>
        <li>個人を特定することを目的としたデータ収集・利用</li>
        <li>公序良俗に反する目的での利用</li>
      </ul>
      <h2>免責事項</h2>
      <p>
        提供する競売物件データは裁判所の公開情報を元にしていますが、最新性・正確性を保証するものではありません。
        投資判断等には必ず専門家（弁護士・不動産鑑定士等）にご相談ください。
        本サービスの利用によって生じた損害に対し、当社は責任を負いかねます。
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
