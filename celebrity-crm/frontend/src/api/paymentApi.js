import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const toDate = (text) => {
  const [year, month, day] = text.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const withDate = (payment) => ({ ...payment, date: toDate(payment.date) });

const asSent = (payment) => ({
  ...payment,
  id: `sent-${payment.id}`,
  direction: "sent",
  status: "sent",
  date: toDate(payment.date),
});

export const getPayments = () =>
  http.get("/payments").then((res) => res.data.map(withDate));

export const settlePayment = (id, settlement) =>
  http.put(`/payments/${id}/settle`, settlement).then((res) => withDate(res.data));

export const getSentPayments = () =>
  http.get("/payments/sent").then((res) => res.data.map(asSent));

export const createSentPayment = (payment) =>
  http.post("/payments/sent", payment).then((res) => asSent(res.data));

export const createRazorpayOrder = (id, amount) =>
  http.post(`/payments/${id}/razorpay/order`, { amount }).then((res) => res.data);

export const verifyRazorpayPayment = (id, details) =>
  http.post(`/payments/${id}/razorpay/verify`, details).then((res) => withDate(res.data));

export const createSentRazorpayOrder = (amount) =>
  http.post("/payments/sent/razorpay/order", { amount }).then((res) => res.data);

export const verifySentRazorpay = (details) =>
  http.post("/payments/sent/razorpay/verify", details).then((res) => asSent(res.data));