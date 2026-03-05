
export async function ldFetch(path, options = {}) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  const url = `/api/ld${cleanPath}`

  const headers = {}
  let body = options.body

  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["content-type"] = "application/json"
    body = JSON.stringify(body)
  }

  const method = options.method || "GET"

  const res = await fetch(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : body,
    cache: "no-store",
  })

  const data = await res.json().catch(() => null)

  return { ok: res.ok, status: res.status, data }
}
