import styles from "./Brand.module.scss"

export default function Brand({ large = false }) {
  return (

      <article className={`${styles.brand} ${large ? styles.brandLarge : ""}`}>
        <img className={styles.brandLogo} src="/imgs/brand.png" alt="Logo" />
        <img className={styles.brandName} src="/imgs/brandname.png" alt="Brand Name" />
        <hr className={styles.heroDivider} />
      </article>
    
  )
}