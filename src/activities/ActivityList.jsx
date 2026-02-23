
import ActivityCard from "@/activities/ActivityCard";
import styles from "./ActivityList.module.scss";

export default function ActivityList({ activities = [] }) {
  return (
    <section aria-label="Activities" className={styles.container}>
      {activities.map((a, i) => (
        <ActivityCard key={a?.id ?? `${a?.name || "activity"}-${i}`} activity={a} />
      ))}
    </section>
  );
}