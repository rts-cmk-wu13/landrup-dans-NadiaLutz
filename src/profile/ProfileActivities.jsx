
import Link from "next/link";
import { formatWeekday } from "@/lib/weekday";

function activityKey(a, i) {
  return a?.id ?? `${a?.name || "activity"}-${i}`;
}

export default function ProfileActivities({ title, activities = [], variant }) {
  return (
    <section style={{ marginTop: "1rem" }}>
      <h2 style={{ marginBottom: ".5rem" }}>{title}</h2>

      {activities.length === 0 ? <p>No activities.</p> : null}

      {activities.length > 0 ? (
        <div style={{ display: "grid", gap: ".75rem" }}>
          {activities.map((a, i) => (
            <article key={activityKey(a, i)}>
              <h3 style={{ margin: 0 }}>{a?.name || "Activity"}</h3>
              <p style={{ margin: 0 }}>
                {formatWeekday(a?.weekday)}{a?.time ? ` · ${a.time}` : ""}
              </p>

              {variant === "default" ? (
                <Link href={`/activities/${encodeURIComponent(a?.id)}`}>View class</Link>
              ) : null}

              {variant === "instructor" ? (
                <Link href={`/activities/${encodeURIComponent(a?.id)}/participants`}>
                  Participant list
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}