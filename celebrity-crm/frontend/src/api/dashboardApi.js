import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getDashboard = () => http.get("/dashboard").then((res) => res.data);