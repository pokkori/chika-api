import { createHash } from 'crypto';
import { getSupabase } from './supabase';
export { generateApiKey } from './crypto';

export interface AuthResult {
  valid: boolean;
  apiKeyId?: string;
  userId?: string;
  plan?: 'free' | 'basic' | 'pro' | 'enterprise';
  error?: string;
}

/**
 * リクエストヘッダーの X-API-Key を検証する。
 * APIキーはSHA-256ハッシュ化してDBと照合する（平文保存なし）。
 */
export async function verifyApiKey(apiKey: string | null): Promise<AuthResult> {
  if (!apiKey) {
    return { valid: false, error: 'APIキーが必要です。X-API-Keyヘッダーを設定してください。' };
  }

  if (!apiKey.startsWith('auction_')) {
    return { valid: false, error: 'APIキーの形式が不正です。競売物件データAPIのAPIキーは"auction_"で始まります。' };
  }

  // Supabase未設定の場合はモックレスポンスを返す（開発環境向け）
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      valid: true,
      apiKeyId: 'mock-api-key-id',
      userId: 'mock-user-id',
      plan: 'free',
    };
  }

  const hashed = createHash('sha256').update(apiKey).digest('hex');

  const { data, error } = await getSupabase()
    .from('api_keys')
    .select('id, user_id, plan, is_active, expires_at')
    .eq('key', hashed)
    .single();

  if (error || !data) {
    return { valid: false, error: '無効なAPIキーです。ダッシュボードで確認してください: https://auction-property-api.vercel.app/dashboard' };
  }
  if (!data.is_active) {
    return { valid: false, error: 'このAPIキーは無効化されています。' };
  }
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'APIキーの有効期限が切れています。プランを更新してください。' };
  }

  return {
    valid: true,
    apiKeyId: data.id,
    userId: data.user_id,
    plan: data.plan,
  };
}
