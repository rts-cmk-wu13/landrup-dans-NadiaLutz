
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export function validateLogin(values) {
  const username = String(values?.username || "").trim();
  const password = String(values?.password || "");
  const rememberMe = Boolean(values?.rememberMe);

  const errors = {};
  if (!isNonEmptyString(username)) errors.username = "Username is required.";
  if (!isNonEmptyString(password)) errors.password = "Password is required.";

  return { values: { username, password, rememberMe }, errors };
}

export function validateRegister(values) {
  const firstname = String(values?.firstname || "").trim();
  const lastname = String(values?.lastname || "").trim();
  const username = String(values?.username || "").trim();
  const ageRaw = String(values?.age ?? "").trim();
  const age = Number(ageRaw);
  const password = String(values?.password || "");
  const confirmPassword = String(values?.confirmPassword || "");

  const errors = {};
  if (!isNonEmptyString(firstname)) errors.firstname = "First name is required.";
  if (!isNonEmptyString(lastname)) errors.lastname = "Last name is required.";
  if (!isNonEmptyString(username)) errors.username = "Username is required.";

  if (!Number.isFinite(age) || age <= 0) errors.age = "Please enter a valid age.";

  if (!isNonEmptyString(password)) errors.password = "Password is required.";
  else if (password.length < 4) errors.password = "Password must be at least 4 characters.";

  if (!isNonEmptyString(confirmPassword)) errors.confirmPassword = "Please confirm your password.";
  else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";

  return {
    values: { firstname, lastname, username, age, password, confirmPassword },
    errors,
  };
}

export function validateNewsletter(values) {
  const email = String(values?.email || "").trim();
  const errors = {};
  if (!isNonEmptyString(email)) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
  return { values: { email }, errors };
}

export function validateContact(values) {
  const name = String(values?.name || "").trim();
  const email = String(values?.email || "").trim();
  const message = String(values?.message || "").trim();

  const errors = {};
  if (!isNonEmptyString(name)) errors.name = "Name is required.";
  if (!isNonEmptyString(email)) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email.";
  if (!isNonEmptyString(message)) errors.message = "Message is required.";

  return { values: { name, email, message }, errors };
}