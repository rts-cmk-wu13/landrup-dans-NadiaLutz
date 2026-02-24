"use client"

import { useEffect, useState } from "react"
import { ldFetch } from "@/lib/api"
import ActivityList from "@/activities/ActivityList"
import SearchBar from "@/activities/SearchBar"
import styles from "./activities.module.scss"

export default function ActivitiesPage() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      const res = await ldFetch("/api/v1/activities", { method: "GET" })
      if (res.ok) setItems(res.data)
      setLoading(false)
    }
    fetchActivities()
  }, [])

  const filtered = query
    ? items.filter(a => {
        const q = query.toLowerCase()
        const instructor = a.instructor
          ? `${a.instructor.firstname} ${a.instructor.lastname}`
          : ""
        return (
          a.name?.toLowerCase().includes(q) ||
          a.weekday?.toLowerCase().includes(q) ||
          instructor.toLowerCase().includes(q)
        )
      })
    : items

  return (
    <main className={styles.activitiesPage}>
      <header className={styles.header}>
        {!searchOpen && <h1 className={styles.title}>Aktiviteter</h1>}
        <SearchBar
          value={query}
          onChange={setQuery}
          open={searchOpen}
          onOpen={() => setSearchOpen(true)}
          onClose={() => { setSearchOpen(false); setQuery("") }}
        />
      </header>

      {loading && <p>Indlæser...</p>}

      {!loading && filtered.length === 0 && (
        <p className={styles.empty}>Ingen aktiviteter fundet. Prøv en anden søgning.</p>
      )}

      {!loading && filtered.length > 0 && (
        <ActivityList activities={filtered} />
      )}
    </main>
  )
}
