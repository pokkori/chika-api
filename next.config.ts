import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/api/v1/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'X-API-Key, Content-Type' },
      ],
    },
  ],
};

export default nextConfig;
