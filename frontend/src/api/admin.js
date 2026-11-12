import { apiFetch } from "./client";

// Staff-only endpoints (see wanderly_django/travel/admin_api.py).
export const adminList = (resource) => apiFetch(`/api/admin/${resource}/`);

export const adminCreate = (resource, body) =>
  apiFetch(`/api/admin/${resource}/`, { method: "POST", body });

export const adminUpdate = (resource, id, body) =>
  apiFetch(`/api/admin/${resource}/${id}/`, { method: "PATCH", body });

export const adminDelete = (resource, id) =>
  apiFetch(`/api/admin/${resource}/${id}/`, { method: "DELETE" });
