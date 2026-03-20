-- ============================================
-- India Village Image Collection MVP
-- Database Setup Script
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  gps_lat DOUBLE PRECISION,
  gps_lng DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_state ON submissions(state);
CREATE INDEX IF NOT EXISTS idx_submissions_district ON submissions(district);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow anyone to INSERT (contributors don't need auth)
CREATE POLICY "Allow public insert" ON submissions
  FOR INSERT
  WITH CHECK (true);

-- 5. Policy: Allow anyone to SELECT (admin auth handled at API layer)
CREATE POLICY "Allow public select" ON submissions
  FOR SELECT
  USING (true);

-- 6. Policy: Allow anyone to UPDATE (admin auth handled at API layer)
CREATE POLICY "Allow public update" ON submissions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 7. Create storage bucket for submission images
INSERT INTO storage.buckets (id, name, public)
VALUES ('submission-images', 'submission-images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage policy: Allow public uploads
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'submission-images');

-- 9. Storage policy: Allow public reads
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'submission-images');
