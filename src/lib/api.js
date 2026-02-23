
function toPath(p) {
  const s = String(p || "");
  if (!s.startsWith("/")) return `/${s}`;
  return s;
}

function isFormData(v) {
  return typeof FormData !== "undefined" && v instanceof FormData;
}

function isUrlSearchParams(v) {
  return typeof URLSearchParams !== "undefined" && v instanceof URLSearchParams;
}

export async function ldFetch(path, options = {}) {
  const url = `/api/ld${toPath(path)}`;

  const method = options.method || "GET";
  const headers = new Headers(options.headers || {});

  let body = options.body;


  if (
    body &&
    typeof body === "object" &&
    !isFormData(body) &&
    !isUrlSearchParams(body) &&
    !(body instanceof ArrayBuffer)
  ) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(body);
  }

  if (isUrlSearchParams(body)) {
    headers.set("content-type", "application/x-www-form-urlencoded");
    body = body.toString();
  }

  const res = await fetch(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : body,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  let data = null;

  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => "");
  }

  return { ok: res.ok, status: res.status, data };
}