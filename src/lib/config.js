
export function getApiBaseUrl() {
  const base =
    process.env.LANDRUP_API_BASE_URL ||
    process.env.NEXT_PUBLIC_LANDRUP_API_BASE_URL ||
    "http://localhost:4000";

  return String(base).replace(/\/+$/, "");
}