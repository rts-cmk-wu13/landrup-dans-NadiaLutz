import styles from "./Hero.module.scss"
import Link from "next/link"

export default function Hero() {
  return (
    <section className={styles.intro}>
      <article className={styles.introBrand}>
        <img className={styles.brand} src="/imgs/brand.png" alt="Logo" />
        <img className={styles.brandName} src="/imgs/brandname.png" alt="Brand Name" />
        <div className={styles.heroDivider}></div>
      </article>

      <article className={styles.heroButtonContainer}>
        <Link className={styles.heroButton} href="/login">
          Log in her
        </Link>
      </article>
    </section>
  )
}