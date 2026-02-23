import { NextResponse } from "next/server";

const COOKIE_TOKEN = "ld_token";

function decodeJwtExpMs(token) {
  try {
    const parts = String(token || "").split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
    const json = JSON.parse(atob(b64 + pad));
    return json?.exp ? Number(json.exp) * 1000 : null;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const expMs = decodeJwtExpMs(token);
  if (expMs && Date.now() > expMs) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/activities/:path*", "/profile/:path*", "/calendar/:path*"],
};