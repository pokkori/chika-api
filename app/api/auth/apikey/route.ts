import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateApiKey } from '@/lib/auth';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  );
}

/**
 * GET /api/auth/apikey
 * ヘッダー: Authorization: Bearer <email>
 * ユーザーのAPIキー情報（prefix）を取得する。
 * 平文キーは返さない。
 */
export async function GET(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization: Bearer <email> ヘッダーが必要です' }, { status: 401 });
  }

  const email = authorization.slice(7).trim();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      key_prefix: 'chika_DEMO**',
      plan: 'free',
      is_active: true,
      created_at: new Date().toISOString(),
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
    .select('key_prefix, plan, is_active, created_at')
    .eq('user_id', user.id)
    .single();

  if (!apiKey) {
    return NextResponse.json({ error: 'APIキーが見つかりません' }, { status: 404 });
  }

  return NextResponse.json({
    key_prefix: `${apiKey.key_prefix}***`,
    plan: apiKey.plan,
    is_active: apiKey.is_active,
    created_at: apiKey.created_at,
  });
}

/**
 * POST /api/auth/apikey
 * body: { email: string }
 * APIキーを再発行する。旧キーは無効化される。
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: 'email は必須です' }, { status: 400 });
  }

  const email = String(body.email).trim().toLowerCase();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { raw } = generateApiKey();
    return NextResponse.json({
      message: '新しいAPIキーを発行しました。旧キーは無効化されました。',
      api_key: raw,
      note: 'デモモード',
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

  // 旧キーを無効化
  await supabase
    .from('api_keys')
    .update({ is_active: false })
    .eq('user_id', user.id);

  // 新キー発行
  const { raw, hashed, prefix } = generateApiKey();
  const { error: keyError } = await supabase.from('api_keys').insert({
    key: hashed,
    key_prefix: prefix,
    user_id: user.id,
    plan: user.plan,
    is_active: true,
  });

  if (keyError) {
    return NextResponse.json({ error: 'APIキーの再発行に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({
    message: '新しいAPIキーを発行しました。旧キーは無効化されました。',
    api_key: raw,
  });
}
