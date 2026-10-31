import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const getContracts = () => http.get("/contracts").then((res) => res.data);

export const createContract = (contract) =>
  http.post("/contracts", contract).then((res) => res.data);

export const signContract = (id, signer, signatureData) =>
  http.put(`/contracts/${id}/sign`, { signer, signatureData }).then((res) => res.data);