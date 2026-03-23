import { createHash, randomBytes } from 'crypto';

/**
 * APIキーを生成する。
 * 形式: chika_[32文字ランダム英数字]
 * 戻り値:
 *   - raw: 平文（ユーザーに1回だけ表示する）
 *   - hashed: SHA-256ハッシュ（DBに保存する）
 *   - prefix: 先頭12文字（ダッシュボードでの表示用）
 */
export function generateApiKey(): { raw: string; hashed: string; prefix: string } {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(32);
  const random = Array.from(bytes, (b) => chars[b % chars.length]).join('');
  const raw = `chika_${random}`;
  const hashed = createHash('sha256').update(raw).digest('hex');
  const prefix = raw.slice(0, 12); // "chika_XXXXXX"
  return { raw, hashed, prefix };
}

/**
 * APIキーをSHA-256でハッシュ化する。
 */
export function hashApiKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}
