// src/activities/ActivityCard.jsx
import Link from "next/link";
import { formatWeekday } from "@/lib/weekday";

function getInstructorName(activity) {
  const i = activity?.instructor;
  const first = i?.firstname || i?.firstName || activity?.instructorFirstname;
  const last = i?.lastname || i?.lastName || activity?.instructorLastname;
  const full = [first, last].filter(Boolean).join(" ").trim();
  return (
    full ||
    activity?.instructorName ||
    activity?.instructor ||
    activity?.teacher ||
    ""
  );
}

export default function ActivityCard({ activity }) {
  const id = activity?.id;
  const name = activity?.name || "Untitled activity";
  const weekday = formatWeekday(activity?.weekday);
  const time = activity?.time || "";
  const instructor = getInstructorName(activity);

  return (
    <Link href={`/activities/${encodeURIComponent(id)}`} style={{ textDecoration: "none" }}>
      <article>
        <h2>{name}</h2>
        <p>
          {weekday}{weekday && time ? " · " : ""}{time}
        </p>
        {instructor ? <p>{instructor}</p> : null}
      </article>
    </Link>
  );
}