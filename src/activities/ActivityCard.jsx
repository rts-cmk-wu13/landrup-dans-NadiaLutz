import Link from "next/link"
import { formatWeekday } from "@/lib/weekday"
import styles from "./ActivityCard.module.scss"

export default function ActivityCard({ activity }) {
  const weekday = formatWeekday(activity.weekday)
  const time = activity.time || ""
  const instructor = activity.instructor
    ? `${activity.instructor.firstname} ${activity.instructor.lastname}`
    : ""

  return (
    <Link href={`/activities/${activity.id}`} className={styles.link}>
      <article className={styles.card}>
        {activity.asset?.url && (
          <img src={activity.asset.url} alt={activity.name} className={styles.image} />
        )}
        <div className={styles.info}>
          <h2 className={styles.name}>{activity.name}</h2>
          <p className={styles.meta}>
            {weekday}{weekday && time ? " kl. " : ""}{time}
          </p>
          {instructor && <p className={styles.instructor}>{instructor}</p>}
        </div>
      </article>
    </Link>
  )
}
