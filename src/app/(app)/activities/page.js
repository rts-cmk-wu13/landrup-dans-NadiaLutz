
"use client";

import { useEffect, useMemo, useState } from "react";
import { ldFetch } from "@/lib/api";
import ActivityList from "@/activities/ActivityList";
import SearchBar from "@/activities/SearchBar";

function normalize(s) {
  return String(s || "").toLowerCase().trim();
}

function instructorText(a) {
  const i = a?.instructor;
  const first = i?.firstname || i?.firstName || a?.instructorFirstname;
  const last = i?.lastname || i?.lastName || a?.instructorLastname;
  const full = [first, last].filter(Boolean).join(" ").trim();
  return full || a?.instructorName || a?.instructor || "";
}

export default function ActivitiesPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus({ type: "loading", message: "" });
      const res = await ldFetch("/api/v1/activities", { method: "GET" });
      if (cancelled) return;

      if (!res.ok) {
        setItems([]);
        setStatus({ type: "error", message: "Could not load activities." });
        return;
      }

      setItems(Array.isArray(res.data) ? res.data : []);
      setStatus({ type: "ready", message: "" });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;
    return items.filter((a) => {
      const name = normalize(a?.name);
      const weekday = normalize(a?.weekday);
      const instructor = normalize(instructorText(a));
      return name.includes(q) || weekday.includes(q) || instructor.includes(q);
    });
  }, [items, query]);

  return (
    <main style={{ padding: "1rem" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <h1 style={{ margin: 0 }}>Activities</h1>
        <div style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by title, weekday or instructor"
          />
        </div>
      </header>

      {status.type === "loading" ? <p>Loading...</p> : null}

      {status.type === "error" ? <p role="alert">{status.message}</p> : null}

      {status.type === "ready" && filtered.length === 0 ? (
        <p>No activities were found. Try searching for something else.</p>
      ) : null}

      {status.type === "ready" && filtered.length > 0 ? (
        <ActivityList activities={filtered} />
      ) : null}
    </main>
  );
}