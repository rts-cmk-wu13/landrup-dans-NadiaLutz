// src/app/(public)/register/page.js
import styles from "./register.module.scss"
import RegisterForm from "@/forms/RegisterForm"

export default function CreateUserPage() {
  return (
    <section className={styles.registerPage}>
      <article className={styles.introBrand}>
        <img className={styles.brand} src="/imgs/brand.png" alt="Logo" />
        <img
          className={styles.brandName}
          src="/imgs/brandname.png"
          alt="Brand Name"
        />
        <div className={styles.heroDivider}></div>
      </article>

      <article className={styles.registerFormContainer}>
        <h1 className={styles.registerTitle}>Create account</h1>
        <RegisterForm className={styles.registerForm} />
      </article>
    </section>
  )
}