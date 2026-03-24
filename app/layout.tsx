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
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '競売物件データAPI' }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '競売物件データAPI',
    description: '裁判所競売情報を毎日自動収集。REST APIで即時取得。',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  keywords: ['競売物件', 'API', '不動産投資', '裁判所競売', '訳あり物件', '競売情報', 'REST API'],
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
                  name: 'データの更新頻度は？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '毎日午前9時（JST）にVercel Cronで自動クロールを実行し、全国の最新競売公示情報を取得・更新します。',
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
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
