import styles from "./Brand.module.scss"

export default function Brand() {
  return (
    <>
      <article className={styles.brand}>
        <img className={styles.brandLogo} src="/imgs/brand.png" alt="Logo" />
        <img className={styles.brandName} src="/imgs/brandname.png" alt="Brand Name" />
        <hr className={styles.heroDivider} />
      </article>
    </>
  )
}