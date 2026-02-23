// src/activities/ActivityList.jsx
import ActivityCard from "@/activities/ActivityCard";

export default function ActivityList({ activities = [] }) {
  return (
    <section aria-label="Activities">
      {activities.map((a, i) => (
        <ActivityCard key={a?.id ?? `${a?.name || "activity"}-${i}`} activity={a} />
      ))}
    </section>
  );
}