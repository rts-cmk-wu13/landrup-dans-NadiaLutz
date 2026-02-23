import Link from "next/link";
import styles from "./ProfileActivities.module.scss";

function activityKey(a, i) {
  return a?.id ?? `${a?.name || "activity"}-${i}`;
}

function AgeRange({ minAge, maxAge }) {
  if (minAge && maxAge) return <>{minAge}–{maxAge} år</>;
  if (minAge) return <>Fra {minAge} år</>;
  if (maxAge) return <>Op til {maxAge} år</>;
  return null;
}

export default function ProfileActivities({ title, activities = [], variant }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>

      {activities.length === 0 && <p>Ingen aktiviteter tilgængelige.</p>}

      {activities.length > 0 && (
        <div className={styles.container}>
          {activities.map((a, i) => (
            <article key={activityKey(a, i)} className={styles.card}>
              {a?.Asset?.url && (
                <img
                  src={a.Asset.url}
                  alt={a?.name || "Activity"}
                  className={styles.image}
                />
              )}
              <div className={styles.info}>
                <h3 className={styles.name}>{a?.name || "Activity"}</h3>
                {(a?.minAge || a?.maxAge) && (
                  <p className={styles.meta}>
                    <AgeRange minAge={a?.minAge} maxAge={a?.maxAge} />
                  </p>
                )}
              </div>

              {variant === "default" && (
                <Link href={a?.id ? `/activities/${encodeURIComponent(a.id)}` : "#"} className={styles.link}>
                  View class
                </Link>
              )}
              {variant === "instructor" && (
                <Link href={a?.id ? `/activities/${encodeURIComponent(a.id)}/participants` : "#"} className={styles.link}>
                  Participant list
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}