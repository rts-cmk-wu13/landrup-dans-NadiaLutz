
import styles from "./register.module.scss"
import RegisterForm from "@/forms/RegisterForm"
import Brand from "@/components/Brand"  

export default function CreateUserPage() {
  return (
    <section className={styles.registerPage}>
     <Brand />
      <article className={styles.registerFormContainer}>
        <h1 className={styles.registerTitle}>Opret bruger</h1>
        <RegisterForm className={styles.registerForm} />
      </article>
    </section>
  )
}
