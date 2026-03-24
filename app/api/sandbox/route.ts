import { NextRequest, NextResponse } from 'next/server';

const SANDBOX_API_KEY = 'sk_sandbox_demo_12345';
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1時間
const RATE_LIMIT_MAX = 10;

// IPベースのレート制限（メモリ内Map）
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const SAMPLE_PROPERTIES = [
  {
    id: 'sandbox_13_R6_ke_0001',
    court: '東京地方裁判所',
    case_number: '令6(ケ)第0001号',
    property_type: 'apartment',
    address: '東京都渋谷区代々木1-1-1',
    area_sqm: 65.2,
    base_price: 18500000,
    appraisal_price: 24000000,
    price_ratio: 0.771,
    floor: '5F',
    building_age_years: 12,
    auction_start_date: '2026-04-01',
    auction_end_date: '2026-04-22',
    status: 'open',
    prefecture_code: '13',
    scraped_at: '2026-03-24T09:00:00Z',
    note: 'サンドボックスデータ（架空）',
  },
  {
    id: 'sandbox_27_R6_ke_0042',
    court: '大阪地方裁判所',
    case_number: '令6(ケ)第0042号',
    property_type: 'building',
    address: '大阪府大阪市中央区本町3-5-7',
    area_sqm: 120.0,
    base_price: 8200000,
    appraisal_price: 14800000,
    price_ratio: 0.554,
    floor: 'B1〜3F',
    building_age_years: 28,
    auction_start_date: '2026-04-08',
    auction_end_date: '2026-04-29',
    status: 'open',
    prefecture_code: '27',
    scraped_at: '2026-03-24T09:00:00Z',
    note: 'サンドボックスデータ（架空）',
  },
  {
    id: 'sandbox_23_R6_ke_0078',
    court: '名古屋地方裁判所',
    case_number: '令6(ケ)第0078号',
    property_type: 'land',
    address: '愛知県名古屋市中区錦2-4-10',
    area_sqm: 82.5,
    base_price: 6300000,
    appraisal_price: 9500000,
    price_ratio: 0.663,
    floor: null,
    building_age_years: null,
    auction_start_date: '2026-04-15',
    auction_end_date: '2026-05-06',
    status: 'open',
    prefecture_code: '23',
    scraped_at: '2026-03-24T09:00:00Z',
    note: 'サンドボックスデータ（架空）',
  },
  {
    id: 'sandbox_13_R6_ke_0205',
    court: '東京地方裁判所',
    case_number: '令6(ケ)第0205号',
    property_type: 'apartment',
    address: '東京都江東区豊洲2-2-2',
    area_sqm: 78.3,
    base_price: 32000000,
    appraisal_price: 41000000,
    price_ratio: 0.780,
    floor: '12F',
    building_age_years: 5,
    auction_start_date: '2026-03-18',
    auction_end_date: '2026-04-08',
    status: 'sold',
    prefecture_code: '13',
    scraped_at: '2026-03-24T09:00:00Z',
    note: 'サンドボックスデータ（架空）',
  },
  {
    id: 'sandbox_14_R6_ke_0301',
    court: '横浜地方裁判所',
    case_number: '令6(ケ)第0301号',
    property_type: 'farm',
    address: '神奈川県横浜市緑区三保町15',
    area_sqm: 450.0,
    base_price: 1200000,
    appraisal_price: 2100000,
    price_ratio: 0.571,
    floor: null,
    building_age_years: null,
    auction_start_date: '2026-04-22',
    auction_end_date: '2026-05-13',
    status: 'open',
    prefecture_code: '14',
    scraped_at: '2026-03-24T09:00:00Z',
    note: 'サンドボックスデータ（架空）',
  },
];

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');

  if (apiKey !== SANDBOX_API_KEY) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: `サンドボックスAPIキーが必要です。X-API-Key: ${SANDBOX_API_KEY} をヘッダーに含めてください。`,
      },
      { status: 401 }
    );
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: `レート制限を超えました。1時間に${RATE_LIMIT_MAX}回まで利用可能です。`,
        reset_at: new Date(rateLimit.resetAt).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
        },
      }
    );
  }

  const { searchParams } = req.nextUrl;
  const prefecture = searchParams.get('prefecture');
  const propertyType = searchParams.get('property_type');
  const status = searchParams.get('status');

  let items = [...SAMPLE_PROPERTIES];
  if (prefecture) items = items.filter((p) => p.prefecture_code === prefecture);
  if (propertyType) items = items.filter((p) => p.property_type === propertyType);
  if (status) items = items.filter((p) => p.status === status);

  return NextResponse.json(
    {
      sandbox: true,
      note: 'このレスポンスはサンドボックス用のサンプルデータです。本番データではありません。',
      total: items.length,
      limit: 5,
      offset: 0,
      items,
      rate_limit: {
        limit: RATE_LIMIT_MAX,
        remaining: rateLimit.remaining,
        reset_at: new Date(rateLimit.resetAt).toISOString(),
      },
    },
    {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
        'Cache-Control': 'no-store',
      },
    }
  );
}
