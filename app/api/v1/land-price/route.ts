import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { fetchLandPrice } from '@/lib/mlit';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  );
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const auth = await verifyApiKey(apiKey);

  if (!auth.valid) {
    return NextResponse.json(
      { error: auth.error, code: 'UNAUTHORIZED', docs_url: 'https://chika-api.vercel.app/docs' },
      { status: 401 }
    );
  }

  // Upstash Redis未設定時はレート制限をスキップ
  let rateLimitResult = { allowed: true, remaining: 99, resetAt: Math.floor(Date.now() / 1000) + 1 };
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const result = await checkRateLimit(auth.apiKeyId!, auth.plan!);
    rateLimitResult = result;
  }

  if (!rateLimitResult.allowed) {
    const rl = rateLimitResult as typeof rateLimitResult & { reason?: string };
    return NextResponse.json(
      {
        error: rl.reason === 'daily_limit'
          ? `本日のリクエスト上限に達しました。リセット時刻: ${new Date(rateLimitResult.resetAt * 1000).toISOString()}`
          : 'リクエスト頻度が高すぎます。しばらく待ってから再試行してください。',
        code: rl.reason === 'daily_limit' ? 'DAILY_LIMIT_EXCEEDED' : 'RATE_LIMIT_EXCEEDED',
        docs_url: 'https://chika-api.vercel.app/docs',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        },
      }
    );
  }

  const { searchParams } = new URL(req.url);
  const prefecture = searchParams.get('prefecture');

  if (!prefecture) {
    return NextResponse.json(
      { error: 'prefecture パラメータは必須です（例: prefecture=13）', code: 'MISSING_PARAMETER' },
      { status: 400 }
    );
  }

  const city = searchParams.get('city') ?? undefined;
  const year = searchParams.get('year') ? Number(searchParams.get('year')) : undefined;
  const useCategory = searchParams.get('use_category') ?? undefined;
  const limit = Math.min(Number(searchParams.get('limit') ?? 100), 1000);

  // 使用量をSupabaseに記録（非同期・エラーでも処理継続）
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = getSupabase();
    void Promise.resolve(supabase.rpc('increment_usage', {
      p_api_key_id: auth.apiKeyId,
      p_date: new Date().toISOString().slice(0, 10),
    })).catch(console.error);
  }

  const data = await fetchLandPrice({ prefectureCode: prefecture, cityCode: city, year, useCategory, limit });

  return NextResponse.json(
    { data, total: data.length, cached: false },
    {
      headers: {
        'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        'X-RateLimit-Reset': String(rateLimitResult.resetAt),
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    }
  );
}
