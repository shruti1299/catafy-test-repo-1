import { PLANS } from "@/constant/plans";

export const API_ENDPOINTS = {
  // public apis
  LOGIN: "login",
  SEND_OTP: "send-otp",
  VERIFY_PHONE: "verify-phone",
  REGISTER: "register",
  LOGOUT: "logout",
  FORGET_PASSWORD: "forgot-password",
  RESET_PASSWORD: "reset-password",

  ATTRIBUTES : "attributes",
  PLANS : "plans",
  PLAN_USAGES : "plan-usages",

  //Payment
  CREATE_SUBSCRIPTION:"create-subscription",
  RECORD_PAYMENT:"record-payment",

  // update
  UPDATE_USERNAME: "change-username",

  //dashboard
  STATS: "dashboard",
  RECENT_ORDERS: "orders",
  ENQUIRES: "product-enquires",
  LOW_STOCKS: "products?stock=100",
  NOTIFICATIONS: "notifications",
  BANNERS: "banners",

  //upload
  UPLOAD: "upload",
  CUSTOMERS: "customers",
  DOWNLOAD_ORDER_PDF: "order-pdf",
  DOWNLOAD_CATALOG_PDF: "catalog-pdf",
  UPLOAD_PRODUCTS: "upload/multi-products",
  EXCEL_IMPORT: "upload/excel-products",
  UPDATE_EXCEL_PRODUCTS: "upload/update-products",

  // Catalog
  SECTIONS: "sections",
  CATALOGS: "catalogs",
  ALL_CATALOGS: "all-catalogs",
  PRODUCTS: "products",
  ORDERS: "orders",
  UPDATE_CATALOG_ORDER: "catalogs/update-order",
  VARIATIONS:"variations",
  CATEGORIES:"categories",
  MAP_CATEGORIES:"categories/map-categories",

  // User
  USER: "user",
  STORE_DETAIL: "store",
  STORE_B2C_SETTINGS: "store/b2c-settings",
  STORE_COMPANY: "store/company",
  STORE_PAGES: "pages",
  STORE_WATERMARK:"watermark-settings",
  WATERMARK_PREVIEW:"watermark-preview",
  STORE_SEO: 'seo',
  STORE_TEAM: 'team',
  STORE_CHECKOUT: '/store/checkout-settings',

  //Settings
  THEMES: "themes",
  PO_UPDATE:"po-setting",

  //REPORTS
  REPORTS: "reports",

  //Stats
  ORDER_STATS: "stats/orders",
  CUSTOMER_STATS: "stats/customers",
  TOP_PRODUCTS: "stats/top-products",

  //shared-links
  SHARED_LINKS: "shared-links",

   // WHATSAPP MODULE
  WHATSAPP: "whatsapp",
  SHIPROCKET: "shiprocket",

  // Invoice
  DOWNLOAD_INVOICE: "invoice",
  INVOICE_CONFIG: "invoice-config",
  INVOICE_CONFIG_PREVIEW: "invoice-config/preview",

  // Order item & fee updates
  ORDER_ITEMS: "orders",   // orders/{id}/items
  ORDER_FEES:  "orders",   // orders/{id}/fees
};
