export const STORE_NAME = "Ecom Jumpstarter";

export const SUPPORT_MAIL = "support@example.com";

export const locale = "en-US";
export const currency = "$";

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.NODE_ENV === "production"
    ? "https://example.com"
    : "http://localhost:3000";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.example.com"
    : "http://localhost:5000/api/store";

export const WS_URL =
  process.env.NODE_ENV === "production"
    ? "wss://ws.excample.com"
    : "ws://localhost:5001";
