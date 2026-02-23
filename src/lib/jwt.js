function base64UrlToBase64(input) {
  const s = String(input || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (!pad) return s;
  return s + "=".repeat(4 - pad);
}

function decodeBase64(base64) {
  if (typeof window === "undefined") {
    return Buffer.from(base64, "base64").toString("utf8");
  }
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeJwtPayload(token) {
  try {
    const parts = String(token || "").split(".");
    if (parts.length < 2) return null;
    const payload = decodeBase64(base64UrlToBase64(parts[1]));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function getJwtExpMs(token) {
  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;
  if (!exp) return null;
  return Number(exp) * 1000;
}