import axios from "axios";

const useMock = import.meta.env.VITE_USE_MOCK === "true";
const mockOtp = "123456";
const mockPassword = "Celeb@123";
const mockResetToken = "mock-reset-token";

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
let recaptchaBox = null;
let firebaseModules = null;

const loadFirebase = async () => {
  if (!firebaseModules) {
    const [authModule, firebaseModule] = await Promise.all([
      import("firebase/auth"),
      import("./firebase"),
    ]);
    firebaseModules = {
      RecaptchaVerifier: authModule.RecaptchaVerifier,
      signInWithPhoneNumber: authModule.signInWithPhoneNumber,
      firebaseAuth: firebaseModule.firebaseAuth,
    };
  }
  return firebaseModules;
};

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

const confirmWithFirebase = async (otp) => {
  if (!confirmation) throw rejectWith("Ask for a new code first.");
  try {
    const result = await confirmation.confirm(otp);
    return await result.user.getIdToken();
  } catch (err) {
    throw rejectWith(firebaseMessage(err));
  }
};

export const passwordLogin = (email, password, rememberMe = false) =>
  useMock
    ? wait(700).then(() => {
        if (password !== mockPassword)
          throw rejectWith("Email or password is incorrect.");
        return { data: { user: { ...mockUser, email } } };
      })
    : api.post("/auth/login", { email, password, rememberMe });

export const sendOtp = async (mobile) => {
  if (useMock) {
    await wait(700);
    return { data: { sent: true } };
  }

  try {
    const { RecaptchaVerifier, signInWithPhoneNumber, firebaseAuth } =
      await loadFirebase();
    if (verifier) verifier.clear();
    if (recaptchaBox) recaptchaBox.remove();
    recaptchaBox = document.createElement("div");
    document.body.appendChild(recaptchaBox);
    verifier = new RecaptchaVerifier(firebaseAuth, recaptchaBox, {
      size: "invisible",
    });
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

export const verifyOtp = async (mobile, otp, rememberMe = false) => {
  if (useMock) {
    await wait(700);
    if (otp !== mockOtp) throw rejectWith("That code is incorrect. Try again.");
    return { data: { user: mockUser } };
  }

  const idToken = await confirmWithFirebase(otp);
  return api.post("/auth/otp/firebase", { idToken, rememberMe });
};

export const googleLogin = (code, rememberMe = false) =>
  useMock
    ? wait(700).then(() => ({ data: { user: mockUser } }))
    : api.post("/auth/google", { code, rememberMe });

export const requestPasswordReset = async (identifier, channel) => {
  if (useMock) {
    await wait(700);
    return { data: { sent: true } };
  }

  await api.post("/auth/password/forgot", { identifier, channel });
  if (channel === "MOBILE") await sendOtp(identifier);
  return { data: { sent: true } };
};

export const verifyResetOtp = async (identifier, channel, otp) => {
  if (useMock) {
    await wait(700);
    if (otp !== mockOtp) throw rejectWith("That code is incorrect. Try again.");
    return { data: { resetToken: mockResetToken } };
  }

  if (channel === "MOBILE") {
    const idToken = await confirmWithFirebase(otp);
    return api.post("/auth/password/verify", { channel, identifier, idToken });
  }
  return api.post("/auth/password/verify", { channel, identifier, otp });
};

export const resetPassword = (resetToken, newPassword) =>
  useMock
    ? wait(700).then(() => ({ data: { reset: true } }))
    : api.post("/auth/password/reset", { resetToken, newPassword });

export const changePassword = (currentPassword, newPassword) =>
  useMock
    ? wait(700).then(() => {
        if (currentPassword !== mockPassword)
          throw rejectWith("Current password is incorrect.");
        return { data: { changed: true } };
      })
    : api.post("/auth/password/change", { currentPassword, newPassword });

export const logout = () =>
  useMock ? Promise.resolve() : api.post("/auth/logout");
