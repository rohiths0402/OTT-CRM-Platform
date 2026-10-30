export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^\+?\d{10,15}$/;
export const PASSWORD_MIN_LENGTH = 8;

export function validateEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

// Spaces, dashes and brackets are allowed for readability and stripped before checking.
export function normalizeMobile(value) {
  return value.replace(/[\s()-]/g, "");
}

export function validateMobile(value) {
  return MOBILE_REGEX.test(normalizeMobile(value));
}

export function getPasswordChecks(password) {
  return [
    {
      id: "length",
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      met: password.length >= PASSWORD_MIN_LENGTH,
    },
    { id: "upper", label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { id: "lower", label: "One lowercase letter", met: /[a-z]/.test(password) },
    { id: "number", label: "One number", met: /\d/.test(password) },
    {
      id: "special",
      label: "One special character",
      met: /[^A-Za-z0-9\s]/.test(password),
    },
  ];
}

export function isPasswordStrong(password) {
  return getPasswordChecks(password).every((check) => check.met);
}
