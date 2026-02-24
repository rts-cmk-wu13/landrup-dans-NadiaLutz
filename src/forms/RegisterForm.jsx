
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ldFetch } from "@/lib/api";
import { validateRegister } from "@/lib/validators";

export default function RegisterForm({ className }) {
  const router = useRouter();

  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    username: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    const v = validateRegister(values);
    const firstError =
      v.errors.firstname ||
      v.errors.lastname ||
      v.errors.username ||
      v.errors.age ||
      v.errors.password ||
      v.errors.confirmPassword;

    if (firstError) {
      setStatus({ type: "error", message: firstError });
      return;
    }


    const form = new URLSearchParams();
    form.set("username", v.values.username);
    form.set("password", v.values.password);
    form.set("firstname", v.values.firstname);
    form.set("lastname", v.values.lastname);
    form.set("age", String(v.values.age));
    form.set("role", "default");

    setIsSubmitting(true);
    const res = await ldFetch("/api/v1/users", {
      method: "POST",
      body: form,
    });
    setIsSubmitting(false);

    if (!res.ok) {
      const msg = res.data?.error || res.data?.message || "Registration failed. Please try again.";
      setStatus({ type: "error", message: msg });
      return;
    }

    setStatus({ type: "success", message: "Account created. You can now log in." });
    router.push("/login");
  }

  return (
    <form className={className} onSubmit={onSubmit} noValidate>
      <input
        type="text"
        placeholder="Fornavn"
        id="firstname"
        name="firstname"
        value={values.firstname}
        onChange={(e) => setField("firstname", e.target.value)}
        autoComplete="given-name"
        required
      />
      <input
        type="text"
        placeholder="Efternavn"
        id="lastname"
        name="lastname"
        value={values.lastname}
        onChange={(e) => setField("lastname", e.target.value)}
        autoComplete="family-name"
        required
      />
      <input
        type="text"
        placeholder="Brugernavn"
        id="username"
        name="username"
        value={values.username}
        onChange={(e) => setField("username", e.target.value)}
        autoComplete="username"
        required
      />
      <input
        type="number"
        placeholder="Alder"
        id="age"
        name="age"
        value={values.age}
        onChange={(e) => setField("age", e.target.value)}
        inputMode="numeric"
        required
      />
      <input
        type="password"
        placeholder="Adgangskode"
        id="password"
        name="password"
        value={values.password}
        onChange={(e) => setField("password", e.target.value)}
        autoComplete="new-password"
        required
      />
      <input
        type="password"
        placeholder="Gentag adgangskode"
        id="confirmPassword"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={(e) => setField("confirmPassword", e.target.value)}
        autoComplete="new-password"
        required
      />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logger ind..." : "Log ind"}
      </button>

      {status.type !== "idle" ? (
        <p role={status.type === "error" ? "alert" : undefined}>{status.message}</p>
      ) : null}
    </form>
  );
}