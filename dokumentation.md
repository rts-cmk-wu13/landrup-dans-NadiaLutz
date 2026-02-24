# Landrup Dans
Nadia Lützhøft, WU13

Landrup Dans er en webapplikation for en danseskole, hvor medlemmer kan se og tilmelde sig hold, og instruktører kan oprette og administrere deres egne hold. Applikationen er bygget som et skoleprojekt og kommunikerer med en ekstern REST API.


## Tech stack

- **Next.js** – React framework med fil-baseret routing og App Router. Jeg valgte dette framework, fordi mange strukturelle beslutninger allerede er truffet, fx hvordan routing og filstruktur fungerer, så jeg kunne fokusere på selve funktionaliteten.
- **React** – komponentbaseret UI med hooks til state og side-effekter
- **SASS Modules** – scope-ede styles per komponent, så klasserne ikke konflikter på tværs af siden
- **Landrup Dans API** – ekstern REST API til al data (brugere, aktiviteter, tilmeldinger)


## Kodeeksempel

Jeg har valgt `CalendarPage` som eksempel, fordi den demonstrerer flere centrale mønstre i projektet på én gang: autentificering, rolle-baseret routing og datahåndtering med React hooks.

```javascript
“use client”

import { useEffect, useState } from “react”
import Link from “next/link”
import { useRouter } from “next/navigation”
import { getMe } from “@/lib/auth”
import { getUserActivities } from “@/lib/rules”
import { formatWeekday } from “@/lib/weekday”
import styles from “./calendar.module.scss”

const WEEKDAY_ORDER = [“mandag”, “tirsdag”, “onsdag”, “torsdag”, “fredag”, “lørdag”, “søndag”]

export default function CalendarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    async function load() {
      const meRes = await getMe()
      if (!meRes.ok) {
        router.push(“/login”)
        return
      }

      const user = meRes.data
      if (user.role === “instructor”) {
        router.replace(“/calendar/instructor”)
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

`CalendarPage` er en klientkomponent i Next.js (`”use client”`), som viser brugerens tilmeldte aktiviteter opdelt efter ugedag. Komponenten bruger React hooks — `useEffect` til at hente data ved load og `useState` til at gemme resultatet.

Når komponenten loader, kører `useEffect`, som kalder `load()`. Her hentes brugerdata via `getMe()`, som tjekker sessionen mod API'et. Hvis brugeren ikke er logget ind, sendes vedkommende til `/login`. Hvis brugeren er instruktør, omdirigeres til `/calendar/instructor`, da instruktører har en separat kalendervisning.

Er brugeren et almindeligt medlem, hentes aktiviteterne via `getUserActivities(user)` og gemmes i state. Aktiviteterne grupperes derefter efter ugedag med `WEEKDAY_ORDER`, så de altid vises i korrekt rækkefølge fra mandag til søndag. Til sidst rendres siden betinget:

- Vises der stadig data: teksten “Indlæser…”
- Ingen tilmeldte aktiviteter: en tom-besked
- Ellers: aktiviteterne grupperet under hver ugedag


## Perspektivering

Projektet er bygget i Next.js, som er velegnet til produktion, fordi det giver en klar struktur og god skalerbarhed. Desuden håndterer Next.js API-proxying, hvilket jeg har brugt til at sende kald videre til den eksterne Landrup Dans API uden at eksponere tokens i browseren.

Jeg har benyttet små, genanvendelige komponenter som fx `Brand.jsx`:

```jsx
import styles from “./Brand.module.scss”

export default function Brand() {
  return (
    <article className={styles.brand}>
      <img className={styles.brandLogo} src=”/imgs/brand.png” alt=”Logo” />
      <img className={styles.brandName} src=”/imgs/brandname.png” alt=”Brand Name” />
      <hr className={styles.heroDivider} />
    </article>
  )
}
```

Dette betyder, at jeg ikke behøver at gentage kode — jeg implementerer blot `<Brand />` hvor det er nødvendigt. Det samme princip gælder for farvevariabler i `_tokens.scss`, som importeres og genbruges på tværs af alle stylesheets.

Derudover bruger jeg SASS frem for fx Tailwind, da jeg finder det mere overskueligt at arbejde med og har mest erfaring med det.