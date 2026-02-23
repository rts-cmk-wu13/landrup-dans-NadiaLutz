
import Link from "next/link";
import { formatWeekday } from "@/lib/weekday";
import styles from "./ActivityCard.module.scss";

function getInstructorName(activity) {
  const i = activity?.instructor;
  const first = i?.firstname || i?.firstName || activity?.instructorFirstname;
  const last = i?.lastname || i?.lastName || activity?.instructorLastname;
  const full = [first, last].filter(Boolean).join(" ").trim();
  return full || activity?.instructorName || activity?.instructor || activity?.teacher || "";
}

export default function ActivityCard({ activity }) {
  const id = activity?.id;
  const name = activity?.name || "Untitled activity";
  const weekday = formatWeekday(activity?.weekday);
  const time = activity?.time || "";
  const instructor = getInstructorName(activity);

  return (
    <Link href={`/activities/${encodeURIComponent(id)}`} className={styles.link}>
      <article className={styles.card}>
        {activity?.Asset?.url && (
          <img src={activity.Asset.url} alt={name} className={styles.image} />
        )}
        <div className={styles.info}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.meta}>
            {weekday}{weekday && time ? " · " : ""}{time}
          </p>
          {instructor ? <p className={styles.instructor}>{instructor}</p> : null}
        </div>
      </article>
    </Link>
  );
}