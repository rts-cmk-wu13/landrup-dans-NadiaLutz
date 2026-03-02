"use client"

import { useActionState } from "react"
import { editActivityAction } from "./actions"
import styles from "./editActivity.module.scss"

const WEEKDAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]

export default function EditActivityForm({ activity, id }) {
  const [state, action, isPending] = useActionState(
    editActivityAction.bind(null, id),
    null
  )

  return (
    <form className={styles.form} action={action}>
      <label className={styles.label}>
        Navn
        <input
          className={styles.input}
          name="name"
          defaultValue={activity.name ?? ""}
        />
      </label>
      {state?.errors?.name && (
        <p className={styles.error}>{state.errors.name[0]}</p>
      )}

      <label className={styles.label}>
        Ugedag
        <select
          className={styles.input}
          name="weekday"
          defaultValue={activity.weekday ?? ""}
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
          name="time"
          defaultValue={activity.time ?? ""}
        />
      </label>

      <div className={styles.row}>
        <label className={styles.label}>
          Min. alder
          <input
            className={styles.input}
            type="number"
            min="0"
            name="minAge"
            defaultValue={activity.minAge ?? ""}
          />
        </label>
        <label className={styles.label}>
          Max. alder
          <input
            className={styles.input}
            type="number"
            min="0"
            name="maxAge"
            defaultValue={activity.maxAge ?? ""}
          />
        </label>
      </div>

      <label className={styles.label}>
        Max. deltagere
        <input
          className={styles.input}
          type="number"
          min="1"
          name="maxParticipants"
          defaultValue={activity.maxParticipants ?? ""}
        />
      </label>

      <label className={styles.label}>
        Beskrivelse
        <textarea
          className={styles.textarea}
          name="description"
          rows={4}
          defaultValue={activity.description ?? ""}
        />
      </label>

      {state?.error && <p className={styles.error}>{state.error}</p>}

      <button className={styles.btn} type="submit" disabled={isPending}>
        {isPending ? "Gemmer..." : "Gem ændringer"}
      </button>
    </form>
  )
}
