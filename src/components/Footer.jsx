"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiHome } from "react-icons/fi"
import { FaListUl, FaUser } from "react-icons/fa"
import styles from "./Footer.module.scss"

export default function Footer() {
  const pathname = usePathname()

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav} aria-label="Bundnavigation">
        <ul>
          <li>
            <Link href="/" className={pathname === "/" ? styles.active : ""}>
              <FiHome className={styles.icon} />
              Home
            </Link>
          </li>
          <li>
            <Link href="/activities" className={pathname.startsWith("/activities") ? styles.active : ""}>
              <FaListUl className={styles.icon} />
              Aktiviteter
            </Link>
          </li>
          <li>
            <Link href="/profile" className={pathname.startsWith("/profile") ? styles.active : ""}>
              <FaUser className={styles.icon} />
              Profil
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}