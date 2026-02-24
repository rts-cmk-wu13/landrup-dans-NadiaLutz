import Link from "next/link"
import { formatWeekday } from "@/lib/weekday"
import styles from "./ProfileActivities.module.scss"

export default function ProfileActivities({ title, activities = [], variant }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      {activities.length === 0 && <p className={styles.empty}>Ingen aktiviteter tilgængelige.</p>}

      {activities.length > 0 && (
        <div className={styles.container}>
          {activities.map((a, i) => (
            <article key={a.id ?? i} className={styles.card}>
              {a.asset?.url && (
                <img src={a.asset.url} alt={a.name} className={styles.image} />
              )}
              <div className={styles.info}>
                <h3 className={styles.name}>{a.name}</h3>
                {(a.weekday || a.time) && (
                  <p className={styles.meta}>
                    {formatWeekday(a.weekday)}{a.weekday && a.time ? " kl. " : ""}{a.time}
                  </p>
                )}
              </div>

              {variant === "default" && (
                <Link href={`/activities/${a.id}`} className={styles.link}>
                  Vis hold
                </Link>
              )}
              {variant === "instructor" && (
                <Link href={`/activities/${a.id}/participants`} className={styles.link}>
                  Deltagerliste
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
