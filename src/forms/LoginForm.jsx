"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/(public)/login/actions"

export default function LoginForm({ className, showRememberMe = false }) {
  const [state, action, isPending] = useActionState(loginAction, null)

  return (
    <form className={className} action={action} noValidate>
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
        type="password"
        name="password"
        placeholder="Adgangskode"
        autoComplete="current-password"
      />
      {state?.errors?.password && (
        <p role="alert">{state.errors.password[0]}</p>
      )}

      {showRememberMe ? (
        <label>
          <input type="checkbox" name="rememberMe" />
          Husk mig
        </label>
      ) : null}

      <button type="submit" disabled={isPending}>
        {isPending ? "Logger ind..." : "Log ind"}
      </button>

      {state?.error ? <p role="alert">{state.error}</p> : null}
    </form>
  )
}
