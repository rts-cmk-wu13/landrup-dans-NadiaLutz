"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ldFetch } from "@/lib/api"
import { getMe } from "@/lib/auth"
import ProfileHeader from "@/profile/ProfileHeader"
import ProfileActivities from "@/profile/ProfileActivities"
import InstructorActivities from "@/profile/InstructorActivities"
import { getUserActivities } from "@/lib/rules"
import styles from "./profile.module.scss"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState(null)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    async function load() {
      const meRes = await getMe()
      if (!meRes.ok) {
        setLoading(false)
        return
      }

      setMe(meRes.data)

      if (meRes.data.role === "instructor") {
        const allActs = await ldFetch("/api/v1/activities", { method: "GET" })
        if (allActs.ok) setActivities(allActs.data)
      }

      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <main className={styles.profilePage}><p>Indlæser...</p></main>

  if (!me) {
    return (
      <main className={styles.profilePage}>
        <p>Du er ikke logget ind.</p>
        <Link href="/login">Gå til login</Link>
      </main>
    )
  }

  const isInstructor = me.role === "instructor"
  const myActivities = isInstructor
    ? activities.filter(a => String(a.instructor?.id) === String(me.id))
    : getUserActivities(me)

  return (
    <main className={styles.profilePage}>
      <ProfileHeader user={me} />
      {!isInstructor ? (
        <ProfileActivities title="Tilmeldte hold" activities={myActivities} variant="default" />
      ) : (
        <InstructorActivities activities={myActivities} />
      )}
    </main>
  )
}
