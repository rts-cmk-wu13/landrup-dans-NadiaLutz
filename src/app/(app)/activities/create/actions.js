"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { activitySchema } from "@/lib/schemas"
import { getApiBaseUrl } from "@/lib/config"

export async function createActivityAction(prevState, formData) {
  const result = activitySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    weekday: formData.get("weekday"),
    time: formData.get("time"),
    minAge: formData.get("minAge"),
    maxAge: formData.get("maxAge"),
    maxParticipants: formData.get("maxParticipants"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { errors: { file: ["Billede er påkrævet"] } }
  }

  const { name, description, weekday, time, minAge, maxAge, maxParticipants } = result.data

  const fd = new FormData()
  fd.append("name", name)
  if (description) fd.append("description", description)
  if (weekday) fd.append("weekday", weekday)
  if (time) fd.append("time", time)
  if (minAge != null) fd.append("minAge", String(minAge))
  if (maxAge != null) fd.append("maxAge", String(maxAge))
  if (maxParticipants != null) fd.append("maxParticipants", String(maxParticipants))
  fd.append("file", file)

  const cookieStore = await cookies()
  const token = cookieStore.get("ld_token")?.value || ""

  const headers = new Headers()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const base = getApiBaseUrl()
  const res = await fetch(`${base}/api/v1/activities`, {
    method: "POST",
    headers,
    body: fd,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    return { error: data?.error || data?.message || `Fejl ${res.status}. Prøv igen.` }
  }

  redirect("/profile")
}
