CREATE TABLE IF NOT EXISTS sync_schedules (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), dataset_id uuid NOT NULL REFERENCES datasets(id) ON DELETE CASCADE, cron_expression text NOT NULL, enabled boolean NOT NULL DEFAULT true, last_run_at timestamptz, next_run_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE sync_schedules ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON sync_schedules FROM anon, authenticated;
