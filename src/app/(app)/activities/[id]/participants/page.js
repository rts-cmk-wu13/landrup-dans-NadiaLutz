"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ldFetch } from "@/lib/api"
import { getMe } from "@/lib/auth"
import styles from "./participants.module.scss"

export default function ParticipantsPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [participants, setParticipants] = useState([])
  const [activityName, setActivityName] = useState("")

  useEffect(() => {
    async function load() {
      const meRes = await getMe()
      if (!meRes.ok) {
        router.push("/login")
        return
      }

      const user = meRes.data
      if (user.role !== "instructor") {
        router.push("/profile")
        return
      }

      const actRes = await ldFetch(`/api/v1/activities/${id}`, { method: "GET" })
      if (actRes.ok) setActivityName(actRes.data?.name || "")

      const rosterRes = await ldFetch(`/api/v1/users/${user.id}/roster/${id}`, { method: "GET" })
      if (rosterRes.ok) setParticipants(rosterRes.data)

      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <main className={styles.page}><p>Indlæser...</p></main>

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Deltagerliste</h1>
      <p className={styles.activityName}>{activityName}</p>

      {participants.length === 0 ? (
        <p className={styles.empty}>Ingen deltagere tilmeldt denne aktivitet.</p>
      ) : (
        <ul className={styles.list}>
          {participants.map((u, i) => (
            <li key={i} className={styles.listItem}>
              {u.firstname} {u.lastname}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
