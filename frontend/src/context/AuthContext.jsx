import { createContext, useContext, useEffect, useState } from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("wl_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("wl_access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem("wl_user", JSON.stringify(profile));
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("wl_access_token", data.access_token);
    localStorage.setItem("wl_refresh_token", data.refresh_token);
    localStorage.setItem("wl_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    const data = await authService.login(payload);
    persistSession(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    persistSession(data);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout, still clear local session
    }
    localStorage.removeItem("wl_access_token");
    localStorage.removeItem("wl_refresh_token");
    localStorage.removeItem("wl_user");
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("wl_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
