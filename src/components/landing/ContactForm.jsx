import styles from "./ContactForm.module.scss"

export default function ContactForm() {
  return (
    <>
      <section className={styles.contactForm}>
        <div className={styles.contactInner}>
          <h1 className={styles.contactTitle}>Kontakt os</h1>

          <form className={styles.contactFormContainer}>
            <input
              className={styles.contactInput}
              placeholder="Navn"
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              required
            />

            <input
              className={styles.contactInput}
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
            />

            <textarea
              className={styles.contactTextarea}
              placeholder="Besked"
              id="message"
              name="message"
              rows={8}
              required
            />

            <button className={styles.contactButton} type="submit">
              Send besked
            </button>
          </form>
        </div>
      </section>

      <section className={styles.contactInfo}>
        <img className={styles.brand} src="/imgs/brand.png" alt="Logo" />
      <span className={styles.brandName}>Landrup Dans</span>

        <div className={styles.infoDivider}>
        <p className={styles.contactInfoText}>
          Pulsen 8, 4000 Roskilde
        </p>
        <p className={styles.contactInfoText}>Tlf. 3540 4550</p>
        </div>
      </section>
    </>
  )
}
