import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { fetchLandPriceTrend } from '@/lib/mlit';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const auth = await verifyApiKey(apiKey);

  if (!auth.valid) {
    return NextResponse.json(
      { error: auth.error, code: 'UNAUTHORIZED', docs_url: 'https://chika-api.vercel.app/docs' },
      { status: 401 }
    );
  }

  let rateLimitResult = { allowed: true, remaining: 99, resetAt: Math.floor(Date.now() / 1000) + 1 };
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const result = await checkRateLimit(auth.apiKeyId!, auth.plan!);
    rateLimitResult = result;
  }

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'レート制限を超過しました', code: 'RATE_LIMIT_EXCEEDED', docs_url: 'https://chika-api.vercel.app/docs' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');

  if (!latStr || !lonStr) {
    return NextResponse.json(
      { error: 'lat と lon パラメータは必須です', code: 'MISSING_PARAMETER' },
      { status: 400 }
    );
  }

  const lat = Number(latStr);
  const lon = Number(lonStr);
  const radius = Math.min(Number(searchParams.get('radius') ?? 1000), 5000);
  const years = Math.min(Number(searchParams.get('years') ?? 5), 10);

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: 'lat と lon は数値で入力してください', code: 'INVALID_PARAMETER' },
      { status: 400 }
    );
  }

  const data = await fetchLandPriceTrend(lat, lon, radius, years);

  return NextResponse.json(
    { data, lat, lon, radius_m: radius, years, cached: false },
    {
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    }
  );
}
