import styles from "./Hero.module.scss"

export default function Hero() {
  return (
    <section className={styles.intro}>
      <article className={styles.introBrand}>
      <img className={styles.brand} src="/imgs/brand.png" alt="Logo" />
      <img className={styles.brandName} src="/imgs/brandname.png" alt="Brand Name"/>
      </article>
      <article className={styles.heroButtonContainer}>
    <button className={styles.heroButton}>Log ind her</button> 
    </article> 
    </section>
  )
}
