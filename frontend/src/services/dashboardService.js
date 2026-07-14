import api from "./api";

export const dashboardService = {
  summary: () => api.get("/api/dashboard/summary").then((r) => r.data),
  charts: () => api.get("/api/dashboard/charts").then((r) => r.data),
  alerts: () => api.get("/api/dashboard/alerts").then((r) => r.data),
};
