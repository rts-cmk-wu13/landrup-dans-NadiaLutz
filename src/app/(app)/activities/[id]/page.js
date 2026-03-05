"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ldFetch } from "@/lib/api"
import { getMe } from "@/lib/auth"
import { canJoinActivity, isUserJoinedActivity } from "@/lib/rules"
import styles from "./activityDetail.module.scss"

async function fetchActivity(id) {
  const actRes = await ldFetch(`/api/v1/activities/${id}`, { method: "GET" })
  return actRes.ok ? actRes.data : null
}

export default function ActivityDetailsPage() {
  const { id } = useParams()

  const [activity, setActivity] = useState(null)
  const [me, setMe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const actData = await fetchActivity(id)
      if (actData) setActivity(actData)

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
      const actData = await fetchActivity(id)
      if (actData) setActivity(actData)
      const meRes = await getMe()
      if (meRes.ok) setMe(meRes.data)
      setMessage("tilmeldt")
    } else {
      setMessage("Noget gik galt. Prøv igen.")
    }
  }

  async function onLeave() {
    setIsSubmitting(true)
    const res = await ldFetch(`/api/v1/users/${me.id}/activities/${activity.id}`, { method: "DELETE" })
    setIsSubmitting(false)
    if (res.ok) {
      const actData = await fetchActivity(id)
      if (actData) setActivity(actData)
      const meRes = await getMe()
      if (meRes.ok) setMe(meRes.data)
      setMessage("afmeldt")
    } else {
      setMessage("Noget gik galt. Prøv igen.")
    }
  }

  if (loading) return <main className={styles.page}><p>Indlæser...</p></main>

  if (!activity) return <main className={styles.page}><p>Aktivitet ikke fundet.</p></main>

  const ageText = activity.minAge ? `${activity.minAge}+ år` : ""

  return (
    <main className={styles.page}>
      <div className={styles.imageWrapper}>
        {activity.asset?.url && (
          <img src={activity.asset.url} alt={activity.name} className={styles.image} />
        )}
        {me && (
          <button
            className={styles.btn}
            type="button"
            onClick={joined ? onLeave : onJoin}
            disabled={isSubmitting || (!joined && !joinCheck.ok)}
          >
            {joined ? "Forlad" : "Tilmeld"}
          </button>
        )}
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{activity.name}</h1>
        {ageText && <p className={styles.meta}>{ageText}</p>}
        <p className={styles.description}>
          {activity.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget elementum lorem nulla vitae felis auctor pretium suspendisse et. Condimentum fringilla odio vitae interdum adipiscing odio volutpat. Faucibus gravida quis nisi, purus morbi leo nulla a. Mattis tincidunt phasellus enim, egestas non ultrices."}
        </p>

        {me && (
          <>
            {!joined && !joinCheck.ok && joinCheck.reason && (
              <p className={styles.error}>{joinCheck.reason}</p>
            )}
            {message && (
              <p className={styles.activityMessage}>
                Du er nu <span className={styles.activityMessageBold}>{message}</span> aktiviteten.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  )
}
