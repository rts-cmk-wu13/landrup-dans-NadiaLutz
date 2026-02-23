
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { validateLogin } from "@/lib/validators";

export default function LoginForm({ className, showRememberMe = false }) {
  const router = useRouter();

  const [values, setValues] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const v = validateLogin(values);
    const firstError = v.errors.username || v.errors.password;
    if (firstError) {
      setStatus({ type: "error", message: firstError });
      return;
    }

    setIsSubmitting(true);
    const res = await login(v.values);
    setIsSubmitting(false);

    if (!res.ok) {
      const msg = res.data?.error || res.data?.message || "Login failed. Please try again.";
      setStatus({ type: "error", message: msg });
      return;
    }

    router.push("/activities");
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Username"
        value={values.username}
        onChange={(e) => setField("username", e.target.value)}
        autoComplete="username"
        required
      />

      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        value={values.password}
        onChange={(e) => setField("password", e.target.value)}
        autoComplete="current-password"
        required
      />

      {showRememberMe ? (
        <label>
          <input
            type="checkbox"
            checked={values.rememberMe}
            onChange={(e) => setField("rememberMe", e.target.checked)}
          />
          Remember me
        </label>
      ) : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>

      {status.type !== "idle" ? (
        <p role={status.type === "error" ? "alert" : undefined}>{status.message}</p>
      ) : null}
    </form>
  );
}