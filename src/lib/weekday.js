
const MAP = {
  mandag: "Monday",
  tirsdag: "Tuesday",
  onsdag: "Wednesday",
  torsdag: "Thursday",
  fredag: "Friday",
  lørdag: "Saturday",
  søndag: "Sunday",
};

export function formatWeekday(value) {
  const key = String(value || "").trim().toLowerCase();
  return MAP[key] || (key ? key[0].toUpperCase() + key.slice(1) : "");
}