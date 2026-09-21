-- =========================================================
-- VAMXBOTZ SUPABASE SCHEMA
-- Jalankan query ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =========================================================

-- 1. Tabel Bot Status (Untuk live status & uptime di website docs)
CREATE TABLE IF NOT EXISTS bot_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_name TEXT NOT NULL DEFAULT 'vamzbot',
  version TEXT NOT NULL DEFAULT '1.2.0',
  is_online BOOLEAN NOT NULL DEFAULT true,
  mode TEXT NOT NULL DEFAULT 'Public', -- 'Public' / 'Self'
  total_users INT DEFAULT 0,
  total_groups INT DEFAULT 0,
  total_hits INT DEFAULT 0,
  uptime_seconds BIGINT DEFAULT 0,
  last_ping TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert row default jika belum ada
INSERT INTO bot_status (bot_name, version, is_online, mode, total_users, total_groups, total_hits)
SELECT 'vamzbot', '1.2.0', true, 'Public', 1420, 89, 45210
WHERE NOT EXISTS (SELECT 1 FROM bot_status LIMIT 1);

-- 2. Tabel Feedback & Permintaan Fitur dari pengunjung website
CREATE TABLE IF NOT EXISTS bot_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone_or_telegram TEXT,
  category TEXT NOT NULL DEFAULT 'Fitur Baru', -- 'Bug', 'Fitur Baru', 'Pertanyaan', 'Sewa Bot'
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_reviewed BOOLEAN DEFAULT false
);

-- 3. Tabel Command Logs (Opsional: Bot dapat mencatat eksekusi command ke sini)
CREATE TABLE IF NOT EXISTS command_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  command_name TEXT NOT NULL,
  sender_number TEXT,
  group_id TEXT,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE bot_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE command_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read status
CREATE POLICY "Allow public read bot_status"
  ON bot_status FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public insert feedback
CREATE POLICY "Allow public insert bot_feedback"
  ON bot_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow public read aggregate command_logs
CREATE POLICY "Allow public read command_logs"
  ON command_logs FOR SELECT
  TO anon, authenticated
  USING (true);
