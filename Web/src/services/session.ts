const SESSION_KEY = "car-dekho-session-id";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Returns a stable per-user session id, creating and persisting one on first
 * use. The backend shortlist endpoints are keyed on this id.
 */
export function getSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id = generateId();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return generateId();
  }
}
