import styles from "./landing.module.scss"
import Hero from "@/components/landing/Hero"

export default function Landing() {
  return (
    <main className={styles.page}>
      <Hero />
    </main>
  )
}
