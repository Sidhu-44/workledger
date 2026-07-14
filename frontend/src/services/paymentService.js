import api from "./api";

export const paymentService = {
  list: (workEntryId) =>
    api.get("/api/payments", { params: workEntryId ? { work_entry_id: workEntryId } : {} }).then((r) => r.data),
  record: (payload) => api.post("/api/payments", payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/payments/${id}`),
};
