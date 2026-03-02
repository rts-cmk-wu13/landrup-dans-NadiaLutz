"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { loginSchema } from "@/lib/schemas"
import { getApiBaseUrl } from "@/lib/config"

export async function loginAction(prevState, formData) {
  const result = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { username, password } = result.data
  const rememberMe = formData.get("rememberMe") === "on"

  const base = getApiBaseUrl()
  const res = await fetch(`${base}/auth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    return { error: data?.error || data?.message || "Login mislykkedes. Prøv igen." }
  }

  const token =
    data?.token || data?.accessToken || data?.access_token || data?.jwt || ""

  if (!token) {
    return { error: "Login mislykkedes – ingen token modtaget." }
  }

  const cookieStore = await cookies()
  cookieStore.set("ld_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  })

  redirect("/profile")
}
