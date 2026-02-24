import { FaUser } from "react-icons/fa6";
import styles from "./ProfileHeader.module.scss"

export default function ProfileHeader({ user }) {
  const first = user?.firstname || user?.firstName || ""
  const last = user?.lastname || user?.lastName || ""
  const name = [first, last].filter(Boolean).join(" ").trim() || user?.username || ""
  const roleMap = { default: "Medlem", instructor: "Instruktør" }
  const role = roleMap[user?.role] ?? user?.role ?? ""

  return (
    <header className={styles.profileHeader}>
      <h1 className={styles.pageTitle}>Min profil</h1>
      <div className={styles.card}>
        <div className={styles.avatar}>
 <FaUser />
        </div>
        <p className={styles.name}>{name}</p>
        {role && <p className={styles.role}>{role}</p>}
      </div>
    </header>
  )
}
