
import styles from "./login.module.scss"
import Link from "next/link"
import LoginForm from "@/forms/LoginForm"

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
        <h1 className={styles.loginTitle}>Log in</h1>

        <LoginForm className={styles.loginForm} />

        <span className={styles.registerLink}>
          Don’t have an account? <Link href="/register">Create one here</Link>
        </span>
      </article>
    </section>
  )
}