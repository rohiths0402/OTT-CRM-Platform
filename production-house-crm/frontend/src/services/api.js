import { AUTH_ENDPOINTS } from "../config/authEndpoints";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

/**
 * "Remember me" keeps the session in localStorage across browser restarts;
 * otherwise it lives in sessionStorage and ends with the tab.
 */
export const authSession = {
  save({ token, user }, rememberMe) {
    this.clear();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clear() {
    [localStorage, sessionStorage].forEach((storage) => {
      storage.removeItem(TOKEN_KEY);
      storage.removeItem(USER_KEY);
    });
  },
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Generic JSON request helper. Expects backend errors shaped as
 * { message: string }. Any other failure falls back to a generic message.
 */
export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("Backend API URL is missing.");
  }

  let response;
  const token = authSession.getToken();

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error("Unable to connect to the server.");
  }

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json().catch(() => null)
    : null;

  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || "Something went wrong.",
      response.status
    );
  }

  return data;
}

/**
 * Calls a route from AUTH_ENDPOINTS, refusing placeholder routes so the UI
 * never pretends a backend feature works when it does not.
 */
function callAuthEndpoint(key, body) {
  const endpoint = AUTH_ENDPOINTS[key];

  if (!endpoint || endpoint.status !== "confirmed") {
    return Promise.reject(
      new Error(
        "This feature is not connected to the backend yet. Please try again later."
      )
    );
  }

  return apiRequest(endpoint.path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export const authApi = {
  /**
   * Body: { email, password, rememberMe }
   * Response: { message, token, tokenType, expiresIn, user }; the session is stored here.
   */
  async login(credentials) {
    const data = await callAuthEndpoint("login", credentials);
    authSession.save(data, credentials.rememberMe);
    return data;
  },

  logout() {
    authSession.clear();
  },

  /** Body: { fullName, company, email, mobile, password } */
  signup(details) {
    return callAuthEndpoint("register", details);
  },

  /** Body: { credential } (Google ID token from Google Identity Services) */
  googleLogin(credential) {
    return callAuthEndpoint("google", { credential });
  },

  /** Body: { email }. Emails a 6-digit OTP if the account exists. */
  forgotPassword(payload) {
    return callAuthEndpoint("forgotPassword", payload);
  },

  /** Body: { email, otp }. Checks the OTP without consuming it. */
  verifyOtp(payload) {
    return callAuthEndpoint("verifyOtp", payload);
  },

  /** Body: { email, otp, password } */
  resetPassword(payload) {
    return callAuthEndpoint("resetPassword", payload);
  },
};
