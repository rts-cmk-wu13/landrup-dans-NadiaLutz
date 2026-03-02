"use client"

import { useActionState } from "react"
import { registerAction } from "@/app/(public)/register/actions"

export default function RegisterForm({ className }) {
  const [state, action, isPending] = useActionState(registerAction, null)

  return (
    <form className={className} action={action} noValidate>
      <input
        type="text"
        name="firstname"
        placeholder="Fornavn"
        autoComplete="given-name"
      />
      {state?.errors?.firstname && (
        <p role="alert">{state.errors.firstname[0]}</p>
      )}

      <input
        type="text"
        name="lastname"
        placeholder="Efternavn"
        autoComplete="family-name"
      />
      {state?.errors?.lastname && (
        <p role="alert">{state.errors.lastname[0]}</p>
      )}

      <input
        type="text"
        name="username"
        placeholder="Brugernavn"
        autoComplete="username"
      />
      {state?.errors?.username && (
        <p role="alert">{state.errors.username[0]}</p>
      )}

      <input
        type="number"
        name="age"
        placeholder="Alder"
        inputMode="numeric"
      />
      {state?.errors?.age && (
        <p role="alert">{state.errors.age[0]}</p>
      )}

      <input
        type="password"
        name="password"
        placeholder="Adgangskode"
        autoComplete="new-password"
      />
      {state?.errors?.password && (
        <p role="alert">{state.errors.password[0]}</p>
      )}

      <input
        type="password"
        name="confirmPassword"
        placeholder="Gentag adgangskode"
        autoComplete="new-password"
      />
      {state?.errors?.confirmPassword && (
        <p role="alert">{state.errors.confirmPassword[0]}</p>
      )}

      <button type="submit" disabled={isPending}>
        {isPending ? "Opretter..." : "Opret bruger"}
      </button>

      {state?.error ? <p role="alert">{state.error}</p> : null}
    </form>
  )
}