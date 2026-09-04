CREATE INDEX IF NOT EXISTS reports_user_ip_hash_created_at_idx
  ON public.reports (user_ip_hash, created_at);
