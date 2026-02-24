import styles from "./ProfileHeader.module.scss";

export default function ProfileHeader({ user }) {
  const first = user?.firstname || user?.firstName || "";
  const last = user?.lastname || user?.lastName || "";
  const name = [first, last].filter(Boolean).join(" ").trim() || user?.username || "";
  const roleMap = { default: "Medlem", instructor: "Instruktør" };
  const role = roleMap[user?.role] ?? user?.role ?? "";

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Min profil</h1>
      <p className={styles.name}>{name}</p>
      {role ? <p className={styles.role}>{role}</p> : null}
    </header>
  );
}