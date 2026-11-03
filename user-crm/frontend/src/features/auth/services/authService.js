
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

async function postJson(path, payload) {
  const url = `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;

  console.log("LOGIN URL:", url);
  console.log("LOGIN PAYLOAD:", {
    email: payload.email,
    password: payload.password ? "[PROVIDED]" : "[MISSING]",
    remember_me: payload.remember_me,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  console.log("LOGIN STATUS:", response.status);
  console.log(
  "LOGIN RESPONSE JSON:",
  JSON.stringify(data, null, 2)
);

  if (!response.ok) {
    const errors = Object.entries(data)
      .map(([field, messages]) => {
        const message = Array.isArray(messages)
          ? messages.join(", ")
          : typeof messages === "string"
            ? messages
            : JSON.stringify(messages);

        return `${field}: ${message}`;
      })
      .join(" | ");

    throw new Error(errors || `Login failed (${response.status})`);
  }

  return data;
}

export function login({ email, password, remember_me = false }) {
  return postJson("auth/login/", {
    email: email.trim(),
    password,
    remember_me,
  });
}

export async function logout() {
  const refresh = localStorage.getItem("loopRefreshToken");
  const access = localStorage.getItem("loopAccessToken");

  if (!refresh || !access) return;

  const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok && response.status !== 401) {
    throw new Error("Unable to complete logout.");
  }
}
