import Link from "next/link"
import { FiHome } from "react-icons/fi"
import { FaListUl, FaUser } from "react-icons/fa"

export default function Footer() {
  return (
    <footer>
      <nav className="footer-nav" aria-label="Bundnavigation">
        <ul>
          <li>
            <Link href="/activities">
              <FiHome className="footer-icon" /> Home
            </Link>
          </li>
          <li>
            <Link href="/activities">
              <FaListUl className="footer-icon" /> Aktiviteter
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <FaUser className="footer-icon" /> Profil
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}