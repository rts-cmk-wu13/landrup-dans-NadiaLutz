
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ldFetch } from "@/lib/api";
import { getSession, getMe } from "@/lib/auth";
import { canJoinActivity, isUserJoinedActivity } from "@/lib/rules";
import { formatWeekday } from "@/lib/weekday";

function normalizeActivity(raw) {
  if (!raw || typeof raw !== "object") return null;
  return {
    ...raw,
    id: raw.id,
    name: raw.name,
    description: raw.description,
    weekday: raw.weekday,
    time: raw.time,
    minAge: raw.minAge,
    maxAge: raw.maxAge,
  };
}

export default function ActivityDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [activity, setActivity] = useState(null);
  const [activityStatus, setActivityStatus] = useState({ type: "loading", message: "" });

  const [session, setSession] = useState({ loading: true, loggedIn: false, user: null });
  const [me, setMe] = useState(null);
  const [actionStatus, setActionStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setActivityStatus({ type: "loading", message: "" });
      const res = await ldFetch(`/api/v1/activities/${encodeURIComponent(id)}`, { method: "GET" });
      if (cancelled) return;
      if (!res.ok) {
        setActivity(null);
        setActivityStatus({ type: "error", message: "Could not load activity." });
        return;
      }
      setActivity(normalizeActivity(res.data));
      setActivityStatus({ type: "ready", message: "" });
    }

    if (id) run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const res = await getSession();
      if (cancelled) return;
      if (!res.ok || !res.data?.loggedIn) {
        setSession({ loading: false, loggedIn: false, user: null });
        setMe(null);
        return;
      }
      setSession({ loading: false, loggedIn: true, user: res.data.user || null });

      const meRes = await getMe();
      if (cancelled) return;
      if (meRes.ok) setMe(meRes.data);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const joined = useMemo(() => {
    if (!me || !id) return false;
    return isUserJoinedActivity(me, id);
  }, [me, id]);

  const joinCheck = useMemo(() => {
    if (!me || !activity) return { ok: false, reason: "" };
    return canJoinActivity(me, activity);
  }, [me, activity]);

  async function refreshMe() {
    const meRes = await getMe();
    if (meRes.ok) setMe(meRes.data);
  }

  async function onJoin() {
    if (!me || !activity) return;
    setActionStatus({ type: "idle", message: "" });

    const check = canJoinActivity(me, activity);
    if (!check.ok) {
      setActionStatus({ type: "error", message: check.reason || "You cannot join this activity." });
      return;
    }

    setIsSubmitting(true);
    const res = await ldFetch(
      `/api/v1/users/${encodeURIComponent(me.id)}/activities/${encodeURIComponent(activity.id)}`,
      { method: "POST" }
    );
    setIsSubmitting(false);

    if (!res.ok) {
      setActionStatus({ type: "error", message: res.data?.error || "Failed to join activity." });
      return;
    }

    await refreshMe();
    setActionStatus({ type: "success", message: "You have joined this activity." });
  }

  async function onLeave() {
    if (!me || !activity) return;
    setActionStatus({ type: "idle", message: "" });

    setIsSubmitting(true);
    const res = await ldFetch(
      `/api/v1/users/${encodeURIComponent(me.id)}/activities/${encodeURIComponent(activity.id)}`,
      { method: "DELETE" }
    );
    setIsSubmitting(false);

    if (!res.ok) {
      setActionStatus({ type: "error", message: res.data?.error || "Failed to leave activity." });
      return;
    }

    await refreshMe();
    setActionStatus({ type: "success", message: "You have left this activity." });
  }

  if (activityStatus.type === "loading") {
    return <main style={{ padding: "1rem" }}><p>Loading...</p></main>;
  }

  if (activityStatus.type === "error") {
    return (
      <main style={{ padding: "1rem" }}>
        <p role="alert">{activityStatus.message}</p>
      </main>
    );
  }

  if (!activity) {
    return (
      <main style={{ padding: "1rem" }}>
        <p>Activity not found.</p>
      </main>
    );
  }

  const weekday = formatWeekday(activity.weekday);
  const time = activity.time || "";
  const ageText =
    Number.isFinite(Number(activity.minAge)) || Number.isFinite(Number(activity.maxAge))
      ? `${activity.minAge ?? ""}-${activity.maxAge ?? ""}`
      : "";

  return (
    <main style={{ padding: "1rem" }}>
      <h1 style={{ marginTop: 0 }}>{activity.name}</h1>
      <p>
        {weekday}{weekday && time ? " · " : ""}{time}
      </p>
      {ageText ? <p>Age: {ageText}</p> : null}
      {activity.description ? <p>{activity.description}</p> : null}

      {!session.loading && session.loggedIn ? (
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            onClick={joined ? onLeave : onJoin}
            disabled={isSubmitting || (!joined && !joinCheck.ok)}
          >
            {joined ? "Forlad" : "Tilmeld"}
          </button>

          {!joined && !joinCheck.ok && joinCheck.reason ? (
            <p role="alert" style={{ marginTop: ".75rem" }}>{joinCheck.reason}</p>
          ) : null}

          {actionStatus.type !== "idle" ? (
            <p
              role={actionStatus.type === "error" ? "alert" : undefined}
              style={{ marginTop: ".75rem" }}
            >
              {actionStatus.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}