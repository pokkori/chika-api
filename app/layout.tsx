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
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
