import { NextRequest, NextResponse } from 'next/server';
import { verifyApiKey } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const apiKey = req.headers.get('x-api-key');
  const auth = await verifyApiKey(apiKey);

  if (!auth.valid) {
    return NextResponse.json({ error: auth.error, code: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await getSupabase()
    .from('auction_properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '物件が見つかりません', code: 'NOT_FOUND' }, { status: 404 });
  }

  // raw_htmlは返却しない（内部用）
  const { raw_html: _raw, ...publicData } = data as Record<string, unknown>;

  return NextResponse.json(publicData, { headers: { 'Cache-Control': 'public, max-age=3600' } });
}
