
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/config";

async function forward(request, { params }) {
  const base = getApiBaseUrl();
  const resolvedParams = await params;
  const parts = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
  const url = `${base}/${parts.join("/")}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("ld_token")?.value || "";

  const method = request.method;
  const contentType = request.headers.get("content-type") || "";

  const headers = new Headers();
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);
  if (token) headers.set("authorization", `Bearer ${token}`);

  let body = undefined;

  if (method !== "GET" && method !== "HEAD") {
    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      body = await request.text();
      headers.set("content-type", "application/x-www-form-urlencoded");
    } else if (contentType.includes("application/json")) {
      body = await request.text();
      headers.set("content-type", "application/json");
    } else {
      body = await request.arrayBuffer();
      if (contentType) headers.set("content-type", contentType);
    }
  }

  const res = await fetch(url, { method, headers, body, cache: "no-store" });

  if (res.status === 204 || res.status === 205 || res.status === 304) {
    return new Response(null, { status: res.status });
  }

  const outType = res.headers.get("content-type") || "application/json";
  const text = await res.text().catch(() => "");

  return new Response(text, {
    status: res.status,
    headers: { "content-type": outType },
  });
}

export async function GET(request, ctx) { return forward(request, ctx); }
export async function POST(request, ctx) { return forward(request, ctx); }
export async function PATCH(request, ctx) { return forward(request, ctx); }
export async function DELETE(request, ctx) { return forward(request, ctx); }