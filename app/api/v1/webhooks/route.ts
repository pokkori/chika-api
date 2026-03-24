import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { randomBytes } from 'crypto';

interface WebhookBody {
  endpoint_url: string;
  filter_prefecture?: string;
  filter_property_type?: string;
  filter_min_price?: number;
  filter_max_price?: number;
}

// POST /api/v1/webhooks - Proプラン以上のみ
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  const auth = await verifyApiKey(apiKey);

  if (!auth.valid) {
    return NextResponse.json({ error: auth.error, code: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (auth.plan !== 'pro' && auth.plan !== 'enterprise') {
    return NextResponse.json(
      { error: 'Webhook機能はProプラン以上でご利用いただけます。', code: 'PLAN_REQUIRED', upgrade_url: 'https://auction-property-api.vercel.app/#plans' },
      { status: 403 }
    );
  }

  let body: WebhookBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'リクエストボディが不正です', code: 'INVALID_BODY' }, { status: 400 });
  }

  if (!body.endpoint_url || !body.endpoint_url.startsWith('https://')) {
    return NextResponse.json({ error: 'endpoint_urlはHTTPS URLが必要です', code: 'INVALID_URL' }, { status: 400 });
  }

  const secret = randomBytes(32).toString('hex');

  const { data, error } = await getSupabase()
    .from('webhook_subscriptions')
    .insert({
      user_id: auth.userId,
      endpoint_url: body.endpoint_url,
      secret,
      filter_prefecture: body.filter_prefecture ?? null,
      filter_property_type: body.filter_property_type ?? null,
      filter_min_price: body.filter_min_price ?? null,
      filter_max_price: body.filter_max_price ?? null,
      is_active: true,
    })
    .select('id, endpoint_url, filter_prefecture, filter_property_type, filter_min_price, filter_max_price, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Webhook登録に失敗しました', code: 'DB_ERROR' }, { status: 500 });
  }

  return NextResponse.json({
    ...data,
    secret,
    message: 'Webhook登録完了。secretはHMACシグネチャ検証に使用してください。',
  }, { status: 201 });
}
