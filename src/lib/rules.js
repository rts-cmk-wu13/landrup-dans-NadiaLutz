
export function getUserActivities(user) {
  const acts = user?.activities ?? user?.classes ?? [];
  return Array.isArray(acts) ? acts : [];
}


export function isUserJoinedActivity(user, activityId) {
  const acts = getUserActivities(user);
  const id = String(activityId);
  return acts.some((a) => String(a?.id) === id);
}


export function canJoinActivity(user, activity) {
  if (!user || !activity) return { ok: false, reason: "Missing data." };

  const age = Number(user?.age);
  const min = Number(activity?.minAge);
  const max = Number(activity?.maxAge);

  if (Number.isFinite(min) && Number.isFinite(age) && age < min) {
    return { ok: false, reason: `You must be at least ${min} years old to join.` };
  }

  if (Number.isFinite(max) && Number.isFinite(age) && age > max) {
    return { ok: false, reason: `You must be ${max} years old or younger to join.` };
  }

  return { ok: true, reason: "" };
}