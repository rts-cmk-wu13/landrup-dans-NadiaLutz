
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();


  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return <main style={{ padding: "1rem" }}><p>Redirecting...</p></main>;
}