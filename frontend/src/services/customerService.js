import api from "./api";

export const customerService = {
  list: (params) => api.get("/api/customers", { params }).then((r) => r.data),
  get: (id) => api.get(`/api/customers/${id}`).then((r) => r.data),
  create: (payload) => api.post("/api/customers", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/api/customers/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/customers/${id}`),
  history: (id) => api.get(`/api/customers/${id}/history`).then((r) => r.data),
};
