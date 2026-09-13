# FinSight365

A small Postman-style web application for Dynamics 365 Finance & Operations OData.

## What it solves

The browser previously failed with `Failed to fetch` because a direct browser-to-D365 request can be blocked by CORS.

This version uses:

Browser → Node.js proxy → D365 FO

The browser never needs to hold the D365 client secret.

Microsoft documents that F&O OData services support OAuth 2.0 and service-to-service client credentials. The external application also needs to be registered in F&O under System administration > Setup > Microsoft Entra applications and mapped to an appropriate F&O user/security context.

## Requirements

- Node.js 20+
- A Microsoft Entra app registration
- The application/client ID provisioned in D365 F&O
- Appropriate D365 security permissions
- Client secret

## Setup

1. Extract this folder.
2. Open a terminal in the folder.
3. Run:

   npm install

4. Copy `.env.example` to `.env`.
5. Fill in:

   D365_BASE_URL
   D365_TENANT_ID
   D365_CLIENT_ID
   D365_CLIENT_SECRET

6. Start:

   npm start

7. Open:

   http://localhost:3000

## Example request

Use:

GET

/data/LandedCostPurchaseLines?$filter=ShipId%20eq%20%27000259%27

or the full URL:

https://pgb-uat.sandbox.operations.eu.dynamics.com/data/LandedCostPurchaseLines?$filter=ShipId%20eq%20%27000259%27

The server restricts requests to D365_BASE_URL to avoid turning this into an unrestricted proxy.

## POST example

Method:

POST

URL:

/data/<your-journal-header-entity>

Body:

{
  "JournalNameId": "ITRF",
  "Description": "Test transfer journal"
}

The exact entity and fields depend on the public OData entity exposed by your D365 environment.

## Security notes

- Never commit `.env` to Git.
- Never put the client secret in `public/index.html`.
- Use a dedicated D365 service account with only the required roles/privileges.
- Do not expose this proxy publicly without adding authentication/authorization.
- For production, put it behind HTTPS and an authenticated reverse proxy.

## Useful next steps

The app can later be extended with saved Postman-like collections, environment variables, request chaining, D365 entity metadata lookup, journal creation workflows, and automatic Voyage → Container → Purchase Order queries.
