import { cookies } from "next/headers"
import { getApiBaseUrl } from "./config"


export async function serverFetch(path, options = {}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("ld_token")?.value || ""
  const base = getApiBaseUrl()
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`

  const headers = new Headers(options.headers || {})
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  })

  const contentType = res.headers.get("content-type") || ""
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "")

  return { ok: res.ok, status: res.status, data }
}
