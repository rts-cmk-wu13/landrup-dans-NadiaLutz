import styles from "./ContactForm.module.scss"

export default function ContactInfo() {
  return (
    <section className={styles.contactInfo}>
      <img className={styles.brand} src="/imgs/brand.png" alt="Logo" />
      <span className={styles.brandName}>Landrup Dans</span>

      <div className={styles.infoDivider}>
        <p className={styles.contactInfoText}>Pulsen 8, 4000 Roskilde</p>
        <p className={styles.contactInfoText}>Tlf. 3540 4550</p>
      </div>
    </section>
  )
}
