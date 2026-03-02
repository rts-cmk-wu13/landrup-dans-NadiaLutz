import { serverFetch } from "@/lib/serverFetch"
import EditActivityForm from "./EditActivityForm"
import styles from "./editActivity.module.scss"

export default async function EditActivityPage({ params }) {
  const { id } = await params
  const res = await serverFetch(`/api/v1/activities/${id}`)

  if (!res.ok || !res.data) {
    return (
      <main className={styles.formPage}>
        <p>Aktivitet ikke fundet.</p>
      </main>
    )
  }

  return (
    <main className={styles.formPage}>
      <h1 className={styles.title}>Rediger hold</h1>
      <EditActivityForm activity={res.data} id={id} />
    </main>
  )
}
