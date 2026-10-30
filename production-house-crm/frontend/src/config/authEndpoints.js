export const AUTH_ENDPOINTS = {
  login: { path: "/auth/login", status: "confirmed" },
  register: { path: "/auth/register", status: "confirmed" },
  // The Spring Boot backend does not implement Google sign-in yet.
  google: { path: "/auth/google", status: "placeholder" },
  forgotPassword: { path: "/auth/forgot-password", status: "confirmed" },
  verifyOtp: { path: "/auth/verify-otp", status: "confirmed" },
  resetPassword: { path: "/auth/reset-password", status: "confirmed" },
};
