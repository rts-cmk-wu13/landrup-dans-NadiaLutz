"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ldFetch } from "@/lib/api"
import { getMe } from "@/lib/auth"
import { formatWeekday } from "@/lib/weekday"
import styles from "./instructorCalendar.module.scss"

const WEEKDAY_ORDER = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]

export default function InstructorCalendarPage() {
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
      if (user.role !== "instructor") {
        router.replace("/profile")
        return
      }

      const allActs = await ldFetch("/api/v1/activities", { method: "GET" })
      if (allActs.ok) {
        const mine = allActs.data.filter(a => String(a.instructorId) === String(user.id))
        setActivities(mine)
      }

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
      <h1 className={styles.heading}>Min undervisningsplan</h1>

      {byWeekday.length === 0 ? (
        <p className={styles.empty}>Du har ingen aktiviteter tilknyttet.</p>
      ) : (
        byWeekday.map(({ day, label, acts }) => (
          <section key={day} className={styles.daySection}>
            <h2 className={styles.dayLabel}>{label}</h2>
            <ul className={styles.list}>
              {acts.map(a => (
                <li key={a.id} className={styles.item}>
                  <span className={styles.activityName}>{a.name}</span>
                  {a.time && <span className={styles.activityTime}>{a.time}</span>}
                  <Link href={`/activities/${a.id}/participants`} className={styles.link}>
                    Deltagerliste
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  )
}
