
import { ldFetch } from "@/lib/api";

export async function login(values) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      username: values?.username,
      password: values?.password,
      rememberMe: Boolean(values?.rememberMe),
    }),
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function logout() {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function getSession() {
  const res = await fetch("/api/auth/session", { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function getMe() {
  const s = await getSession();
  if (!s.ok || !s.data?.loggedIn || !s.data?.user?.id) {
    return { ok: false, status: 401, data: null };
  }

  return ldFetch(`/api/v1/users/${encodeURIComponent(s.data.user.id)}`, {
    method: "GET",
  });
}