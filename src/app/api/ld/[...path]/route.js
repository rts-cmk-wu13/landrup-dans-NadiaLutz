
import { cookies } from "next/headers";
import { getApiBaseUrl } from "@/lib/config";

function isMultipart(contentType) {
  return typeof contentType === "string" && contentType.includes("multipart/form-data");
}

function isUrlEncoded(contentType) {
  return typeof contentType === "string" && contentType.includes("application/x-www-form-urlencoded");
}

function isJson(contentType) {
  return typeof contentType === "string" && contentType.includes("application/json");
}

async function forward(request, { params }) {
  const base = getApiBaseUrl();
  const resolvedParams = await params;
  const parts = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
  const upstreamPath = parts.join("/");
  const url = `${base}/${upstreamPath}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("ld_token")?.value || "";

  const method = request.method;
  const incomingType = request.headers.get("content-type") || "";

  const headers = new Headers();
  const accept = request.headers.get("accept");
  if (accept) headers.set("accept", accept);

  if (token) headers.set("authorization", `Bearer ${token}`);

  let body = undefined;

  if (method !== "GET" && method !== "HEAD") {
    if (isMultipart(incomingType)) {
      body = await request.formData();

    } else if (isUrlEncoded(incomingType)) {
      const text = await request.text();
      body = text;
      headers.set("content-type", "application/x-www-form-urlencoded");
    } else if (isJson(incomingType)) {
      const text = await request.text();
      body = text;
      headers.set("content-type", "application/json");
    } else {
      const buf = await request.arrayBuffer();
      body = buf;
      if (incomingType) headers.set("content-type", incomingType);
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const outType = res.headers.get("content-type") || "application/json";
  const text = await res.text().catch(() => "");

  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": outType,
    },
  });
}

export async function GET(request, ctx) {
  return forward(request, ctx);
}
export async function POST(request, ctx) {
  return forward(request, ctx);
}
export async function PATCH(request, ctx) {
  return forward(request, ctx);
}
export async function DELETE(request, ctx) {
  return forward(request, ctx);
}