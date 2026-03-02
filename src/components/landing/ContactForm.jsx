"use client"

import { useActionState } from "react"
import { contactAction } from "@/app/(public)/actions"
import styles from "./ContactForm.module.scss"

export default function ContactForm() {
  const [state, action, isPending] = useActionState(contactAction, null)

  if (state?.success) {
    return (
      <section className={styles.contactForm}>
        <div className={styles.contactInner}>
          <h1 className={styles.contactTitle}>Kontakt os</h1>
          <p className={styles.contactMessage}>Tak for din besked! Vi vender tilbage hurtigst muligt.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.contactForm}>
      <div className={styles.contactInner}>
        <h1 className={styles.contactTitle}>Kontakt os</h1>

        <form className={styles.contactFormContainer} action={action} noValidate>
          <input
            className={styles.contactInput}
            placeholder="Navn"
            type="text"
            name="name"
            autoComplete="name"
          />
          {state?.errors?.name && (
            <p role="alert" className={styles.error}>{state.errors.name[0]}</p>
          )}

          <input
            className={styles.contactInput}
            placeholder="Email"
            type="email"
            name="email"
            autoComplete="email"
          />
          {state?.errors?.email && (
            <p role="alert" className={styles.error}>{state.errors.email[0]}</p>
          )}

          <textarea
            className={styles.contactTextarea}
            placeholder="Besked"
            name="message"
            rows={8}
          />
          {state?.errors?.message && (
            <p role="alert" className={styles.error}>{state.errors.message[0]}</p>
          )}

          {state?.error && <p role="alert" className={styles.error}>{state.error}</p>}

          <button className={styles.contactButton} type="submit" disabled={isPending}>
            {isPending ? "Sender..." : "Send besked"}
          </button>
        </form>
      </div>
    </section>
  )
}
