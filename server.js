require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const D365_BASE_URL = (process.env.D365_BASE_URL || "").replace(/\/+$/, "");
const TENANT_ID = process.env.D365_TENANT_ID || "";
const CLIENT_ID = process.env.D365_CLIENT_ID || "";
const CLIENT_SECRET = process.env.D365_CLIENT_SECRET || "";
const D365_RESOURCE = (process.env.D365_RESOURCE || D365_BASE_URL).replace(/\/+$/, "");

if (!D365_BASE_URL || !TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
  console.warn("D365_BASE_URL, D365_TENANT_ID, D365_CLIENT_ID and D365_CLIENT_SECRET must be configured in .env");
}

app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

let cachedToken = null;

async function getToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.accessToken;
  }

  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(TENANT_ID)}/oauth2/v2.0/token`;
  const scope = `${D365_RESOURCE}/.default`;
  
  console.log("Token request details:");
  console.log("  Tenant ID:", TENANT_ID);
  console.log("  Client ID:", CLIENT_ID);
  console.log("  Resource URL:", D365_RESOURCE);
  console.log("  Scope:", scope);
  
  const form = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: scope
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form
  });

  const text = await response.text();
  if (!response.ok) {
    console.error("Token request failed - Response:", text);
    throw new Error(`Microsoft Entra token request failed (${response.status}): ${text}`);
  }

  const token = JSON.parse(text);
  cachedToken = {
    accessToken: token.access_token,
    expiresAt: Date.now() + (Number(token.expires_in || 3600) * 1000)
  };
  return cachedToken.accessToken;
}

function buildD365Url(input) {
  if (!input) throw new Error("A D365 URL or relative OData path is required.");

  let target;
  if (/^https?:\/\//i.test(input)) {
    target = new URL(input);
  } else {
    target = new URL(input.replace(/^\/+/, ""), `${D365_BASE_URL}/`);
  }

  const base = new URL(`${D365_BASE_URL}/`);
  if (target.origin !== base.origin) {
    throw new Error("For security, the API Explorer can only call the configured D365_BASE_URL.");
  }

  return target.toString();
}

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    d365Configured: Boolean(D365_BASE_URL && TENANT_ID && CLIENT_ID && CLIENT_SECRET),
    baseUrl: D365_BASE_URL || null
  });
});

app.get("/api/token", async (req, res) => {
  try {
    const token = await getToken();
    res.json({
      success: true,
      token: token,
      message: "Token retrieved successfully"
    });
  } catch (error) {
    console.error("Token fetch error:", error);
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

app.post("/api/request", async (req, res) => {
  try {
    const method = String(req.body.method || "GET").toUpperCase();
    const url = buildD365Url(req.body.url);
    const allowed = ["GET", "POST", "PATCH", "PUT", "DELETE"];
    if (!allowed.includes(method)) return res.status(400).json({ error: "Unsupported HTTP method." });

    const token = await getToken();

    const headers = {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    };

    if (req.body.company) {
      headers["X-D365-Company"] = req.body.company;
    }

    const options = { method, headers };
    if (!["GET", "DELETE"].includes(method) && req.body.body !== undefined && req.body.body !== "") {
      options.body = typeof req.body.body === "string"
        ? req.body.body
        : JSON.stringify(req.body.body);
    }

    let response = await fetch(url, options);

    // Retry once with a fresh token if D365 reports an expired/invalid token.
    if (response.status === 401) {
      cachedToken = null;
      headers.Authorization = `Bearer ${await getToken()}`;
      response = await fetch(url, options);
    }

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    let data = text;
    if (contentType.includes("json") || text.trim().startsWith("{") || text.trim().startsWith("[")) {
      try { data = JSON.parse(text); } catch (_) {}
    }

    res.status(response.status).json({
      status: response.status,
      statusText: response.statusText,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`FinSight365 running on http://localhost:${PORT}`);
});
