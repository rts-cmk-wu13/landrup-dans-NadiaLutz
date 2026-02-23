
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ld_token")?.value || "";
  if (!token) return NextResponse.json({ loggedIn: false });

  const decoded = decodeJwt(token);
  const user = decoded?.data || null;
  const exp = decoded?.exp || null;

  if (typeof exp === "number" && Date.now() / 1000 > exp) {
    const res = NextResponse.json({ loggedIn: false });
    res.cookies.set("ld_token", "", { path: "/", maxAge: 0 });
    return res;
  }

  return NextResponse.json({ loggedIn: true, user, exp });
}