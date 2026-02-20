import styles from "./login.module.scss"
import Link from "next/link"

export default function LoginPage() {
  return (
    <section className={styles.loginPage}>
      <article className={styles.introBrand}>
        <img className={styles.brand} src="/imgs/brand.png" alt="Logo" />
        <img
          className={styles.brandName}
          src="/imgs/brandname.png"
          alt="Brand Name"
        />
        <div className={styles.heroDivider}></div>
      </article>

      <article className={styles.loginFormContainer}>
            <h1 className={styles.loginTitle}>Log ind</h1>
        <form className={styles.loginForm}>
          <input type="text" id="username" name="username" required />
          <input type="password" id="password" name="password" required />
          <button type="submit">Log ind</button>
        </form>

        <span className={styles.registerLink}>
          Er du endnu ikke bruger? <Link href="/register">Opret dig her</Link>
        </span>
      </article>
    </section>
  )
}