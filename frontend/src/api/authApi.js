import axios from "axios";

const useMock = import.meta.env.VITE_USE_MOCK === "true";
const mockOtp = "123456";
const mockPassword = "Celeb@123";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUser = { id: 1, name: "Celebrity Demo", role: "CELEBRITY" };

const rejectWith = (message) => {
  const error = new Error(message);
  error.response = { data: { message } };
  return error;
};

export const passwordLogin = (email, password) =>
  useMock
    ? wait(700).then(() => {
        if (password !== mockPassword)
          throw rejectWith("Email or password is incorrect.");
        return { data: { user: { ...mockUser, email } } };
      })
    : api.post("/auth/login", { email, password });

export const sendOtp = (mobile) =>
  useMock
    ? wait(700).then(() => ({ data: { sent: true } }))
    : api.post("/auth/otp/send", { mobile });

export const verifyOtp = (mobile, otp) =>
  useMock
    ? wait(700).then(() => {
        if (otp !== mockOtp)
          throw rejectWith("That code is incorrect. Try again.");
        return { data: { user: mockUser } };
      })
    : api.post("/auth/otp/verify", { mobile, otp });

export const googleLogin = (code) =>
  useMock
    ? wait(700).then(() => ({ data: { user: mockUser } }))
    : api.post("/auth/google", { code });

export const logout = () =>
  useMock ? Promise.resolve() : api.post("/auth/logout");
