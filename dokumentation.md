# Landrup Dans
Nadia Lützhøft, WU13

Landrup Dans er en webapplikation for en danseskole, hvor medlemmer kan tilmelde sig hold og instruktører kan oprette og administrere egne hold. Projektet kommunikerer med en ekstern REST API.


## Tech stack

- **Next.js 15** – Jeg valgte Next.js fordi det giver mig Server Actions og API-routes ud af boksen, uden at jeg selv skal sætte en backend op. Server Actions betyder at formhåndtering og validering sker på serveren, og API-routes bruger jeg som proxy så auth-tokens aldrig rører browseren.

- **React 19** – Jeg bruger `useActionState` til at koble Server Actions direkte til formularer, så jeg slipper for at styre fetch-kald og fejlstate manuelt fra klienten. Det gør formkoden meget kortere og mere overskuelig.

- **Zod** – Jeg ville have ét sted, der validerer input og giver brugbare fejlbeskeder, uden at jeg selv skriver en masse if-sætninger. Zod kører serverside inden data når API'et, og med `z.preprocess()` håndterer jeg at formdata altid ankommer som strings, selvom feltet skal være et tal.

- **SASS Modules** – Jeg valgte SASS Modules frem for fx Tailwind, fordi jeg finder det mere overskueligt at arbejde med og har mest erfaring med det. Modules sikrer at mine klasser ikke konflikter på tværs af komponenter, og `_tokens.scss` samler alle farver ét sted.

- **Landrup Dans API** – ekstern REST API.


## Kodeeksempel

Jeg har valgt `CalendarPage` som eksempel, fordi den viser flere centrale mønstre på én gang: autentificering, rolle-baseret routing og datahåndtering med React hooks.

```javascript
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getMe } from "@/lib/auth"
import { getUserActivities } from "@/lib/rules"
import { formatWeekday } from "@/lib/weekday"
import styles from "./calendar.module.scss"

const WEEKDAY_ORDER = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"]

export default function CalendarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    async function load() {
      const meRes = await getMe()
      if (!meRes.ok) {
        router.push("/login")
        return
      }

      const user = meRes.data
      if (user.role === "instructor") {
        router.replace("/calendar/instructor")
        return
      }

      setActivities(getUserActivities(user))
      setLoading(false)
    }
    load()
  }, [router])

  const byWeekday = WEEKDAY_ORDER
    .map(day => ({
      day,
      label: formatWeekday(day),
      acts: activities.filter(a => a.weekday?.toLowerCase() === day)
    }))
    .filter(g => g.acts.length > 0)

  if (loading) return <main className={styles.page}><p>Indlæser...</p></main>

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Min kalender</h1>

      {byWeekday.length === 0 ? (
        <p className={styles.empty}>Du er ikke tilmeldt nogen aktiviteter endnu.</p>
      ) : (
        byWeekday.map(({ day, label, acts }) => (
          <section key={day} className={styles.daySection}>
            <h2 className={styles.dayLabel}>{label}</h2>
            <ul className={styles.list}>
              {acts.map(a => (
                <li key={a.id} className={styles.item}>
                  <span className={styles.activityName}>{a.name}</span>
                  {a.time && <span className={styles.activityTime}>{a.time}</span>}
                  <Link href={`/activities/${a.id}`} className={styles.link}>Se hold</Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  )
}
```

## Beskrivelse af koden

`CalendarPage` er en klientkomponent (`"use client"`), der viser brugerens tilmeldte aktiviteter sorteret efter ugedag.

Når komponenten loader, kører `useEffect` og kalder `getMe()` for at tjekke om brugeren er logget ind. Er de ikke det, sendes de til `/login`. Er de instruktør, omdirigeres de til `/calendar/instructor`, da instruktører har en separat visning.

Er brugeren et almindeligt medlem, hentes aktiviteterne via `getUserActivities(user)` og gemmes i state. De grupperes derefter efter `WEEKDAY_ORDER`, så de altid vises fra mandag til søndag. Siden viser enten en loading-tekst, en tom-besked eller aktiviteterne — afhængigt af state.


## Perspektivering

Undervejs migrerede jeg fra egne klientside-formfunktioner til Next.js Server Actions med `useActionState`. Det var en større omskrivning, men resultatet er mere sikkert og lettere at arbejde med: validering og API-kald sker på serveren, og formularen håndterer selv fejlbeskeder og pending-tilstand uden ekstra logik i klienten.

Noget af det sværeste i projektet var at finde ud af, hvordan den eksterne API forventede data. Jeg sendte længe requests som JSON, men API'et bruger `express-formidable`, som kun parser `multipart/form-data` — så felterne var bare tomme på serveren uden nogen fejlmelding. En anden bug var i min proxy: ved sletning returnerer API'et `204 No Content`, men jeg forsøgte at oprette `new Response("", { status: 204 })`, hvilket kaster en `TypeError` fordi Fetch-specifikationen forbyder en body på 204-responses. Proxyen crashede, aktiviteten blev slettet i databasen, men UI'et opdaterede sig ikke. Begge bugs krævede lidt detektivarbejde at finde.

Hvis projektet skulle videreudvikles, ville jeg kigge på:

- **Serverside datahentning** — mange sider henter data med `useEffect`, som giver en loading-spinner. Med Server Components ville data allerede være klar når siden loader.
- **Billedoptimering** — billeder vises med `<img>`, men Next.js's `<Image>`-komponent giver lazy loading og automatisk størrelsesjustering.
- **Bedre API-fejlbeskeder** — den eksterne API returnerer generiske 500-fejl uden forklaring, hvilket gør fejlfinding svær. Et mere robust API ville returnere strukturerede fejlbeskeder.
- **Tests** — projektet har ingen automatiserede tests. Unit tests på Zod-skemaerne og integrationstests på server actions ville gøre det tryggere at ændre i koden fremover.
