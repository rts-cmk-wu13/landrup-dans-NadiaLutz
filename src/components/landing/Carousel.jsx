"use client"
import { GrFormPrevious } from "react-icons/gr";
import { MdNavigateNext } from "react-icons/md";
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
        setStatus({ type: "error", message: "Could not load testimonials right now." })
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
    return () => { cancelled = true }
  }, [])

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
    const nextIndex = (index - 1 + normalized.length) % normalized.length
    setIndex(nextIndex)
    scrollTo(nextIndex)
  }

  function next() {
    const nextIndex = (index + 1) % normalized.length
    setIndex(nextIndex)
    scrollTo(nextIndex)
  }

  return (
    <section className={styles.carouselSection}>
    <h1 className={styles.title}>Det siger vores kunder om os</h1>
    <div className={styles.carousel}>
      {status.type === "loading" && (
        <p className={styles.stateText}>Henter anmeldelser...</p>
      )}
      {status.type === "error" && (
        <p className={styles.stateText}>{status.message}</p>
      )}
      {status.type === "ready" && normalized.length === 0 && (
        <p className={styles.stateText}>No testimonials available.</p>
      )}
      {status.type === "ready" && normalized.length > 0 && (
        <div className={styles.track} ref={trackRef}>
          {normalized.map((t, i) => (
            <div key={t.id} className={styles.card}>
              <p className={styles.text}>{t.text}</p>
              <p className={styles.name}>{t.name}</p>
              {t.occupation && <p className={styles.occupation}>{t.occupation}</p>}
            </div>
          ))}
        </div>
      
      )}

      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={prev} aria-label="Previous">
          <GrFormPrevious />
        </button>
        <button className={styles.controlBtn} onClick={next} aria-label="Next">
          <MdNavigateNext />
        </button>
      </div>
    </div>
      </section>
  )
}