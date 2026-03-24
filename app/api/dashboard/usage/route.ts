import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  );
}

/**
 * GET /api/dashboard/usage
 * ヘッダー: Authorization: Bearer <email>
 * 過去30日分の使用量データを返す。
 */
export async function GET(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization: Bearer <email> ヘッダーが必要です' }, { status: 401 });
  }

  const email = authorization.slice(7).trim();

  // デモモード
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const today = new Date();
    const demoData = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toISOString().slice(0, 10),
        count: Math.floor(Math.random() * 80),
      };
    });
    return NextResponse.json({
      usage: demoData,
      plan: 'free',
      daily_limit: 100,
      key_prefix: 'chika_DEMO**',
    });
  }

  const supabase = getSupabase();

  const { data: user } = await supabase
    .from('users')
    .select('id, plan')
    .eq('email', email)
    .single();

  if (!user) {
    return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
  }

  const { data: apiKey } = await supabase
    .from('api_keys')
    .select('id, key_prefix, plan')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single();

  if (!apiKey) {
    return NextResponse.json({ error: 'APIキーが見つかりません' }, { status: 404 });
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: usageData } = await supabase
    .from('usage_daily')
    .select('date, request_count')
    .eq('api_key_id', apiKey.id)
    .gte('date', thirtyDaysAgo.toISOString().slice(0, 10))
    .order('date', { ascending: true });

  const DAILY_LIMITS: Record<string, number> = {
    free: 100,
    starter: 1000,
    basic: 10000,
    pro: 100000,
    enterprise: 99999999,
  };

  return NextResponse.json({
    usage: (usageData ?? []).map((row) => ({ date: row.date, count: row.request_count })),
    plan: apiKey.plan,
    daily_limit: DAILY_LIMITS[apiKey.plan] ?? 100,
    key_prefix: `${apiKey.key_prefix}***`,
  });
}
