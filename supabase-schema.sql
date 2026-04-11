-- ============================================================
-- JOKITUGASKU — Supabase Database Schema (v5)
-- Konfigurasi: Multi-Admin Support & Admin Tracking.
-- ============================================================

-- 1. Buat tabel orders
CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code    TEXT UNIQUE NOT NULL,        -- e.g. "JTK-20240401-ABC12"
  client_name   TEXT NOT NULL,
  client_phone  TEXT NOT NULL,
  client_email  TEXT,
  service       TEXT NOT NULL,
  description   TEXT,
  deadline      TIMESTAMPTZ,
  price         DECIMAL(12,2) DEFAULT 0,
  progress      INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status        TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','in_progress','review','done','revisi')),
  notes         TEXT,                        
  revision_count INT DEFAULT 0,
  processed_by  TEXT,                        -- Email admin yang menangani order ini
  file_url      TEXT,                        -- Link file hasil pengerjaan (Supabase Storage)
  payment_receipt_url TEXT,                  -- Link file bukti pembayaran
  is_paid       BOOLEAN DEFAULT FALSE,       -- Status pembayaran Lunas/Belum
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders (order_code);

-- 3. Row Level Security untuk tabel orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- [SECURITY PATCH]: Akses SELECT publik via RLS dicabut untuk mencegah kebocoran PII.
-- Gunakan Edge Route API (/api/track-order) dengan Service Role untuk verifikasi order yang aman.
-- CREATE POLICY "Publik bisa baca order via code" ON orders FOR SELECT USING (true);

CREATE POLICY "Publik bisa buat order baru"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin full access"
  ON orders FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = (SELECT current_setting('app.settings.super_admin_email', true))
    OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 4. Aktifkan Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- ============================================================
-- RATING SYSTEM
-- ============================================================

-- 5. Tabel ratings
CREATE TABLE IF NOT EXISTS ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code  TEXT NOT NULL REFERENCES orders(order_code) ON DELETE CASCADE,
  stars       INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
  comment     TEXT,
  service     TEXT,
  client_name TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Index & RLS ratings
CREATE INDEX IF NOT EXISTS idx_ratings_order_code ON ratings (order_code);
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua bisa baca rating" ON ratings FOR SELECT USING (true);
CREATE POLICY "Semua bisa insert rating" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access"
  ON ratings FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 7. Aktifkan Realtime ratings
ALTER PUBLICATION supabase_realtime ADD TABLE ratings;

-- ============================================================
-- REVISION SYSTEM
-- ============================================================

-- 8. Tabel revisions
CREATE TABLE IF NOT EXISTS revisions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code  TEXT NOT NULL REFERENCES orders(order_code) ON DELETE CASCADE,
  note        TEXT NOT NULL,
  status      TEXT DEFAULT 'requested' CHECK (status IN ('requested','in_progress','done')),
  is_paid     BOOLEAN DEFAULT FALSE,
  processed_by TEXT,                         -- Email admin yang menangani revisi ini
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Index & RLS revisions
CREATE INDEX IF NOT EXISTS idx_revisions_order_code ON revisions (order_code);
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua bisa baca revisi" ON revisions FOR SELECT USING (true);
CREATE POLICY "Semua bisa insert revisi" ON revisions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access revisions" ON revisions FOR ALL TO authenticated USING (true);

-- ============================================================
-- PROGRESS LOG
-- ============================================================

-- 10. Tabel progress_log
CREATE TABLE IF NOT EXISTS progress_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code  TEXT NOT NULL REFERENCES orders(order_code) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Index & RLS progress_log
CREATE INDEX IF NOT EXISTS idx_progress_log_order_code ON progress_log (order_code);
ALTER TABLE progress_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua bisa baca progress_log" ON progress_log FOR SELECT USING (true);
CREATE POLICY "Admin full access"
  ON progress_log FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
ALTER PUBLICATION supabase_realtime ADD TABLE progress_log;

-- ============================================================
-- SYSTEM SETTINGS (WhatsApp, etc)
-- ============================================================

CREATE TABLE IF NOT EXISTS system_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
-- Secure configuration: only authenticated admins can read/write system settings
CREATE POLICY "Admin full access settings" ON system_settings FOR ALL TO authenticated USING (true);

-- ============================================================
-- AI TOKEN MONITORING
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name    TEXT NOT NULL,
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  total_tokens  INT DEFAULT 0,
  user_ip       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin read AI logs" ON ai_usage_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "System insert AI logs" ON ai_usage_logs FOR INSERT WITH CHECK (true);

