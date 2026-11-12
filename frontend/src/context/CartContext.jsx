import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import * as api from "../api/wanderly";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reload the cart whenever login state changes (login/logout/app load).
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(async (destinationId, quantity = 1) => {
    const data = await api.addToCart(destinationId, quantity);
    setCart(data);
    return data;
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    const data = await api.updateCartItem(itemId, quantity);
    setCart(data);
    return data;
  }, []);

  const removeItem = useCallback(async (itemId) => {
    const data = await api.removeCartItem(itemId);
    setCart(data);
    return data;
  }, []);

  const placeOrder = useCallback(async (payload) => {
    const order = await api.checkout(payload);
    await refreshCart();
    return order;
  }, [refreshCart]);

  return (
    <CartContext.Provider
      value={{ cart, loading, refreshCart, addItem, updateItem, removeItem, placeOrder }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
