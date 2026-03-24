import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://auction-property-api.vercel.app';
  return [
    { url: base, lastModified: new Date('2026-03-24'), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/docs`, lastModified: new Date('2026-03-24'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/invoice`, lastModified: new Date('2026-03-24'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/webhooks`, lastModified: new Date('2026-03-24'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/dashboard`, lastModified: new Date('2026-03-24'), changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/legal`, lastModified: new Date('2026-03-24'), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date('2026-03-24'), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date('2026-03-24'), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
