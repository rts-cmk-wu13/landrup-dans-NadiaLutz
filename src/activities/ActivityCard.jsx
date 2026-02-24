import Link from "next/link"
import styles from "./ActivityCard.module.scss"

export default function ActivityCard({ activity }) {
  const ageText = activity.minAge || activity.maxAge
    ? `${activity.minAge ?? ""}–${activity.maxAge ?? ""} år`
    : ""

  return (
    <Link href={`/activities/${activity.id}`} className={styles.link}>
      <article className={styles.card}>
        {activity.asset?.url && (
          <img src={activity.asset.url} alt={activity.name} className={styles.image} />
        )}
        <div className={styles.info}>
          <h2 className={styles.name}>{activity.name}</h2>
          {ageText && <p className={styles.meta}>{ageText}</p>}
        </div>
      </article>
    </Link>
  )
}
