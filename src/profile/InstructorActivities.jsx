"use client"

import { useState } from "react"
import Link from "next/link"
import { FiEdit, FiTrash2 } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai";
import { ldFetch } from "@/lib/api"
import { formatWeekday } from "@/lib/weekday"
import styles from "./InstructorActivities.module.scss"

export default function InstructorActivities({ activities: initial = [] }) {
  const [activities, setActivities] = useState(initial)
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(id) {
    if (!confirm("Vil du slette denne aktivitet?")) return
    setDeleting(id)
    const res = await ldFetch(`/api/v1/activities/${id}`, { method: "DELETE" })
    setDeleting(null)
    if (res.ok) {
      setActivities(prev => prev.filter(a => a.id !== id))
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Mine hold</h2>
        <Link href="/activities/create" className={styles.addBtn}>+</Link>
      </div>

      {activities.length === 0 && (
        <p className={styles.empty}>Ingen aktiviteter tilgængelige.</p>
      )}

      <div className={styles.container}>
        {activities.map(a => {
          const weekday = formatWeekday(a.weekday)
          const time = a.time || ""
          const enrolled = a.participants?.length ?? 0

          return (
            <article key={a.id} className={styles.card}>
              <div className={styles.info}>
                <h3 className={styles.name}>{a.name}</h3>
                {(weekday || time) && (
                  <p className={styles.meta}>
                    {weekday}{weekday && time ? " " : ""}{time}
                  </p>
                )}
                <div className={styles.stats}>
                  {a.maxParticipants != null && (
                    <span>Max. deltagere: {a.maxParticipants}</span>
                  )}
                  <span>Tilmeldte: {enrolled}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Link href={`/activities/${a.id}/participants`} className={styles.listBtn}>
                  Deltagerliste
                </Link>
                <div className={styles.iconBtns}>
                  <Link href={`/activities/${a.id}/edit`} className={styles.iconBtn}>
                    <FiEdit />
                  </Link>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => handleDelete(a.id)}
                    disabled={deleting === a.id}
                  >
                  <AiOutlineDelete />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
