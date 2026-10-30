export const passwordRules = [
  {
    id: "length",
    label: "At least 6 characters",
    test: (value) => value.length >= 6,
  },
  {
    id: "upper",
    label: "One capital letter",
    test: (value) => /[A-Z]/.test(value),
  },
  { id: "number", label: "One number", test: (value) => /\d/.test(value) },
  {
    id: "special",
    label: "One special character",
    test: (value) => /[^A-Za-z0-9\s]/.test(value),
  },
];

export const isStrongPassword = (value) =>
  passwordRules.every((rule) => rule.test(value));
