import { NextResponse } from "next/server"; import { env } from "../../../lib/env";
export async function GET(){return NextResponse.json({ok:true,d365Configured:Boolean(env.D365_BASE_URL&&env.D365_TENANT_ID&&env.D365_CLIENT_ID&&env.D365_CLIENT_SECRET),databaseConfigured:Boolean(env.DATABASE_URL)})}
