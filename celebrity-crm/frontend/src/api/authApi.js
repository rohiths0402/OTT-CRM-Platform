import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "./firebase";

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

let confirmation = null;
let verifier = null;

const firebaseMessage = (err) => {
  console.log("Firebase error:", err.code, err.message);
  if (err.code === "auth/invalid-verification-code") {
    return "That code is incorrect. Try again.";
  }
  if (err.code === "auth/code-expired") {
    return "This code has expired. Ask for a new one.";
  }
  if (err.code === "auth/too-many-requests") {
    return "Too many tries. Please wait a few minutes.";
  }
  return "We could not send the code. Try again in a moment.";
};

export const passwordLogin = (email, password) =>
  useMock
    ? wait(700).then(() => {
        if (password !== mockPassword)
          throw rejectWith("Email or password is incorrect.");
        return { data: { user: { ...mockUser, email } } };
      })
    : api.post("/auth/login", { email, password });

export const sendOtp = async (mobile) => {
  if (useMock) {
    await wait(700);
    return { data: { sent: true } };
  }

  try {
    if (verifier) verifier.clear();
    const box = document.createElement("div");
    document.body.appendChild(box);
    verifier = new RecaptchaVerifier(firebaseAuth, box, { size: "invisible" });
    confirmation = await signInWithPhoneNumber(
      firebaseAuth,
      "+91" + mobile,
      verifier,
    );
    return { data: { sent: true } };
  } catch (err) {
    throw rejectWith(firebaseMessage(err));
  }
};

export const verifyOtp = async (mobile, otp) => {
  if (useMock) {
    await wait(700);
    if (otp !== mockOtp) throw rejectWith("That code is incorrect. Try again.");
    return { data: { user: mockUser } };
  }

  if (!confirmation) throw rejectWith("Ask for a new code first.");

  let idToken;
  try {
    const result = await confirmation.confirm(otp);
    idToken = await result.user.getIdToken();
  } catch (err) {
    throw rejectWith(firebaseMessage(err));
  }
  return api.post("/auth/otp/firebase", { idToken });
};

export const googleLogin = (code) =>
  useMock
    ? wait(700).then(() => ({ data: { user: mockUser } }))
    : api.post("/auth/google", { code });

export const logout = () =>
  useMock ? Promise.resolve() : api.post("/auth/logout");