import { NextRequest,NextResponse } from "next/server";import { d365 } from "../../../lib/d365";
export async function POST(r:NextRequest){try{const {path,company}=await r.json();return NextResponse.json(await d365(path,company))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Request failed"},{status:400})}}
