import api from "./api";

export const workEntryService = {
  list: (params) => api.get("/api/work-entries", { params }).then((r) => r.data),
  get: (id) => api.get(`/api/work-entries/${id}`).then((r) => r.data),
  create: (payload) => api.post("/api/work-entries", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/api/work-entries/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/work-entries/${id}`),
};
