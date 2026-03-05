"use client"

import styles from "./Hero.module.scss"
import Link from "next/link"
import Brand from "@/components/Brand"
import { useEffect, useState } from "react"
import { getSession, logout } from "@/lib/auth"
import { FiChevronDown } from "react-icons/fi"

export default function Hero() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then((res) => {
      setLoggedIn(res.ok && res.data?.loggedIn)
      setLoading(false)
    })
  }, [])

  async function onLogout() {
    await logout()
    setLoggedIn(false)
  }

  return (
    <section className={styles.intro}>
      <Brand large />
      <div className={styles.heroBottom}>
        {!loading && (
          loggedIn ? (
            <button className={styles.heroButton} onClick={onLogout}>
              Log ud
            </button>
          ) : (
            <Link className={styles.heroButton} href="/login">
              Log ind her
            </Link>
          )
        )}
        <a href="#vores-holdtyper" className={styles.scrollArrow} aria-label="Scroll til Vores holdtyper">
          <FiChevronDown size={90} strokeWidth={0.5} />
          <FiChevronDown size={90} strokeWidth={0.5} />
        </a>
      </div>
    </section>
  )
}