import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { crawlAuctions } from '@/lib/crawler';

// Vercel Cronからのみ呼び出し可能
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();

  // クローラーログ開始
  const { data: logEntry } = await supabase.from('crawler_logs').insert({
    source: 'bit_sikkou',
    status: 'running',
  }).select('id').single();

  const logId = logEntry?.id;

  try {
    const result = await crawlAuctions();

    await supabase.from('crawler_logs').update({
      finished_at: new Date().toISOString(),
      items_found: result.found,
      items_new: result.new_count,
      items_updated: result.updated,
      status: 'success',
    }).eq('id', logId);

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    await supabase.from('crawler_logs').update({
      finished_at: new Date().toISOString(),
      error_message: message,
      status: 'failed',
    }).eq('id', logId);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
