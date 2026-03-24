import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const { company, contact, email, phone, plan, note } = body;
  if (!company || !contact || !email || !plan) {
    return NextResponse.json({ message: '必須項目が不足しています。' }, { status: 400 });
  }

  // メール形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: 'メールアドレスの形式が正しくありません。' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Supabase未設定時はフォールバック案内
    return NextResponse.json(
      {
        message: 'Supabase未設定',
        fallback_email: 'info@auction-property-api.vercel.app',
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/invoice_requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        company_name: company,
        contact_name: contact,
        email,
        phone: phone || null,
        plan,
        note: note || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[invoice] Supabase error:', res.status, errText);
      return NextResponse.json(
        {
          message: 'データベースへの保存に失敗しました。',
          fallback_email: 'info@auction-property-api.vercel.app',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[invoice] fetch error:', err);
    return NextResponse.json(
      {
        message: 'サーバーエラーが発生しました。',
        fallback_email: 'info@auction-property-api.vercel.app',
      },
      { status: 503 }
    );
  }
}
