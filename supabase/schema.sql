-- 競売物件データAPI Supabase スキーマ定義
-- Supabase SQL Editor で実行してください

-- ユーザーテーブル（既存流用・変更なし）
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  komoju_customer_id TEXT,
  komoju_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- APIキーテーブル（既存流用・auction_プレフィックスに変更）
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,          -- sha256ハッシュ済み
  key_prefix TEXT NOT NULL,          -- 先頭14文字（例: "auction_ab12cd"）
  user_id UUID NOT NULL REFERENCES users(id),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- 競売物件テーブル（新規）
CREATE TABLE IF NOT EXISTS auction_properties (
  id TEXT PRIMARY KEY,               -- 例: "court_13_R6_ke_1234"
  court TEXT NOT NULL,               -- 裁判所名
  case_number TEXT NOT NULL,         -- 事件番号
  property_type TEXT NOT NULL CHECK (property_type IN ('land', 'building', 'apartment', 'farm')),
  address TEXT NOT NULL,
  building_name TEXT,
  area_sqm NUMERIC(10, 2),
  floor INTEGER,
  total_floors INTEGER,
  base_price BIGINT NOT NULL,        -- 売却基準額（円）
  auction_start_date DATE,
  auction_end_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'sold', 'cancelled')),
  court_url TEXT,
  lat NUMERIC(9, 6),
  lon NUMERIC(9, 6),
  description TEXT,
  raw_html TEXT,                     -- クローラーが取得した生HTML（デバッグ用・API非公開）
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auction_status ON auction_properties(status);
CREATE INDEX IF NOT EXISTS idx_auction_type ON auction_properties(property_type);
CREATE INDEX IF NOT EXISTS idx_auction_price ON auction_properties(base_price);
CREATE INDEX IF NOT EXISTS idx_auction_scraped ON auction_properties(scraped_at DESC);

-- クローラーログテーブル（新規）
CREATE TABLE IF NOT EXISTS crawler_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,              -- 'bit_sikkou' | 'kanpou'
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  items_found INTEGER DEFAULT 0,
  items_new INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  error_message TEXT,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed'))
);

-- Webhook登録テーブル（Proプラン以上）
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  endpoint_url TEXT NOT NULL,
  secret TEXT NOT NULL,              -- HMACシグネチャ検証用
  filter_prefecture TEXT,
  filter_property_type TEXT,
  filter_min_price BIGINT,
  filter_max_price BIGINT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 使用量テーブル（既存流用・変更なし）
CREATE TABLE IF NOT EXISTS usage_daily (
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

-- RLS設定
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE crawler_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_subscriptions ENABLE ROW LEVEL SECURITY;

-- サービスロールのみ全行アクセス可
CREATE POLICY "service_role_all" ON api_keys FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_all" ON users FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_all" ON usage_daily FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_all" ON auction_properties FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_all" ON crawler_logs FOR ALL TO service_role USING (TRUE);
CREATE POLICY "service_role_all" ON webhook_subscriptions FOR ALL TO service_role USING (TRUE);
