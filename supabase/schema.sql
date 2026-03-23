-- ChikaAPI Supabase スキーマ定義
-- Supabase SQL Editor で実行してください

-- ユーザーテーブル（api_keysのFKより先に作成）
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  komoju_customer_id TEXT,
  komoju_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- APIキーテーブル
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 使用量テーブル（1日1行）
CREATE TABLE usage_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id UUID NOT NULL REFERENCES api_keys(id),
  date DATE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(api_key_id, date)
);

-- 使用量インクリメント関数（アトミック操作）
CREATE OR REPLACE FUNCTION increment_usage(p_api_key_id UUID, p_date DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO usage_daily (api_key_id, date, request_count)
  VALUES (p_api_key_id, p_date, 1)
  ON CONFLICT (api_key_id, date)
  DO UPDATE SET request_count = usage_daily.request_count + 1;
END;
$$ LANGUAGE plpgsql;

-- レート制限確認ビュー
CREATE VIEW usage_today AS
SELECT
  ak.key_prefix,
  ak.plan,
  COALESCE(ud.request_count, 0) AS today_count,
  CASE ak.plan
    WHEN 'free'       THEN 100
    WHEN 'basic'      THEN 10000
    WHEN 'pro'        THEN 100000
    WHEN 'enterprise' THEN 99999999
  END AS daily_limit
FROM api_keys ak
LEFT JOIN usage_daily ud ON ak.id = ud.api_key_id AND ud.date = CURRENT_DATE
WHERE ak.is_active = TRUE;

-- RLS設定
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_daily ENABLE ROW LEVEL SECURITY;

-- サービスロールのみ全行アクセス可
CREATE POLICY "service_role_all" ON api_keys FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_all" ON users FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_all" ON usage_daily FOR ALL TO service_role USING (TRUE);
