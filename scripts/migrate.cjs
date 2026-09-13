const fs=require("fs");
const {Pool}=require("pg");
const sql=fs.readdirSync("db/migrations").filter(x=>x.endsWith(".sql")).sort().map(x=>fs.readFileSync(`db/migrations/${x}`,"utf8")).join("\n");
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_URL?.includes("supabase.co")?{rejectUnauthorized:false}:undefined});
pool.query(sql).then(()=>console.log("Migration 001_platform applied.")).catch(error=>{console.error("Migration failed:",error.message);process.exitCode=1}).finally(()=>pool.end());
