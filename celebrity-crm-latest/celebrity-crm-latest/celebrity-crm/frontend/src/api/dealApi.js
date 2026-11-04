import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getDeals = () => http.get("/deals").then((res) => res.data);

export const createDeal = (deal) =>
  http.post("/deals", deal).then((res) => res.data);