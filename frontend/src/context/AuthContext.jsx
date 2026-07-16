import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../utils/storage";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // const [user, setUser] = useState(() => {
  //   const stored = localStorage.getItem("wl_user");
  //   return stored ? JSON.parse(stored) : null;
  // });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadSession = async () => {
    const token = await storage.get("wl_access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.getProfile();

      setUser(profile);

      await storage.set("wl_user", profile);
    } catch {
      await storage.remove("wl_access_token");
      await storage.remove("wl_refresh_token");
      await storage.remove("wl_user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  loadSession();
}, []);

const persistSession = async (data) => {
  await storage.set("wl_access_token", data.access_token);
  await storage.set("wl_refresh_token", data.refresh_token);
  await storage.set("wl_user", data.user);

  setUser(data.user);
};

  const login = async (payload) => {
    const data = await authService.login(payload);
    await persistSession(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    await persistSession(data);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore network errors on logout, still clear local session
    }
    await storage.remove("wl_access_token");
await storage.remove("wl_refresh_token");
await storage.remove("wl_user");
    setUser(null);
  };

  const updateUser = async (updated) => {
    setUser(updated);
    await storage.set("wl_user", updated);
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
