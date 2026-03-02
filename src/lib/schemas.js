import { z } from "zod"

const optionalText = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().optional()
)

const optionalNonnegativeInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().int().nonnegative().optional()
)

const optionalPositiveInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().int().positive().optional()
)

export const loginSchema = z.object({
  username: z.string().min(1, "Brugernavn er påkrævet"),
  password: z.string().min(1, "Adgangskode er påkrævet"),
})

export const registerSchema = z
  .object({
    firstname: z.string().min(1, "Fornavn er påkrævet"),
    lastname: z.string().min(1, "Efternavn er påkrævet"),
    username: z.string().min(1, "Brugernavn er påkrævet"),
    age: z.preprocess(
      (v) => (v === "" || v == null ? undefined : Number(v)),
      z.number({ error: "Angiv en gyldig alder" }).int().positive("Alder skal være et positivt tal")
    ),
    password: z.string().min(4, "Adgangskode skal have mindst 4 tegn"),
    confirmPassword: z.string().min(1, "Bekræft adgangskode"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Adgangskoderne matcher ikke",
    path: ["confirmPassword"],
  })

export const activitySchema = z.object({
  name: z.string().min(1, "Navn er påkrævet"),
  description: optionalText,
  weekday: optionalText,
  time: optionalText,
  minAge: optionalNonnegativeInt,
  maxAge: optionalNonnegativeInt,
  maxParticipants: optionalPositiveInt,
})

export const newsletterSchema = z.object({
  email: z.email("Angiv en gyldig e-mailadresse"),
})

export const contactSchema = z.object({
  name: z.string().min(1, "Navn er påkrævet"),
  email: z.email("Angiv en gyldig e-mailadresse"),
  message: z.string().min(1, "Besked er påkrævet"),
})
