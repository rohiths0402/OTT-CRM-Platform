const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/+$/, '')

const AUTH_ENDPOINTS = {
  login: import.meta.env.VITE_AUTH_LOGIN_PATH || '/auth/login/',
  passwordReset: import.meta.env.VITE_AUTH_FORGOT_PASSWORD_PATH || '/auth/password-reset/',
}

function buildUrl(path) {
  return `${API_BASE_URL}/${String(path).replace(/^\/+/, '')}`
}

async function postJson(path, payload) {
  let response

  try {
    response = await fetch(buildUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running and the API URL is correct.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const detail = data.detail || data.message || data.error
    const fieldError = data.email?.[0] || data.password?.[0]
    throw new Error(detail || fieldError || `Request failed with status ${response.status}.`)
  }

  return data
}

export function login(credentials) {
  return postJson(AUTH_ENDPOINTS.login, credentials)
}

export function requestPasswordReset(email) {
  return postJson(AUTH_ENDPOINTS.passwordReset, { email })
}