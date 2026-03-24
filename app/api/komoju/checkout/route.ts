import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  );
}

const KOMOJU_PLAN_IDS: Record<string, string> = {
  starter: process.env.KOMOJU_PLAN_ID_STARTER || '',
  basic: process.env.KOMOJU_PLAN_ID_BASIC || '',
  pro: process.env.KOMOJU_PLAN_ID_PRO || '',
  enterprise: process.env.KOMOJU_PLAN_ID_ENTERPRISE || '',
};

/**
 * POST /api/komoju/checkout
 * body: { plan: 'basic' | 'pro' | 'enterprise', email: string }
 * KOMOJUセッションを作成してリダイレクトURLを返す。
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.plan || !body.email) {
    return NextResponse.json({ error: 'plan と email は必須です' }, { status: 400 });
  }

  const { plan, email } = body as { plan: string; email: string };

  if (!['starter', 'basic', 'pro', 'enterprise'].includes(plan)) {
    return NextResponse.json({ error: '無効なプランです' }, { status: 400 });
  }

  const planId = KOMOJU_PLAN_IDS[plan];
  if (!planId) {
    return NextResponse.json({ error: 'このプランは現在準備中です。KOMOJU審査通過後に利用可能になります。' }, { status: 503 });
  }

  const komojuSecretKey = process.env.KOMOJU_SECRET_KEY || '';
  if (!komojuSecretKey) {
    return NextResponse.json({ error: 'KOMOJU設定が未完了です' }, { status: 503 });
  }

  // KOMOJUセッション作成
  const komojuRes = await fetch('https://komoju.com/api/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(komojuSecretKey + ':').toString('base64')}`,
    },
    body: JSON.stringify({
      email,
      subscription_plan: planId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://chika-api.vercel.app'}/dashboard?registered=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://chika-api.vercel.app'}/#pricing`,
      default_locale: 'ja',
    }),
  });

  if (!komojuRes.ok) {
    const err = await komojuRes.json().catch(() => ({}));
    console.error('KOMOJU session error:', err);
    return NextResponse.json({ error: '決済セッションの作成に失敗しました' }, { status: 502 });
  }

  const session = await komojuRes.json();

  // ユーザーをDB登録（webhook受信後にplanをupdate）
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = getSupabase();
    await supabase.from('users').upsert({
      email,
      komoju_subscription_id: session.id,
      plan: 'free',
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });
  }

  return NextResponse.json({ redirect_url: session.session_url });
}
