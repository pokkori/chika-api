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
 * POST /api/auth/register
 * body: { email: string }
 * Freeプランのユーザーを登録してAPIキーを発行する。
 * APIキーはこのレスポンスで1回だけ返す（以降はkey_prefixのみ表示）。
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: 'email は必須です' }, { status: 400 });
  }

  const email = String(body.email).trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: '有効なメールアドレスを入力してください' }, { status: 400 });
  }

  // Supabase未設定時はデモレスポンスを返す
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { raw } = generateApiKey();
    return NextResponse.json({
      message: 'APIキーを発行しました。このキーは一度しか表示されません。安全な場所に保存してください。',
      api_key: raw,
      plan: 'free',
      limits: { daily: 100, per_second: 5 },
      docs_url: 'https://chika-api.vercel.app/docs',
      note: 'デモモード：Supabase未設定のため実際のDBには保存されていません',
    });
  }

  const supabase = getSupabase();

  // 既存ユーザーチェック
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: 'このメールアドレスは既に登録されています。ダッシュボードでAPIキーを確認してください: https://chika-api.vercel.app/dashboard' },
      { status: 409 }
    );
  }

  // ユーザー登録
  const { data: user, error: userError } = await supabase
    .from('users')
    .insert({ email, plan: 'free' })
    .select('id')
    .single();

  if (userError || !user) {
    console.error('User insert error:', userError);
    return NextResponse.json({ error: 'ユーザー登録に失敗しました' }, { status: 500 });
  }

  // APIキー発行
  const { raw, hashed, prefix } = generateApiKey();
  const { error: keyError } = await supabase.from('api_keys').insert({
    key: hashed,
    key_prefix: prefix,
    user_id: user.id,
    plan: 'free',
    is_active: true,
  });

  if (keyError) {
    console.error('API key insert error:', keyError);
    return NextResponse.json({ error: 'APIキーの発行に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({
    message: 'APIキーを発行しました。このキーは一度しか表示されません。安全な場所に保存してください。',
    api_key: raw,
    plan: 'free',
    limits: { daily: 100, per_second: 5 },
    docs_url: 'https://chika-api.vercel.app/docs',
  });
}
