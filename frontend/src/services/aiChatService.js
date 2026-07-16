import api from "./api";

export const sendAiMessage = (message) =>
  api.post("/api/ai/chat", { message }).then((r) => r.data.reply);