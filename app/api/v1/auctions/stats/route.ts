import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// 認証不要・全プランで利用可能・デモ訴求用
export async function GET() {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('auction_properties')
    .select('property_type, status')
    .eq('status', 'open');

  if (error) {
    return NextResponse.json({ error: 'DB_ERROR' }, { status: 500 });
  }

  const stats = (data ?? []).reduce((acc, row) => {
    acc[row.property_type] = (acc[row.property_type] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return NextResponse.json(
    { total_open: total, by_type: stats, updated_at: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, max-age=3600' } }
  );
}
