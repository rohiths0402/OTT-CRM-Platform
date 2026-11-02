import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getTeam = () => http.get("/managers/team").then((res) => res.data);

export const addTeamMember = (member) =>
  http.post("/managers/team", member).then((res) => res.data);

export const removeTeamMember = (id) => http.delete(`/managers/team/${id}`);

export const getTasks = () =>
  http.get("/managers/tasks").then((res) => res.data);

export const addTask = (task) =>
  http.post("/managers/tasks", task).then((res) => res.data);

export const toggleTask = (id) =>
  http.put(`/managers/tasks/${id}/toggle`).then((res) => res.data);

export const removeTask = (id) => http.delete(`/managers/tasks/${id}`);