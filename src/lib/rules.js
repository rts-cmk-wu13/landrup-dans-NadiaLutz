
export function getUserActivities(user) {
  return user?.activities || user?.classes || []
}

export function isUserJoinedActivity(user, activityId) {
  const acts = getUserActivities(user)
  return acts.some((a) => String(a.id) === String(activityId))
}

export function canJoinActivity(user, activity) {
  if (!user || !activity) return { ok: false, reason: "Missing data." }

  const age = Number(user.age)
  const min = Number(activity.minAge)
  const max = Number(activity.maxAge)

  if (min && age < min) {
    return { ok: false, reason: `You must be at least ${min} years old to join.` }
  }

  if (max && age > max) {
    return { ok: false, reason: `You must be ${max} years old or younger to join.` }
  }

  const maxP = Number(activity.maxParticipants)
  const enrolled = activity.users?.length || 0

  if (maxP > 0 && enrolled >= maxP) {
    return { ok: false, reason: `Holdet er fuldt (max ${maxP} deltagere).` }
  }

  return { ok: true, reason: "" }
}
