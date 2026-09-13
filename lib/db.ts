import { Pool } from "pg"; import { env } from "./env";
// Supabase requires TLS for hosted PostgreSQL. All reporting access stays server-side.
export const db=env.DATABASE_URL?new Pool({connectionString:env.DATABASE_URL,ssl:env.DATABASE_URL.includes("supabase.co")?{rejectUnauthorized:false}:undefined}):undefined;
export function requireDb(){if(!db)throw new Error("DATABASE_URL is required for reporting features");return db}
