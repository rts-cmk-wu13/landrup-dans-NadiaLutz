
const weekdays = {
  mandag: "Mandag",
  tirsdag: "Tirsdag",
  onsdag: "Onsdag",
  torsdag: "Torsdag",
  fredag: "Fredag",
  lørdag: "Lørdag",
  søndag: "Søndag",
}

export function formatWeekday(value) {
  if (!value) return ""
  const key = value.trim().toLowerCase()
  return weekdays[key] || value
}
