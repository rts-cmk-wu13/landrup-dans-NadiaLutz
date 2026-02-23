"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import styles from "./Carousel.module.scss"
import { ldFetch } from "@/lib/api"

export default function Carousel() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState({ type: "loading", message: "" })
  const [index, setIndex] = useState(0)
  const trackRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setStatus({ type: "loading", message: "" })

const res = await ldFetch("/api/v1/testimonials", { method: "GET" })
      if (cancelled) return

      if (!res.ok) {
        setStatus({
          type: "error",
          message: "Could not load testimonials right now.",
        })
        setItems([])
        return
      }

      const arr = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : []

      setItems(arr)
      setStatus({ type: "ready", message: "" })
      setIndex(0)
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  const canPrev = index > 0
  const canNext = index < items.length - 1

  const normalized = useMemo(() => {
    return items.map((t, i) => {
      const name = t?.name || `Person ${i + 1}`
      const text = t?.content || ""
      const occupation = t?.occupation || ""
      return { id: t?.id ?? i, name, text, occupation }
    })
  }, [items])

  function scrollTo(nextIndex) {
    const el = trackRef.current
    if (!el) return
    const child = el.children?.[nextIndex]
    if (child && typeof child.scrollIntoView === "function") {
      child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }

  function prev() {
    if (!canPrev) return
    const nextIndex = index - 1
    setIndex(nextIndex)
    scrollTo(nextIndex)
  }

  function next() {
    if (!canNext) return
    const nextIndex = index + 1
    setIndex(nextIndex)
    scrollTo(nextIndex)
  }

  return (
    <section className={styles.carousel} aria-label="Testimonials">
      <div className={styles.header}>
        <h1 className={styles.title}>Testimonials</h1>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous testimonial"
          >
            Prev
          </button>
          <button
            type="button"
            className={styles.controlBtn}
            onClick={next}
            disabled={!canNext}
            aria-label="Next testimonial"
          >
            Next
          </button>
        </div>
      </div>

      {status.type === "loading" ? (
        <p className={styles.stateText}>Loading testimonials...</p>
      ) : null}

      {status.type === "error" ? (
        <p className={styles.stateText} role="alert">
          {status.message}
        </p>
      ) : null}

      {status.type === "ready" && normalized.length === 0 ? (
        <p className={styles.stateText}>No testimonials available.</p>
      ) : null}

      {status.type === "ready" && normalized.length > 0 ? (
        <div ref={trackRef} className={styles.track}>
          {normalized.map((t, i) => (
            <article
              key={t.id}
              className={styles.card}
              aria-current={i === index ? "true" : undefined}
            >
              <p className={styles.text}>{t.text}</p>
              <p className={styles.name}>— {t.name}{t.occupation ? `, ${t.occupation}` : ""}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}