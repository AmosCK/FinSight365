# Supabase setup

1. Create a Supabase project near your users and D365 environment.
2. In **Connect**, copy the direct PostgreSQL URI into `DATABASE_URL` in `.env`.
3. Run `db/migrations/001_platform.sql` in the Supabase SQL Editor.
4. Set a long random `SESSION_SECRET` before starting FinSight365.

Use the direct connection for migrations and the Supavisor pooler URI for application traffic if your plan recommends it. Never expose database URLs, the D365 secret, or a Supabase service-role key to browser code.
