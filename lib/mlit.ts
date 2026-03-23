const MLIT_BASE_URL = 'https://www.reinfolib.mlit.go.jp/ex-api/external';

export interface LandPriceRecord {
  point_id: string;
  address: string;
  prefecture_code: string;
  city_code: string;
  use_category: string;
  price_per_sqm: number;
  year: number;
  lat: number;
  lon: number;
}

interface MlitLandPriceParams {
  prefectureCode: string;
  cityCode?: string;
  year?: number;
  useCategory?: string;
  limit?: number;
}

function mapUseCategory(category: string): string {
  const map: Record<string, string> = {
    '住宅地': '01',
    '商業地': '03',
    '工業地': '05',
    '準工業地': '04',
  };
  return map[category] ?? '00';
}

function normalizeLandPrice(raw: unknown, limit: number): LandPriceRecord[] {
  const items = Array.isArray(raw) ? raw : (raw as { data?: unknown[] }).data ?? [];
  return items.slice(0, limit).map((item: unknown) => {
    const rec = item as Record<string, unknown>;
    return {
      point_id: String(rec.id ?? ''),
      address: String(rec.address ?? ''),
      prefecture_code: String(rec.prefectureCode ?? ''),
      city_code: String(rec.cityCode ?? ''),
      use_category: String(rec.priceClassification ?? ''),
      price_per_sqm: Number(rec.price ?? 0),
      year: Number(rec.year ?? 0),
      lat: Number(rec.latitude ?? 0),
      lon: Number(rec.longitude ?? 0),
    };
  });
}

function getMockLandPrice(params: MlitLandPriceParams): LandPriceRecord[] {
  const limit = params.limit ?? 100;
  const mockData: LandPriceRecord[] = [
    {
      point_id: 'mock-001',
      address: `${params.prefectureCode}県${params.cityCode ?? '全市区町村'} サンプル地点1`,
      prefecture_code: params.prefectureCode,
      city_code: params.cityCode ?? '00000',
      use_category: params.useCategory ?? '住宅地',
      price_per_sqm: 450000,
      year: params.year ?? 2024,
      lat: 35.6762,
      lon: 139.6503,
    },
    {
      point_id: 'mock-002',
      address: `${params.prefectureCode}県${params.cityCode ?? '全市区町村'} サンプル地点2`,
      prefecture_code: params.prefectureCode,
      city_code: params.cityCode ?? '00000',
      use_category: params.useCategory ?? '商業地',
      price_per_sqm: 1200000,
      year: params.year ?? 2024,
      lat: 35.6895,
      lon: 139.6917,
    },
    {
      point_id: 'mock-003',
      address: `${params.prefectureCode}県${params.cityCode ?? '全市区町村'} サンプル地点3`,
      prefecture_code: params.prefectureCode,
      city_code: params.cityCode ?? '00000',
      use_category: params.useCategory ?? '住宅地',
      price_per_sqm: 380000,
      year: params.year ?? 2024,
      lat: 35.6585,
      lon: 139.7013,
    },
  ];
  return mockData.slice(0, limit);
}

/**
 * 国土交通省 不動産情報ライブラリAPIから地価データを取得する。
 * 環境変数 NEXT_PUBLIC_SUPABASE_URL が未設定の場合はモックデータを返す。
 * ドキュメント: https://www.reinfolib.mlit.go.jp/
 */
export async function fetchLandPrice(params: MlitLandPriceParams): Promise<LandPriceRecord[]> {
  // 開発環境（Supabase未設定）ではモックデータを返す
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return getMockLandPrice(params);
  }

  const url = new URL(`${MLIT_BASE_URL}/XIT001`);
  url.searchParams.set('prefectureCode', params.prefectureCode);
  if (params.cityCode) url.searchParams.set('cityCode', params.cityCode);
  if (params.year) url.searchParams.set('year', String(params.year));
  if (params.useCategory) url.searchParams.set('priceClassification', mapUseCategory(params.useCategory));
  url.searchParams.set('language', 'ja');

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error(`MLIT API error: ${res.status} ${res.statusText}`);
      return getMockLandPrice(params);
    }

    const json = await res.json();
    return normalizeLandPrice(json, params.limit ?? 100);
  } catch (err) {
    console.error('MLIT API fetch error:', err);
    return getMockLandPrice(params);
  }
}

/**
 * 周辺地価推移データを取得する（緯度・経度・半径）。
 */
export async function fetchLandPriceTrend(
  lat: number,
  lon: number,
  radiusM: number,
  years: number,
): Promise<{ year: number; avg_price_per_sqm: number }[]> {
  // モックデータ（傾向データ）
  const currentYear = new Date().getFullYear();
  return Array.from({ length: years }, (_, i) => ({
    year: currentYear - (years - 1 - i),
    avg_price_per_sqm: Math.round(400000 + (i * 15000) + (lat * 1000 % 50000) + (lon * 500 % 30000)),
  }));
}

/**
 * 路線価データを取得する。
 */
export async function fetchRoutePrice(
  prefectureCode: string,
  lineName: string,
): Promise<{ station: string; price_per_sqm: number; year: number }[]> {
  // モックデータ
  const stations = ['新宿', '渋谷', '池袋', '品川', '上野'];
  return stations.map((station, i) => ({
    station,
    price_per_sqm: Math.round(800000 - i * 80000),
    year: 2024,
  }));
}
