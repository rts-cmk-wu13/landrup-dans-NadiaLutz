"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ldFetch } from "@/lib/api"
import { getMe } from "@/lib/auth"
import { canJoinActivity, isUserJoinedActivity } from "@/lib/rules"
import { formatWeekday } from "@/lib/weekday"
import styles from "./activityDetail.module.scss"

export default function ActivityDetailsPage() {
  const { id } = useParams()

  const [activity, setActivity] = useState(null)
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const actRes = await ldFetch(`/api/v1/activities/${id}`, { method: "GET" })
      if (actRes.ok) setActivity(actRes.data)

      const meRes = await getMe()
      if (meRes.ok) setMe(meRes.data)

      setLoading(false)
    }
    load()
  }, [id])

  const joined = me ? isUserJoinedActivity(me, id) : false
  const joinCheck = me && activity ? canJoinActivity(me, activity) : { ok: false, reason: "" }

  async function onJoin() {
    const check = canJoinActivity(me, activity)
    if (!check.ok) {
      setMessage(check.reason)
      return
    }
    setIsSubmitting(true)
    const res = await ldFetch(`/api/v1/users/${me.id}/activities/${activity.id}`, { method: "POST" })
    setIsSubmitting(false)
    if (res.ok) {
      const meRes = await getMe()
      if (meRes.ok) setMe(meRes.data)
      setMessage("Du er nu tilmeldt aktiviteten.")
    } else {
      setMessage("Noget gik galt. Prøv igen.")
    }
  }

  async function onLeave() {
    setIsSubmitting(true)
    const res = await ldFetch(`/api/v1/users/${me.id}/activities/${activity.id}`, { method: "DELETE" })
    setIsSubmitting(false)
    if (res.ok) {
      const meRes = await getMe()
      if (meRes.ok) setMe(meRes.data)
      setMessage("Du er nu afmeldt aktiviteten.")
    } else {
      setMessage("Noget gik galt. Prøv igen.")
    }
  }

  if (loading) return <main className={styles.page}><p>Indlæser...</p></main>

  if (!activity) return <main className={styles.page}><p>Aktivitet ikke fundet.</p></main>

  const weekday = formatWeekday(activity.weekday)
  const time = activity.time || ""
  const ageText = activity.minAge || activity.maxAge
    ? `${activity.minAge ?? ""}-${activity.maxAge ?? ""}`
    : ""

  return (
    <main className={styles.page}>
      {activity.asset?.url && (
        <img src={activity.asset.url} alt={activity.name} className={styles.image} />
      )}
      <h1 className={styles.title}>{activity.name}</h1>
      <p className={styles.meta}>
        {weekday}{weekday && time ? " kl. " : ""}{time}
      </p>
      {ageText && <p className={styles.meta}>Alder: {ageText}</p>}
      {activity.description && <p className={styles.meta}>{activity.description}</p>}

      {me && (
        <div className={styles.actions}>
          <button
            className={styles.btn}
            type="button"
            onClick={joined ? onLeave : onJoin}
            disabled={isSubmitting || (!joined && !joinCheck.ok)}
          >
            {joined ? "Forlad" : "Tilmeld"}
          </button>

          {!joined && !joinCheck.ok && joinCheck.reason && (
            <p className={styles.message}>{joinCheck.reason}</p>
          )}

          {message && <p className={styles.message}>{message}</p>}
        </div>
      )}
    </main>
  )
}
