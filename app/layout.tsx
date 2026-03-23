import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChikaAPI - 地価データREST API',
  description: '国土交通省公示地価・路線価・基準地価を即時取得できるREST API。不動産会社・フィンテック向け。Free〜Enterpriseプラン。',
  keywords: ['地価', '路線価', 'REST API', '不動産', '国土交通省', '公示地価', 'DaaS'],
  metadataBase: new URL('https://chika-api.vercel.app'),
  openGraph: {
    title: 'ChikaAPI - 地価データREST API',
    description: '全国30万地点の地価データをAPIで取得。Free 100req/日から。',
    url: 'https://chika-api.vercel.app',
    siteName: 'ChikaAPI',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ChikaAPI - 地価データREST API',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChikaAPI - 地価データREST API',
    description: '全国30万地点の地価データをAPIで取得。',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
