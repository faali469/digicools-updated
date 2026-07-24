export type IntegrationDef = {
  id: string;
  name: string;
  category: string;
  description: string;
  // "available" — really works today (points at a real page in this app).
  // "requires_credentials" — real integration, but needs the org's own API
  // keys/OAuth app/license before it can do anything; there is nothing to
  // fake here without those.
  // "coming_soon" — not built yet, no external dependency to blame.
  kind: "available" | "requires_credentials" | "coming_soon";
  href?: string;
  requires?: string;
};

export const INTEGRATION_CATALOG: { category: string; items: IntegrationDef[] }[] = [
  {
    category: "Scheduling & Planning",
    items: [
      { id: "p6-xer", name: "Primavera P6 (.XER)", category: "Scheduling & Planning", description: "Upload and parse P6 schedule exports.", kind: "available", href: "/imports" },
      { id: "opc", name: "Oracle Primavera Cloud", category: "Scheduling & Planning", description: "Sync schedules directly from OPC.", kind: "requires_credentials", requires: "Oracle Primavera Cloud API credentials" },
      { id: "mpp", name: "Microsoft Project (.MPP / XML)", category: "Scheduling & Planning", description: "Upload and parse MS Project files.", kind: "available", href: "/imports" },
      { id: "excel-csv", name: "Excel / CSV / XML", category: "Scheduling & Planning", description: "Generic schedule and data import.", kind: "available", href: "/imports" },
    ],
  },
  {
    category: "BI & Analytics",
    items: [
      { id: "powerbi-embedded", name: "Power BI Embedded", category: "BI & Analytics", description: "Embed live Power BI reports in dashboards.", kind: "requires_credentials", requires: "Azure Power BI Embedded workspace + capacity" },
      { id: "powerbi-rest", name: "Power BI REST API", category: "BI & Analytics", description: "Push datasets to Power BI programmatically.", kind: "requires_credentials", requires: "Power BI service principal credentials" },
      { id: "powerbi-directquery", name: "Power BI DirectQuery / Import", category: "BI & Analytics", description: "Expose semantic models for live or imported queries.", kind: "requires_credentials", requires: "Power BI Premium/PPU capacity" },
    ],
  },
  {
    category: "Construction Platforms",
    items: [
      { id: "acc", name: "Autodesk Construction Cloud", category: "Construction Platforms", description: "Sync documents, models and issues.", kind: "requires_credentials", requires: "Autodesk Platform Services app credentials" },
      { id: "bim360", name: "Autodesk BIM 360", category: "Construction Platforms", description: "Sync project data and models.", kind: "requires_credentials", requires: "Autodesk BIM 360 API credentials" },
      { id: "procore", name: "Procore", category: "Construction Platforms", description: "Two-way sync of projects and RFIs.", kind: "requires_credentials", requires: "Procore OAuth app credentials" },
    ],
  },
  {
    category: "ERP & Finance",
    items: [
      { id: "sap", name: "SAP S/4HANA", category: "ERP & Finance", description: "Sync cost codes, POs and financials.", kind: "requires_credentials", requires: "SAP OData/API credentials" },
      { id: "oracle-erp", name: "Oracle ERP Cloud", category: "ERP & Finance", description: "Sync procurement and finance data.", kind: "requires_credentials", requires: "Oracle ERP Cloud API credentials" },
    ],
  },
  {
    category: "Productivity & Storage",
    items: [
      { id: "sharepoint", name: "SharePoint", category: "Productivity & Storage", description: "Document control and file sync.", kind: "requires_credentials", requires: "Microsoft Entra ID app registration" },
      { id: "onedrive", name: "OneDrive", category: "Productivity & Storage", description: "File storage sync.", kind: "requires_credentials", requires: "Microsoft Entra ID app registration" },
      { id: "gdrive", name: "Google Drive", category: "Productivity & Storage", description: "File storage sync.", kind: "requires_credentials", requires: "Google Cloud OAuth client" },
      { id: "teams", name: "Microsoft Teams", category: "Productivity & Storage", description: "Notifications and approvals in Teams.", kind: "requires_credentials", requires: "Microsoft Teams app + bot registration" },
      { id: "slack", name: "Slack", category: "Productivity & Storage", description: "Notifications and approvals in Slack.", kind: "requires_credentials", requires: "Slack app OAuth credentials" },
      { id: "outlook", name: "Outlook", category: "Productivity & Storage", description: "Email-based report distribution.", kind: "requires_credentials", requires: "Microsoft Graph API credentials" },
    ],
  },
  {
    category: "Identity & Security",
    items: [
      { id: "entra-id", name: "Microsoft Entra ID (Azure AD)", category: "Identity & Security", description: "Single sign-on for your organization.", kind: "requires_credentials", requires: "Entra ID app registration + tenant admin consent" },
      { id: "saml", name: "SAML 2.0 SSO", category: "Identity & Security", description: "Enterprise single sign-on.", kind: "requires_credentials", requires: "Identity provider SAML metadata" },
      { id: "oidc", name: "OpenID Connect", category: "Identity & Security", description: "Standards-based SSO.", kind: "requires_credentials", requires: "OIDC provider client credentials" },
    ],
  },
  {
    category: "Developer",
    items: [
      { id: "rest-api", name: "REST API", category: "Developer", description: "Programmatic access to your data.", kind: "coming_soon" },
      { id: "graphql-api", name: "GraphQL API", category: "Developer", description: "Query your data with GraphQL.", kind: "coming_soon" },
      { id: "webhooks", name: "Webhooks", category: "Developer", description: "Real-time event notifications.", kind: "coming_soon" },
    ],
  },
];
