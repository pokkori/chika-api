import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { fetchRoutePrice } from '@/lib/mlit';

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
  const prefecture = searchParams.get('prefecture');
  const line = searchParams.get('line');

  if (!prefecture || !line) {
    return NextResponse.json(
      { error: 'prefecture と line パラメータは必須です（例: prefecture=13&line=山手線）', code: 'MISSING_PARAMETER' },
      { status: 400 }
    );
  }

  const data = await fetchRoutePrice(prefecture, line);

  return NextResponse.json(
    { data, prefecture, line, total: data.length, cached: false },
    {
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    }
  );
}
