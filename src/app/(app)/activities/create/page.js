"use client"

import { useEffect, useRef, useState, useActionState } from "react"
import { getMe } from "@/lib/auth"
import { createActivityAction } from "./actions"
import styles from "./createActivity.module.scss"

const WEEKDAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]

export default function CreateActivityPage() {
  const fileRef = useRef(null)
  const [me, setMe] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [timeHasValue, setTimeHasValue] = useState(false)
  const [timeFocused, setTimeFocused] = useState(false)
  const [state, action, isPending] = useActionState(createActivityAction, null)

  useEffect(() => {
    getMe().then(res => { if (res.ok) setMe(res.data) })
  }, [])

  const instructorName = me
    ? `${me.firstname || me.firstName || ""} ${me.lastname || me.lastName || ""}`.trim() || me.username || ""
    : ""

  return (
    <main className={styles.formPage}>
      <h1 className={styles.title}>Opret hold</h1>
      <form className={styles.form} action={action}>

        <input
          className={styles.input}
          name="name"
          placeholder="Holdnavn"
        />
        {state?.errors?.name && (
          <p className={styles.error}>{state.errors.name[0]}</p>
        )}

        <textarea
          className={styles.textarea}
          name="description"
          rows={4}
          placeholder="Beskrivelse"
        />

        <div className={styles.row}>
          <select className={styles.input} name="weekday">
            <option value="">Ugedag</option>
            {WEEKDAYS.map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>

          <div className={`${styles.timeWrapper} ${!timeHasValue && !timeFocused ? styles.timeEmpty : ""}`}>
            <input
              className={styles.input}
              type="time"
              name="time"
              onChange={e => setTimeHasValue(!!e.target.value)}
              onFocus={() => setTimeFocused(true)}
              onBlur={() => setTimeFocused(false)}
            />
            {!timeHasValue && !timeFocused && (
              <span className={styles.timePlaceholder}>Tidspunkt</span>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <input
            className={styles.input}
            type="number"
            min="0"
            name="minAge"
            placeholder="Alder (min.)"
          />
          <input
            className={styles.input}
            type="number"
            min="0"
            name="maxAge"
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
            name="maxParticipants"
            placeholder="Deltagere (max.)"
          />
        </div>

        <div className={styles.fileRow}>
          <span className={styles.fileLabel}>Billede:</span>
          <input
            ref={fileRef}
            type="file"
            name="file"
            accept="image/*"
            className={styles.hiddenFile}
            onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          />
          <div className={styles.fileInputRow}>
            <button type="button" className={styles.fileBtn} onClick={() => fileRef.current?.click()}>
              Gennemse...
            </button>
            <span className={styles.fileName}>{imageFile?.name ?? "Ingen fil valgt"}</span>
          </div>
          {state?.errors?.file && (
            <p className={styles.error}>{state.errors.file[0]}</p>
          )}
        </div>

        {state?.error && <p className={styles.error}>{state.error}</p>}

        <button className={styles.btn} type="submit" disabled={isPending}>
          {isPending ? "Opretter..." : "Opret hold"}
        </button>

      </form>
    </main>
  )
}
