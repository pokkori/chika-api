import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '競売物件データAPI - 裁判所競売情報をAPIで取得',
  description: '裁判所の競売物件・訳あり激安物件データを自動収集し、REST APIで提供。不動産投資家・テック企業向け。Free〜Enterpriseプラン。',
  metadataBase: new URL('https://auction-property-api.vercel.app'),
  openGraph: {
    title: '競売物件データAPI - 裁判所競売情報をAPIで取得',
    description: '一般サイトに載らない競売・訳あり物件データをAPIで。毎日自動更新。',
    url: 'https://auction-property-api.vercel.app',
    siteName: '競売物件データAPI',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: '競売物件データAPI' }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '競売物件データAPI',
    description: '裁判所競売情報を毎日自動収集。REST APIで即時取得。',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  keywords: ['競売物件', 'API', '不動産投資', '裁判所競売', '訳あり物件', '競売情報', 'REST API', '裁判所入札情報API', '競売物件JSON', '不動産競売 自動化', '競売データAPI'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebAPI',
              name: '競売物件データAPI',
              description: '裁判所競売物件情報を毎日自動収集し、REST APIで提供するサービス。',
              url: 'https://auction-property-api.vercel.app',
              provider: {
                '@type': 'Organization',
                name: '競売物件データAPI',
                url: 'https://auction-property-api.vercel.app',
              },
              documentation: 'https://auction-property-api.vercel.app/docs',
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: '競売物件データAPI',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              url: 'https://auction-property-api.vercel.app',
              description: '裁判所競売物件情報をRESTful APIで提供。不動産投資家・テック企業向けのDaaS。毎日自動更新、47都道府県対応。',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'JPY',
                priceRange: '¥2,980〜',
                offers: [
                  { '@type': 'Offer', name: 'Freeプラン', price: '0', priceCurrency: 'JPY' },
                  { '@type': 'Offer', name: 'Starterプラン', price: '2980', priceCurrency: 'JPY' },
                  { '@type': 'Offer', name: 'Basicプラン', price: '9800', priceCurrency: 'JPY' },
                ],
              },
              provider: {
                '@type': 'Organization',
                name: '競売物件データAPI',
                url: 'https://auction-property-api.vercel.app',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '競売物件データAPIとは？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '裁判所公示の不動産競売情報をRESTful APIとして提供するDaaSサービスです。毎日自動更新し、47都道府県の物件データをJSON形式で取得できます。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '無料プランで何ができますか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '無料プランでは1日100リクエストまで利用可能です。認証不要のstats APIで全国の統計情報も取得できます。',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'データの更新頻度はどのくらいですか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '裁判所公示情報に基づき毎日自動更新されます。更新時刻は日本時間午前9時です。',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'APIキーはすぐに発行されますか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'はい。メールアドレスを登録するだけで即座に発行されます。クレジットカードは不要です。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '商用利用は可能ですか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'はい。Basicプラン以上で商用利用が可能です。Freeプランは個人・試作目的のみとなります。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '画像データは含まれますか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'はい、物件写真URLが含まれます（画像ファイル自体はBITリンクです）。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '稼働率（SLA）はどのくらいですか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '99.5%以上のアップタイムを保証しています。Businessプラン以上ではSLA証明書を発行します。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '解約はいつでも可能ですか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'はい、月次契約のため翌月に解約可能です。年間契約は期間中の解約は対応しておりません。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '無料トライアルはありますか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Sandboxモード（デモAPIキー）で制限付き無料試用が可能です。本番APIは7日間無料トライアル付きです。',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Webhook通知はどのプランから使えますか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'BasicプランおよびProプラン以上でご利用いただけます。指定条件（都道府県・物件種別・価格帯）に合致する新着物件を自動通知します。',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
