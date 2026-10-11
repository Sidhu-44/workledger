
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { storage } from "../utils/storage";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

const SESSION_TIMEOUT = 10000;

function withTimeout(promise, timeoutMs, message) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      try {
        // Restore the saved access token.
        const token = await withTimeout(
          storage.get("wl_access_token"),
          SESSION_TIMEOUT,
          "Loading the saved session timed out"
        );

        if (!active) return;

        // No saved token: show the logged-out application.
        if (!token) {
          return;
        }

        // Restore the authenticated user's profile.
        const profile = await withTimeout(
          authService.getProfile(),
          SESSION_TIMEOUT,
          "Loading the user profile timed out"
        );

        if (!active) return;

        setUser(profile);

        // Keep the locally stored profile synchronized.
        try {
          await storage.set("wl_user", profile);
        } catch (storageError) {
          console.error(
            "Could not update the saved user profile:",
            storageError
          );
        }
      } catch (error) {
        if (!active) return;

        console.error("Session restoration failed:", error);

        // Clear credentials only when the server explicitly
        // rejects the access token as unauthorized.
        if (error?.response?.status === 401) {
          setUser(null);

          // Do not let storage cleanup block the UI.
          Promise.allSettled([
            storage.remove("wl_access_token"),
            storage.remove("wl_refresh_token"),
            storage.remove("wl_user"),
          ]).catch((cleanupError) => {
            console.error(
              "Could not clear the expired session:",
              cleanupError
            );
          });
        }

        // For network errors or timeouts, preserve saved credentials.
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      active = false;
    };
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
    } catch (error) {
      // Logout must still clear the local session if the
      // backend is temporarily unavailable.
      console.error("Server logout failed:", error);
    } finally {
      setUser(null);

      await Promise.allSettled([
        storage.remove("wl_access_token"),
        storage.remove("wl_refresh_token"),
        storage.remove("wl_user"),
      ]);
    }
  };

  const updateUser = async (updated) => {
    setUser(updated);

    await storage.set("wl_user", updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}
