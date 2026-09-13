CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL, password_hash text NOT NULL, totp_secret text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sessions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS audit_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id), action text NOT NULL, metadata jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS datasets (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text UNIQUE NOT NULL, entity_name text NOT NULL, fields jsonb NOT NULL DEFAULT '[]', company text, status text NOT NULL DEFAULT 'draft', last_sync_at timestamptz);
CREATE TABLE IF NOT EXISTS sync_runs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), dataset_id uuid REFERENCES datasets(id), status text NOT NULL, rows_synced integer NOT NULL DEFAULT 0, started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz, error text);
CREATE TABLE IF NOT EXISTS reports (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, dataset_id uuid REFERENCES datasets(id), definition jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS dashboards (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, layout jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS dataset_rows (dataset_id uuid REFERENCES datasets(id) ON DELETE CASCADE, row_data jsonb NOT NULL, synced_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS dataset_rows_dataset_idx ON dataset_rows(dataset_id);

-- The application connects directly with a server-only database URL. Prevent
-- Supabase Data API roles from reading these operational tables.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_rows ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
