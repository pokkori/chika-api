export default function Legal() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif', lineHeight: 1.8, color: '#e2e8f0', background: '#0f172a', minHeight: '100vh' }}>
      <h1>特定商取引法に基づく表記</h1>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '16px' }}>
        <tbody>
          <tr><td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>販売事業者</td><td style={{ padding: '8px', border: '1px solid #334155' }}>ポッコリラボ</td></tr>
          <tr><td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>所在地</td><td style={{ padding: '8px', border: '1px solid #334155' }}>お問い合わせ後に開示します</td></tr>
          <tr><td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>連絡先</td><td style={{ padding: '8px', border: '1px solid #334155' }}>X: @levona_design</td></tr>
          <tr><td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>料金</td><td style={{ padding: '8px', border: '1px solid #334155' }}>Freeプラン: 0円 / Standardプラン: 月額2,980円 / Enterpriseプラン: 要相談</td></tr>
          <tr><td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>支払方法</td><td style={{ padding: '8px', border: '1px solid #334155' }}>クレジットカード（KOMOJU経由）</td></tr>
          <tr><td style={{ padding: '8px', border: '1px solid #334155', fontWeight: 'bold' }}>返金ポリシー</td><td style={{ padding: '8px', border: '1px solid #334155' }}>購入後7日以内にお問い合わせください</td></tr>
        </tbody>
      </table>
      <h2 style={{ marginTop: '32px' }}>利用規約</h2>
      <p>本サービスはAPIとして地価データを提供します。商用利用は有料プランへのご加入が必要です。</p>
      <h2>禁止事項</h2>
      <ul>
        <li>本サービスのデータの再配布</li>
        <li>APIキーの第三者への譲渡</li>
        <li>本サービスへの過負荷攻撃</li>
      </ul>
      <h2>免責事項</h2>
      <p>提供する地価データは参考値です。投資判断等には必ず専門家にご相談ください。</p>
      <p style={{ marginTop: '24px' }}><a href="/" style={{ color: '#6366f1' }}>トップに戻る</a></p>
    </div>
  );
}
