"use server"

import { redirect } from "next/navigation"
import { registerSchema } from "@/lib/schemas"
import { getApiBaseUrl } from "@/lib/config"

export async function registerAction(prevState, formData) {
  const result = registerSchema.safeParse({
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    username: formData.get("username"),
    age: formData.get("age"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { firstname, lastname, username, age, password } = result.data

  const body = new URLSearchParams()
  body.set("username", username)
  body.set("password", password)
  body.set("firstname", firstname)
  body.set("lastname", lastname)
  body.set("age", String(age))
  body.set("role", "default")

  const base = getApiBaseUrl()
  const res = await fetch(`${base}/api/v1/users`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    return { error: data?.error || data?.message || "Registrering mislykkedes. Prøv igen." }
  }

  redirect("/login")
}
