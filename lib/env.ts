import { z } from "zod";
const schema=z.object({DATABASE_URL:z.string().url().optional(),D365_BASE_URL:z.string().url().optional(),D365_TENANT_ID:z.string().optional(),D365_CLIENT_ID:z.string().optional(),D365_CLIENT_SECRET:z.string().optional(),D365_RESOURCE:z.string().url().optional()});
export const env=schema.parse(process.env);
