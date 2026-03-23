import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://chika-api.vercel.app', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://chika-api.vercel.app/docs', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://chika-api.vercel.app/dashboard', lastModified: new Date(), changeFrequency: 'never', priority: 0.5 },
  ];
}
