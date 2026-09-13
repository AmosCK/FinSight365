# FinSight365 

> **Transform raw D365 F&O operational and financial data into interactive, visual dashboards.**

FinSight365 is a custom reporting and analytics platform built to seamlessly integrate with Microsoft Dynamics 365 Finance & Operations. It empowers users to design self-service reports, build drag-and-drop visual dashboards, and stream dynamic financial insights in real time without heavy customization inside D365.

## Features

###  Seamless D365 F&O Data Pipeline
* **Native OData & Data Entity Support:** Directly consume standard or custom D365 F&O Data Entities with zero extra footprint inside D365.
* **Subledger & Ledger Sync:** Native schema mapping for General Ledger, Accounts Payable, Accounts Receivable, and Inventory Journals.
* **Real-Time & Scheduled Fetch:** Query live data on-demand or set up background sync tasks to optimize performance.

###  Interactive Visual Builder
* **Drag-and-Drop Canvas:** Intuitive layout manager to effortlessly drag, resize, and arrange visual elements.
* **Rich Component Library:** Includes bar/line charts, pie/donut charts, summary KPI cards, data grids, and sparklines.
* **Custom Color Themes:** Tailor colors to match enterprise branding or default D365 UI themes.

###  Dynamic Content & Advanced Slicing
* **Cross-Filtering & Highlighting:** Selecting data in one visual automatically filters dependent components on the dashboard.
* **Global & Page-Level Slicers:** Dynamic date pickers, legal entity (`DataAreaId`) switches, financial dimension dropdowns, and category filters.
* **Drill-Through Capabilities:** Click into high-level KPI summaries to navigate down to underlying transaction-level subledgers.

###  Enterprise Security & Governance
* **D365 Role Mapping:** Align dashboard permissions directly with D365 security roles and duties.
* **Row-Level Security (RLS):** Restrict data visibility dynamically based on user identity, company unit (`DataAreaId`), or financial dimensions.
* **Secure OAuth 2.0 Auth:** Uses Azure Active Directory (Microsoft Entra ID) app registration for enterprise-grade authentication.

###  Exporting & Collaboration
* **Multi-Format Export:** Download dashboard views and detailed reports to PDF, Excel (`.xlsx`), or CSV.
* **Shareable Live Links:** Generate role-restricted live links for seamless sharing across internal teams.
