"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ldFetch } from "@/lib/api"
import { getMe } from "@/lib/auth"
import styles from "./createActivity.module.scss"

const WEEKDAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]

export default function CreateActivityPage() {
  const router = useRouter()
  const fileRef = useRef(null)
  const [me, setMe] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [timeFocused, setTimeFocused] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    weekday: "",
    time: "",
    minAge: "",
    maxAge: "",
    maxParticipants: "",
  })
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getMe().then(res => { if (res.ok) setMe(res.data) })
  }, [])

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!form.name.trim()) { setError("Navn er påkrævet."); return }

    setSubmitting(true)
    const fd = new FormData()
    fd.append("name", form.name)
    if (form.description) fd.append("description", form.description)
    if (form.weekday) fd.append("weekday", form.weekday)
    if (form.time) fd.append("time", form.time)
    if (form.minAge) fd.append("minAge", form.minAge)
    if (form.maxAge) fd.append("maxAge", form.maxAge)
    if (form.maxParticipants) fd.append("maxParticipants", form.maxParticipants)
    if (imageFile) fd.append("asset", imageFile)

    const res = await ldFetch("/api/v1/activities", { method: "POST", body: fd })
    setSubmitting(false)

    if (res.ok) {
      router.push("/profile")
    } else {
      setError(res.data?.error || res.data?.message || "Noget gik galt. Prøv igen.")
    }
  }

  const instructorName = me
    ? `${me.firstname || me.firstName || ""} ${me.lastname || me.lastName || ""}`.trim() || me.username || ""
    : ""

  return (
    <main className={styles.formPage}>
      <h1 className={styles.title}>Opret hold</h1>
      <form className={styles.form} onSubmit={handleSubmit}>

        <input
          className={styles.input}
          value={form.name}
          onChange={e => setField("name", e.target.value)}
          placeholder="Holdnavn"
        />

        <textarea
          className={styles.textarea}
          rows={4}
          value={form.description}
          onChange={e => setField("description", e.target.value)}
          placeholder="Beskrivelse"
        />

        <div className={styles.row}>
          <select
            className={styles.input}
            value={form.weekday}
            onChange={e => setField("weekday", e.target.value)}
          >
            <option value="">Ugedag</option>
            {WEEKDAYS.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>

          <div className={`${styles.timeWrapper} ${!form.time && !timeFocused ? styles.timeEmpty : ""}`}>
            <input
              className={styles.input}
              type="time"
              value={form.time}
              onChange={e => setField("time", e.target.value)}
              onFocus={() => setTimeFocused(true)}
              onBlur={() => setTimeFocused(false)}
            />
            {!form.time && !timeFocused && (
              <span className={styles.timePlaceholder}>Tidspunkt</span>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <input
            className={styles.input}
            type="number"
            min="0"
            value={form.minAge}
            onChange={e => setField("minAge", e.target.value)}
            placeholder="Alder (min.)"
          />
          <input
            className={styles.input}
            type="number"
            min="0"
            value={form.maxAge}
            onChange={e => setField("maxAge", e.target.value)}
            placeholder="Alder (max.)"
          />
        </div>

        <div className={styles.row}>
          <input
            className={styles.input}
            value={instructorName}
            readOnly
            placeholder="Instruktør"
          />
          <input
            className={styles.input}
            type="number"
            min="1"
            value={form.maxParticipants}
            onChange={e => setField("maxParticipants", e.target.value)}
            placeholder="Deltagere (max.)"
          />
        </div>

        <div className={styles.fileRow}>
          <span className={styles.fileLabel}>Billede:</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className={styles.hiddenFile}
            onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          />
          <button type="button" className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
            Gennemse...
          </button>
          <span className={styles.fileName}>{imageFile?.name ?? "Ingen fil valgt"}</span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.btn} type="submit" disabled={submitting}>
          {submitting ? "Opretter..." : "Opret hold"}
        </button>

      </form>
    </main>
  )
}
