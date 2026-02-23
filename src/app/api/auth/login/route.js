
import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/config";

function base64UrlDecode(str) {
  const s = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  return Buffer.from(s + pad, "base64").toString("utf8");
}

function decodeJwt(token) {
  const parts = String(token || "").split(".");
  if (parts.length < 2) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

export async function POST(request) {
  const base = getApiBaseUrl();

  const body = await request.json().catch(() => ({}));
  const username = String(body?.username || "").trim();
  const password = String(body?.password || "");
  const rememberMe = Boolean(body?.rememberMe);

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  const upstream = await fetch(`${base}/auth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(data || { error: "Login failed." }, { status: upstream.status });
  }

  const token =
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.jwt ||
    "";

  if (!token) {
    return NextResponse.json(
      { error: "Login succeeded but no token was returned by the API." },
      { status: 502 }
    );
  }

  const decoded = decodeJwt(token);
  const user = decoded?.data || null;
  const exp = decoded?.exp || null;

  const res = NextResponse.json({
    loggedIn: true,
    user,
    exp,
  });

  res.cookies.set("ld_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  return res;
}