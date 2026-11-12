import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { primeCsrfCookie } from "../api/client";
import * as api from "../api/wanderly";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await primeCsrfCookie();
      try {
        const me = await api.getCurrentUser();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (credentials) => {
    const me = await api.login(credentials);
    setUser(me);
    return me;
  }, []);

  const signup = useCallback(async (payload) => {
    await api.signup(payload);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
