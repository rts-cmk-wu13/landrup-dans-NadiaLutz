"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ldFetch } from "@/lib/api";
import { getSession, getMe, logout } from "@/lib/auth";
import ProfileHeader from "@/profile/ProfileHeader";
import ProfileActivities from "@/profile/ProfileActivities";
import { getUserActivities } from "@/lib/rules";

function getInstructorId(user) {
  const id = user?.id;
  return id ? String(id) : "";
}

function activityInstructorId(activity) {
  const i = activity?.instructor;
  return String(i?.id || activity?.instructorId || "");
}

export default function ProfilePage() {
  const [status, setStatus] = useState({ type: "loading", message: "" });
  const [session, setSession] = useState({ loggedIn: false, user: null });
  const [me, setMe] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus({ type: "loading", message: "" });
      const s = await getSession();
      if (cancelled) return;

      if (!s.ok || !s.data?.loggedIn) {
        setSession({ loggedIn: false, user: null });
        setMe(null);
        setStatus({ type: "ready", message: "" });
        return;
      }

      setSession({ loggedIn: true, user: s.data.user || null });

      const meRes = await getMe();
      if (cancelled) return;
      if (!meRes.ok) {
        setStatus({ type: "error", message: "Could not load your profile." });
        return;
      }

      setMe(meRes.data);

      const allActs = await ldFetch("/api/v1/activities", { method: "GET" });
      if (cancelled) return;
      setActivities(Array.isArray(allActs.data) ? allActs.data : []);

      setStatus({ type: "ready", message: "" });
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const isInstructor = me?.role === "instructor";

  const myActivities = useMemo(() => {
    if (!me) return [];
    if (!isInstructor) return getUserActivities(me);

    const myId = getInstructorId(me);
    return activities.filter((a) => activityInstructorId(a) === myId);
  }, [me, isInstructor, activities]);

  async function onLogout() {
    await logout();
    window.location.href = "/";
  }

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

  if (!session.loggedIn) {
    return (
      <main style={{ padding: "1rem" }}>
        <h1 style={{ marginTop: 0 }}>My profile</h1>
        <p>You are not logged in.</p>
        <Link href="/login">Go to login</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "1rem" }}>
      <ProfileHeader user={me || session.user} />
      <button type="button" onClick={onLogout}>Log out</button>
      {!isInstructor ? (
        <ProfileActivities title="Tilmeldte hold" activities={myActivities} variant="default" />
      ) : (
        <ProfileActivities title="Mine aktiviteter" activities={myActivities} variant="instructor" />
      )}
    </main>
  );
}