import api from "./api";

export const authService = {
  register: (payload) => api.post("/api/auth/register", payload).then((r) => r.data),
  login: (payload) => api.post("/api/auth/login", payload).then((r) => r.data),
  logout: () => api.post("/api/auth/logout").then((r) => r.data),
  getProfile: () => api.get("/api/auth/me").then((r) => r.data),
  updateProfile: (payload) => api.put("/api/auth/me", payload).then((r) => r.data),
};
