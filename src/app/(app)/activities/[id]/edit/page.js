"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ldFetch } from "@/lib/api"
import styles from "./editActivity.module.scss"

const WEEKDAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]

export default function EditActivityPage() {
  const { id } = useParams()
  const router = useRouter()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await ldFetch(`/api/v1/activities/${id}`, { method: "GET" })
      if (res.ok) {
        const a = res.data
        setForm({
          name: a.name || "",
          weekday: a.weekday || "",
          time: a.time || "",
          minAge: a.minAge != null ? String(a.minAge) : "",
          maxAge: a.maxAge != null ? String(a.maxAge) : "",
          maxParticipants: a.maxParticipants != null ? String(a.maxParticipants) : "",
          description: a.description || "",
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!form.name.trim()) { setError("Navn er påkrævet."); return }

    setSubmitting(true)
    const res = await ldFetch(`/api/v1/activities/${id}`, {
      method: "PATCH",
      body: {
        name: form.name,
        weekday: form.weekday || undefined,
        time: form.time || undefined,
        minAge: form.minAge ? Number(form.minAge) : undefined,
        maxAge: form.maxAge ? Number(form.maxAge) : undefined,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        description: form.description || undefined,
      },
    })
    setSubmitting(false)

    if (res.ok) {
      router.push("/profile")
    } else {
      setError(res.data?.error || res.data?.message || "Noget gik galt. Prøv igen.")
    }
  }

  if (loading) return <main className={styles.formPage}><p>Indlæser...</p></main>
  if (!form) return <main className={styles.formPage}><p>Aktivitet ikke fundet.</p></main>

  return (
    <main className={styles.formPage}>
      <h1 className={styles.title}>Rediger hold</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          Navn
          <input
            className={styles.input}
            value={form.name}
            onChange={e => setField("name", e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Ugedag
          <select
            className={styles.input}
            value={form.weekday}
            onChange={e => setField("weekday", e.target.value)}
          >
            <option value="">Vælg ugedag</option>
            {WEEKDAYS.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Tid
          <input
            className={styles.input}
            type="time"
            value={form.time}
            onChange={e => setField("time", e.target.value)}
          />
        </label>

        <div className={styles.row}>
          <label className={styles.label}>
            Min. alder
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.minAge}
              onChange={e => setField("minAge", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Max. alder
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.maxAge}
              onChange={e => setField("maxAge", e.target.value)}
            />
          </label>
        </div>

        <label className={styles.label}>
          Max. deltagere
          <input
            className={styles.input}
            type="number"
            min="1"
            value={form.maxParticipants}
            onChange={e => setField("maxParticipants", e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Beskrivelse
          <textarea
            className={styles.textarea}
            rows={4}
            value={form.description}
            onChange={e => setField("description", e.target.value)}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.btn} type="submit" disabled={submitting}>
          {submitting ? "Gemmer..." : "Gem ændringer"}
        </button>
      </form>
    </main>
  )
}
