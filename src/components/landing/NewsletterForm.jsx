"use client"

import { useActionState } from "react"
import { newsletterAction } from "@/app/(public)/actions"
import styles from "./NewsletterForm.module.scss"

export default function NewsletterForm() {
  const [state, action, isPending] = useActionState(newsletterAction, null)

  return (
    <section className={styles.newsletterForm}>
      <h1 className={styles.newsletterTitle}>Nyhedsbrev</h1>
      <p className={styles.newsletterText}>
        Få direkte besked når vi har sæsonstart eller afholder arrangementer.
      </p>

      {state?.success ? (
        <p className={styles.newsletterMessage}>Tak! Du er nu tilmeldt vores nyhedsbrev.</p>
      ) : (
        <>
          <form className={styles.newsletterFormContainer} action={action} noValidate>
            <input
              className={styles.newsletterInput}
              type="email"
              name="email"
              placeholder="E-mail"
              autoComplete="email"
            />
            <button className={styles.newsletterButton} type="submit" disabled={isPending}>
              {isPending ? "Tilmelder..." : "Tilmeld"}
            </button>
          </form>
          {state?.errors?.email && (
            <p role="alert" className={styles.error}>{state.errors.email[0]}</p>
          )}
          {state?.error && <p role="alert" className={styles.error}>{state.error}</p>}
        </>
      )}
    </section>
  )
}
