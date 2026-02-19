import styles from "./NewsletterForm.module.scss"

export default function NewsletterForm() {
  return (
    <section className={styles.newsletterForm}>
      <h1 className={styles.newsletterTitle}>Nyhedsbrev</h1>
      <p className={styles.newsletterText}>
        Få direkte besked når vi har sæsonstart eller afholder arrangementer.
      </p>

      <form className={styles.newsletterFormContainer}>
        <input
          className={styles.newsletterInput}
          type="email"
          placeholder="E-mail"
          required
        />
        <button className={styles.newsletterButton} type="submit">
          Tilmeld
        </button>
      </form>
    </section>
  )
}
