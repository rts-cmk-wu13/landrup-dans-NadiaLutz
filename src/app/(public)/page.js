import styles from "./landing.module.scss"

import Hero from "@/components/landing/Hero"
import HoldTyper from "@/components/landing/HoldTyper"
import Carousel from "@/components/landing/Carousel"
import NewsletterForm from "@/components/landing/NewsletterForm"
import ContactForm from "@/components/landing/ContactForm"

export default function PublicLandingPage() {
  return (
    <main className={styles.landing}>
      <Hero />
      <HoldTyper />
      <NewsletterForm />
      <Carousel />
      <ContactForm />
    </main>
  )
}
