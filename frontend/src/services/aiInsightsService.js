import api from "./api";

export const getDashboardInsights = () =>
  api.get("/api/ai/dashboard-insights").then((r) => r.data);