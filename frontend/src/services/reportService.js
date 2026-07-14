import api from "./api";

export const reportService = {
  period: (params) => api.get("/api/reports/period", { params }).then((r) => r.data),
  customerWise: () => api.get("/api/reports/customer-wise").then((r) => r.data),
  pendingPayments: () => api.get("/api/reports/pending-payments").then((r) => r.data),
  highestPayingCustomer: () => api.get("/api/reports/highest-paying-customer").then((r) => r.data),
  mostFrequentCustomer: () => api.get("/api/reports/most-frequent-customer").then((r) => r.data),
  // Downloads via axios (so the auth header works) then triggers a save-as.
  downloadExport: async (format, params = {}) => {
    const response = await api.get("/api/reports/export", {
      params: { format, ...params },
      responseType: "blob",
    });
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const extension = format === "excel" ? "xlsx" : format;
    link.href = url;
    link.download = `worker-ledger-report.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export const searchService = {
  search: (q) => api.get("/api/search", { params: { q } }).then((r) => r.data),
};

export const settingsService = {
  backup: async () => {
    const response = await api.get("/api/settings/backup", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "worker_ledger_backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  restore: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post("/api/settings/restore", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data);
  },
};
