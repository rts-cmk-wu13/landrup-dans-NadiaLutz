
export default function ProfileHeader({ user }) {
  const first = user?.firstname || user?.firstName || "";
  const last = user?.lastname || user?.lastName || "";
  const name = [first, last].filter(Boolean).join(" ").trim() || user?.username || "";
  const role = user?.role || "";

  return (
    <header>
      <h1 style={{ marginTop: 0 }}>My profile</h1>
      <p style={{ margin: 0 }}>{name}</p>
      {role ? <p style={{ margin: 0, opacity: 0.8 }}>{role}</p> : null}
    </header>
  );
}