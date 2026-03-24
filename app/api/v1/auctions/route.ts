import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const auth = await verifyApiKey(apiKey);

  if (!auth.valid) {
    return NextResponse.json(
      { error: auth.error, code: 'UNAUTHORIZED', docs_url: 'https://auction-property-api.vercel.app/docs' },
      { status: 401 }
    );
  }

  if (process.env.UPSTASH_REDIS_REST_URL) {
    const rl = await checkRateLimit(auth.apiKeyId!, auth.plan!);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'レート制限を超過しました。プランアップグレードをご検討ください。', code: 'RATE_LIMIT_EXCEEDED', upgrade_url: 'https://auction-property-api.vercel.app/#plans' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(rl.resetAt) } }
      );
    }
  }

  const { searchParams } = new URL(req.url);
  const prefecture = searchParams.get('prefecture');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('min_price');
  const maxPrice = searchParams.get('max_price');
  const status = searchParams.get('status') ?? 'open';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  const supabase = getSupabase();
  let query = supabase
    .from('auction_properties')
    .select('id, court, case_number, property_type, address, building_name, area_sqm, base_price, auction_start_date, auction_end_date, status, court_url, lat, lon, scraped_at', { count: 'exact' })
    .eq('status', status)
    .range(offset, offset + limit - 1)
    .order('scraped_at', { ascending: false });

  if (prefecture) query = query.eq('prefecture_code', prefecture);
  if (category) query = query.eq('property_type', category);
  if (minPrice) query = query.gte('base_price', parseInt(minPrice, 10));
  if (maxPrice) query = query.lte('base_price', parseInt(maxPrice, 10));

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'データ取得に失敗しました', code: 'DB_ERROR' }, { status: 500 });
  }

  // 使用量記録
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && auth.apiKeyId) {
    await getSupabase().rpc('increment_usage', { p_api_key_id: auth.apiKeyId, p_date: new Date().toISOString().split('T')[0] });
  }

  return NextResponse.json(
    { total: count ?? 0, limit, offset, items: data ?? [] },
    {
      headers: {
        'X-RateLimit-Remaining': '99',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
}
