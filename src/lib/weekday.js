
const MAP = {
  mandag: "Mandag",
  tirsdag: "Tirsdag",
  onsdag: "Onsdag",
  torsdag: "Torsdag",
  fredag: "Fredag",
  lørdag: "Lørdag",
  søndag: "Søndag",
};

export function formatWeekday(value) {
  const key = String(value || "").trim().toLowerCase();
  return MAP[key] || (key ? key[0].toUpperCase() + key.slice(1) : "");
}