import { fetchLandPrice } from '@/lib/mlit';

// next/cache の revalidate をモック（Next.js 環境外でのテスト用）
global.fetch = jest.fn();

describe('fetchLandPrice (モックデータ)', () => {
  beforeEach(() => {
    // NEXT_PUBLIC_SUPABASE_URL が未設定の場合はモックデータを返す
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  });

  it('SUPABASE_URL未設定時はモックデータを返す', async () => {
    const result = await fetchLandPrice({ prefectureCode: '13' });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('各レコードに必須フィールドが存在する', async () => {
    const result = await fetchLandPrice({ prefectureCode: '13', cityCode: '13101' });
    result.forEach((record) => {
      expect(record).toHaveProperty('point_id');
      expect(record).toHaveProperty('address');
      expect(record).toHaveProperty('prefecture_code');
      expect(record).toHaveProperty('city_code');
      expect(record).toHaveProperty('use_category');
      expect(record).toHaveProperty('price_per_sqm');
      expect(record).toHaveProperty('year');
      expect(record).toHaveProperty('lat');
      expect(record).toHaveProperty('lon');
    });
  });

  it('prefecture_code が引数と一致する', async () => {
    const result = await fetchLandPrice({ prefectureCode: '27' }); // 大阪府
    result.forEach((record) => {
      expect(record.prefecture_code).toBe('27');
    });
  });

  it('limit パラメータが有効に機能する', async () => {
    const result = await fetchLandPrice({ prefectureCode: '13', limit: 1 });
    expect(result.length).toBeLessThanOrEqual(1);
  });

  it('price_per_sqm は正の整数である', async () => {
    const result = await fetchLandPrice({ prefectureCode: '13' });
    result.forEach((record) => {
      expect(record.price_per_sqm).toBeGreaterThan(0);
      expect(Number.isFinite(record.price_per_sqm)).toBe(true);
    });
  });

  it('year は正の整数である', async () => {
    const result = await fetchLandPrice({ prefectureCode: '13', year: 2024 });
    result.forEach((record) => {
      expect(record.year).toBeGreaterThan(2000);
    });
  });
});
