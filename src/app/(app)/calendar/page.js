"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getMe } from "@/lib/auth"
import { getUserActivities } from "@/lib/rules"
import { formatWeekday } from "@/lib/weekday"
import styles from "./calendar.module.scss"

const WEEKDAY_ORDER = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]

export default function CalendarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    async function load() {
      const meRes = await getMe()
      if (!meRes.ok) {
        router.push("/login")
        return
      }

      const user = meRes.data
      if (user.role === "instructor") {
        router.replace("/calendar/instructor")
        return
      }

      setActivities(getUserActivities(user))
      setLoading(false)
    }
    load()
  }, [router])

  const byWeekday = WEEKDAY_ORDER
    .map(day => ({
      day,
      label: formatWeekday(day),
      acts: activities.filter(a => a.weekday?.toLowerCase() === day)
    }))
    .filter(g => g.acts.length > 0)

  if (loading) return <main className={styles.page}><p>Indlæser...</p></main>

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Min kalender</h1>

      {byWeekday.length === 0 ? (
        <p className={styles.empty}>Du er ikke tilmeldt nogen aktiviteter endnu.</p>
      ) : (
        byWeekday.map(({ day, label, acts }) => (
          <section key={day} className={styles.daySection}>
            <h2 className={styles.dayLabel}>{label}</h2>
            <ul className={styles.list}>
              {acts.map(a => (
                <li key={a.id} className={styles.item}>
                  <span className={styles.activityName}>{a.name}</span>
                  {a.time && <span className={styles.activityTime}>{a.time}</span>}
                  <Link href={`/activities/${a.id}`} className={styles.link}>Se hold</Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  )
}
