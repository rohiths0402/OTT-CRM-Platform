import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const toDate = (text) => {
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const withDate = (event) => ({ ...event, date: toDate(event.date) });

export const getEvents = () =>
  http.get("/schedule").then((res) => res.data.map(withDate));

export const respondToEvent = (id, action) =>
  http.put(`/schedule/${id}/${action}`).then((res) => withDate(res.data));