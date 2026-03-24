import { generateApiKey, verifyApiKey } from '@/lib/auth';
import { createHash } from 'crypto';

// Supabaseをモック
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    }),
  }),
}));

describe('generateApiKey', () => {
  it('auction_プレフィックスで始まる32文字のランダム部を持つキーを生成する', () => {
    const { raw, hashed, prefix } = generateApiKey();
    expect(raw).toMatch(/^auction_[A-Za-z0-9]{32}$/);
    expect(hashed).toBe(createHash('sha256').update(raw).digest('hex'));
    expect(prefix).toBe(raw.slice(0, 14));
  });

  it('hashed は64文字のSHA-256ハッシュである', () => {
    const { hashed } = generateApiKey();
    expect(hashed).toHaveLength(64);
    expect(hashed).toMatch(/^[0-9a-f]+$/);
  });

  it('連続生成で同じキーにならない', () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a.raw).not.toBe(b.raw);
    expect(a.hashed).not.toBe(b.hashed);
  });

  it('prefix は raw の先頭14文字である', () => {
    const { raw, prefix } = generateApiKey();
    expect(prefix).toBe(raw.slice(0, 14));
    expect(prefix.startsWith('auction_')).toBe(true);
  });
});

describe('verifyApiKey', () => {
  it('nullのAPIキーでエラーを返す', async () => {
    const result = await verifyApiKey(null);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('APIキーが必要です');
  });

  it('auction_で始まらないキーでエラーを返す', async () => {
    const result = await verifyApiKey('sk_invalid_key');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('形式が不正');
  });

  it('chika_プレフィックスのキーでエラーを返す', async () => {
    const result = await verifyApiKey('chika_invalidkey12345678901234567890');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('形式が不正');
  });

  it('空文字列のAPIキーでエラーを返す', async () => {
    const result = await verifyApiKey('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('APIキーが必要です');
  });

  it('auction_プレフィックスで始まるキーはSupabase未設定時にモック成功を返す', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const result = await verifyApiKey('auction_validkey1234567890123456');
    expect(result.valid).toBe(true);
    expect(result.plan).toBe('free');
  });
});
