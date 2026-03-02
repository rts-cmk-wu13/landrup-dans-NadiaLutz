"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { activitySchema } from "@/lib/schemas"
import { getApiBaseUrl } from "@/lib/config"

// id is bound via .bind(null, id) in the client component
export async function editActivityAction(id, prevState, formData) {
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

  const { name, description, weekday, time, minAge, maxAge, maxParticipants } = result.data

  const fd = new FormData()
  fd.append("name", name)
  if (description !== undefined) fd.append("description", description)
  if (weekday !== undefined) fd.append("weekday", weekday)
  if (time !== undefined) fd.append("time", time)
  if (minAge !== undefined) fd.append("minAge", String(minAge))
  if (maxAge !== undefined) fd.append("maxAge", String(maxAge))
  if (maxParticipants !== undefined) fd.append("maxParticipants", String(maxParticipants))

  const cookieStore = await cookies()
  const token = cookieStore.get("ld_token")?.value || ""

  const headers = new Headers()
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const base = getApiBaseUrl()
  const res = await fetch(`${base}/api/v1/activities/${id}`, {
    method: "PATCH",
    headers,
    body: fd,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    return { error: data?.error || data?.message || "Noget gik galt. Prøv igen." }
  }

  redirect("/profile")
}
