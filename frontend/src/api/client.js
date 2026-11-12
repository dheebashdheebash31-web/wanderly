// Central API client for talking to the Django REST Framework backend
// using session + CSRF authentication (cookies), not tokens.
//
// Default is "" (relative URLs) — this works when Django serves the built
// React app itself, so fetch() calls are same-origin and no CORS dance is
// needed. Set VITE_API_BASE_URL in a .env file only if the API is on a
// different origin than the page (e.g. running the Vite dev server
// separately on :5173 against Django on :8000) — see frontend/.env.example.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/** Call once when the app loads so the browser has a csrftoken cookie
 * before any POST/PUT/DELETE is attempted. */
export async function primeCsrfCookie() {
  await apiFetch("/api/csrf/", { method: "GET" });
}

/**
 * Thin wrapper around fetch() that:
 *  - always sends the session cookie (credentials: "include")
 *  - attaches the current csrftoken cookie as X-CSRFToken on unsafe methods
 *  - parses JSON responses and throws an ApiError with field-level details
 *    on non-2xx responses, so callers can show validation errors inline.
 */
export async function apiFetch(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  const unsafe = !["GET", "HEAD", "OPTIONS", "TRACE"].includes(method);

  if (unsafe) {
    const csrftoken = getCookie("csrftoken");
    if (csrftoken) headers["X-CSRFToken"] = csrftoken;
  }
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }
  return data;
}

export class ApiError extends Error {
  constructor(status, data) {
    // DRF returns either {"detail": "..."} or {"field": ["error", ...]}.
    const message =
      (data && data.detail) ||
      (data && typeof data === "object" && Object.values(data)[0]?.[0]) ||
      "Something went wrong. Please try again.";
    super(message);
    this.status = status;
    this.data = data;
  }
}
