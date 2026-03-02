"use server"

import { newsletterSchema, contactSchema } from "@/lib/schemas"

export async function newsletterAction(prevState, formData) {
  const result = newsletterSchema.safeParse({
    email: formData.get("email"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  // TODO: send email.result.data.email to a mailing service here

  return { success: true }
}

export async function contactAction(prevState, formData) {
  const result = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  // TODO: forward result.data to an email service here

  return { success: true }
}
