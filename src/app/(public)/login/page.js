
import styles from "./login.module.scss"
import Link from "next/link"
import LoginForm from "@/forms/LoginForm"
import Brand from "@/components/Brand"

export default function LoginPage() {
  return (
    <section className={styles.loginPage}>
      <Brand />
      <article className={styles.loginFormContainer}>
        <h1 className={styles.loginTitle}>Log ind</h1>

        <LoginForm className={styles.loginForm} />

        <span className={styles.registerLink}>
          Er du endnu ikke bruger <Link href="/register">Opret dig her</Link>
        </span>
      </article>
    </section>
  )
}