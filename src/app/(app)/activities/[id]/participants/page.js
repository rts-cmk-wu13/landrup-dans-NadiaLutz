
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ldFetch } from "@/lib/api";
import { getSession, getMe } from "@/lib/auth";

function fullName(u) {
  const first = u?.firstname || u?.firstName || "";
  const last = u?.lastname || u?.lastName || "";
  return [first, last].filter(Boolean).join(" ").trim();
}

export default function ParticipantsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [participants, setParticipants] = useState([]);
  const [activityName, setActivityName] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus({ type: "loading", message: "" });

      const sessionRes = await getSession();
      if (cancelled) return;
      if (!sessionRes.ok || !sessionRes.data?.loggedIn) {
        router.push("/login");
        return;
      }

      const meRes = await getMe();
      if (cancelled) return;
      if (!meRes.ok) {
        router.push("/login");
        return;
      }

      const user = meRes.data;
      if (user?.role !== "instructor") {
        setStatus({ type: "error", message: "This page is only available to instructors." });
        return;
      }

      const actRes = await ldFetch(`/api/v1/activities/${encodeURIComponent(id)}`, { method: "GET" });
      if (cancelled) return;
      if (!actRes.ok) {
        setStatus({ type: "error", message: "Could not load activity." });
        return;
      }
      setActivityName(actRes.data?.name || "");


      const rosterRes = await ldFetch(
        `/api/v1/users/${encodeURIComponent(user.id)}/roster/${encodeURIComponent(id)}`,
        { method: "GET" }
      );
      if (cancelled) return;
      if (!rosterRes.ok) {
        setStatus({ type: "error", message: "Could not load participants." });
        return;
      }

      setParticipants(Array.isArray(rosterRes.data) ? rosterRes.data : []);
      setStatus({ type: "ready", message: "" });
    }

    if (id) run();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (status.type === "loading") {
    return <main style={{ padding: "1rem" }}><p>Loading...</p></main>;
  }

  if (status.type === "error") {
    return (
      <main style={{ padding: "1rem" }}>
        <p role="alert">{status.message}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h1 style={{ marginTop: 0 }}>Deltagerliste</h1>
      <p>{activityName}</p>

      {participants.length === 0 ? (
        <p>Ingen deltagere tilmeldt denne aktivitet.</p>
      ) : (
        <ul>
          {participants.map((u, i) => (
            <li key={`${fullName(u)}-${i}`}>
              {fullName(u) || "Deltager"}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}