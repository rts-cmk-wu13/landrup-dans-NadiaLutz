"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { FaUser } from "react-icons/fa6"
import { ldFetch } from "@/lib/api"
import { getMe } from "@/lib/auth"
import ProfileHeader from "@/profile/ProfileHeader"
import styles from "./participants.module.scss"

export default function ParticipantsPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState(null)
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

      setMe(user)

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
      <ProfileHeader user={me} />

      <section className={styles.section}>
        <h2 className={styles.activityName}>{activityName}</h2>
        <p className={styles.delegatesLabel}>Deltagere:</p>

        {participants.length === 0 ? (
          <p className={styles.empty}>Ingen deltagere tilmeldt denne aktivitet.</p>
        ) : (
          <ul className={styles.list}>
            {participants.map((u) => (
              <li key={u.id} className={styles.listItem}>
                <FaUser className={styles.icon} />
                <span className={styles.name}>{u.firstname} {u.lastname}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
