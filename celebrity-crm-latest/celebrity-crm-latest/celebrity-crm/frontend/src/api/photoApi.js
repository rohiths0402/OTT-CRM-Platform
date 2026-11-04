import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const http = axios.create({ baseURL, withCredentials: true });

export const getPhotos = () => http.get("/photos");

export const uploadPhoto = (blob) => {
  const form = new FormData();
  form.append("file", blob, "photo.jpg");
  return http.post("/photos", form);
};

export const deletePhoto = (id) => http.delete(`/photos/${id}`);

export const photoUrl = (id) => `${baseURL}/photos/${id}/image`;