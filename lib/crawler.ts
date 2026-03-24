import * as cheerio from 'cheerio';
import { getSupabase } from './supabase';

const BIT_SIKKOU_BASE = 'https://bit.sikkou.jp';
const USER_AGENT = 'AuctionPropertyAPI-Bot/1.0 (https://auction-property-api.vercel.app; info@auction-property-api.vercel.app)';
const REQUEST_DELAY_MS = 10000; // 10秒インターバル（robots.txt準拠）

export interface AuctionProperty {
  id: string;
  court: string;
  case_number: string;
  property_type: 'land' | 'building' | 'apartment' | 'farm';
  address: string;
  building_name: string | null;
  area_sqm: number | null;
  floor: number | null;
  total_floors: number | null;
  base_price: number;
  auction_start_date: string | null;
  auction_end_date: string | null;
  status: 'open' | 'sold' | 'cancelled';
  court_url: string;
  lat: number | null;
  lon: number | null;
  description: string | null;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRespect(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

export async function crawlAuctions(): Promise<{ found: number; new_count: number; updated: number }> {
  const supabase = getSupabase();
  let found = 0;
  let new_count = 0;
  let updated = 0;

  // bit.sikkou.jp の検索結果ページをクロール（全都道府県・1ページ目のみ）
  const prefectureCodes = Array.from({ length: 47 }, (_, i) => String(i + 1).padStart(2, '0'));

  for (const prefCode of prefectureCodes) {
    const searchUrl = `${BIT_SIKKOU_BASE}/app/case/pt001/h001/InformationCaseListAction.do?siteType=01&execFlg=1&prefCode=${prefCode}`;
    try {
      const html = await fetchWithRespect(searchUrl);
      const properties = parseAuctionListPage(html, prefCode);
      found += properties.length;

      for (const prop of properties) {
        const { data: existing } = await supabase
          .from('auction_properties')
          .select('id, status')
          .eq('id', prop.id)
          .single();

        if (!existing) {
          await supabase.from('auction_properties').insert(prop);
          new_count++;
        } else if (existing.status !== prop.status) {
          await supabase.from('auction_properties').update({ status: prop.status, updated_at: new Date().toISOString() }).eq('id', prop.id);
          updated++;
        }
      }
    } catch (err) {
      console.error(`Crawler error for pref ${prefCode}:`, err);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  return { found, new_count, updated };
}

export function parseAuctionListPage(html: string, prefCode: string): AuctionProperty[] {
  const $ = cheerio.load(html);
  const properties: AuctionProperty[] = [];

  // bit.sikkou.jp の物件リストテーブルを解析
  $('table.caseList tr').each((_, row) => {
    const cells = $(row).find('td');
    if (cells.length < 5) return;

    const caseNumber = $(cells[0]).text().trim();
    const court = $(cells[1]).text().trim();
    const address = $(cells[2]).text().trim();
    const priceText = $(cells[3]).text().replace(/[^0-9]/g, '');
    const endDateText = $(cells[4]).text().trim();
    const linkHref = $(cells[0]).find('a').attr('href') ?? '';

    if (!caseNumber || !address || !priceText) return;

    const id = `court_${prefCode}_${caseNumber.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const basePrice = parseInt(priceText, 10);
    if (isNaN(basePrice) || basePrice === 0) return;

    properties.push({
      id,
      court: court || `都道府県${prefCode}地方裁判所`,
      case_number: caseNumber,
      property_type: detectPropertyType(address),
      address,
      building_name: null,
      area_sqm: null,
      floor: null,
      total_floors: null,
      base_price: basePrice,
      auction_start_date: null,
      auction_end_date: endDateText || null,
      status: 'open',
      court_url: linkHref.startsWith('http') ? linkHref : `${BIT_SIKKOU_BASE}${linkHref}`,
      lat: null,
      lon: null,
      description: null,
    });
  });

  return properties;
}

export function detectPropertyType(address: string): 'land' | 'building' | 'apartment' | 'farm' {
  if (/号室|マンション|アパート|棟/.test(address)) return 'apartment';
  if (/建物|戸建|一軒家/.test(address)) return 'building';
  if (/田|畑|農地|山林/.test(address)) return 'farm';
  return 'land';
}
