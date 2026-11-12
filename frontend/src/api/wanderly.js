import { apiFetch } from "./client";

export const getDestinations = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/api/destinations/${qs ? `?${qs}` : ""}`);
};

export const getCurrentUser = () => apiFetch("/api/auth/user/");

export const signup = (payload) => apiFetch("/api/auth/signup/", { method: "POST", body: payload });

export const login = (payload) => apiFetch("/api/auth/login/", { method: "POST", body: payload });

export const logout = () => apiFetch("/api/auth/logout/", { method: "POST" });

export const sendContactMessage = (payload) =>
  apiFetch("/api/contact/", { method: "POST", body: payload });

export const subscribeNewsletter = (email) =>
  apiFetch("/api/newsletter/", { method: "POST", body: { email } });

export const getCart = () => apiFetch("/api/cart/");

export const addToCart = (destinationId, quantity = 1) =>
  apiFetch("/api/cart/add/", {
    method: "POST",
    body: { destination_id: destinationId, quantity },
  });

export const updateCartItem = (itemId, quantity) =>
  apiFetch(`/api/cart/items/${itemId}/`, { method: "PATCH", body: { quantity } });

export const removeCartItem = (itemId) =>
  apiFetch(`/api/cart/items/${itemId}/`, { method: "DELETE" });

export const getOrders = () => apiFetch("/api/orders/");

export const checkout = (payload) =>
  apiFetch("/api/orders/checkout/", { method: "POST", body: payload });
