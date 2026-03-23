import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { generateApiKey } from '@/lib/auth';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  );
}

function planFromKomojuPlanId(planId: string): 'basic' | 'pro' | 'enterprise' | null {
  if (planId === process.env.KOMOJU_PLAN_ID_BASIC) return 'basic';
  if (planId === process.env.KOMOJU_PLAN_ID_PRO) return 'pro';
  if (planId === process.env.KOMOJU_PLAN_ID_ENTERPRISE) return 'enterprise';
  return null;
}

/**
 * POST /api/komoju/webhook
 * KOMOJU からの支払い完了通知を受信してユーザーのプランを更新する。
 * HMAC-SHA256で署名検証必須。
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-komoju-signature');
  const webhookSecret = process.env.KOMOJU_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    console.error('KOMOJU_WEBHOOK_SECRET が未設定です');
    return NextResponse.json({ error: 'Webhook設定が未完了です' }, { status: 500 });
  }

  // 署名検証
  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (signature !== expected) {
    console.error('KOMOJU webhook signature mismatch');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // デモモード: ログのみ
    console.info('KOMOJU webhook received (demo mode):', event.type);
    return NextResponse.json({ ok: true });
  }

  const supabase = getSupabase();

  // subscription.subscribed: サブスク開始
  if (event.type === 'subscription.subscribed') {
    const email = event.data.customer?.email;
    const planId = event.data.plan?.id;
    const plan = planFromKomojuPlanId(planId);

    if (!email || !plan) {
      return NextResponse.json({ ok: true });
    }

    // ユーザーのプランを更新
    const { data: user } = await supabase
      .from('users')
      .update({ plan, updated_at: new Date().toISOString() })
      .eq('email', email)
      .select('id')
      .single();

    if (user) {
      // APIキーがなければ発行
      const { data: existing } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        const { raw, hashed, prefix } = generateApiKey();
        await supabase.from('api_keys').insert({
          key: hashed,
          key_prefix: prefix,
          user_id: user.id,
          plan,
          is_active: true,
        });
        console.info(`APIキー発行: ${prefix}*** (plan: ${plan}, user: ${user.id})`);
        // rawは生成時のみ。DBには保存しない
        void raw;
      } else {
        // 既存キーのプランをアップデート
        await supabase
          .from('api_keys')
          .update({ plan })
          .eq('user_id', user.id);
      }
    }
  }

  // subscription.unsubscribed: サブスク解約
  if (event.type === 'subscription.unsubscribed') {
    const email = event.data.customer?.email;
    if (email) {
      await supabase
        .from('users')
        .update({ plan: 'free', updated_at: new Date().toISOString() })
        .eq('email', email);

      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (user) {
        await supabase
          .from('api_keys')
          .update({ plan: 'free' })
          .eq('user_id', user.id);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
