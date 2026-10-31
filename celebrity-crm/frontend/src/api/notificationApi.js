import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getNotifications = () =>
  http.get("/notifications").then((res) => res.data);

export const markNotificationRead = (id) => http.put(`/notifications/${id}/read`);

export const markAllNotificationsRead = () => http.put("/notifications/read-all");