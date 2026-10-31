import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const toUser = (profile) => ({
  name: profile.name,
  phone: profile.phone || "",
  location: profile.location || "",
  bio: profile.bio || "",
  instagram: profile.instagram || "",
  youtube: profile.youtube || "",
  profilePhoto: profile.imageUrl || "",
});

export const getProfile = () =>
  http.get("/profile").then((res) => toUser(res.data));

export const saveProfile = (form) =>
  http
    .put("/profile", {
      name: form.name,
      phone: form.phone,
      location: form.location,
      bio: form.bio,
      instagram: form.instagram,
      youtube: form.youtube,
      imageUrl: form.profilePhoto,
    })
    .then((res) => toUser(res.data));