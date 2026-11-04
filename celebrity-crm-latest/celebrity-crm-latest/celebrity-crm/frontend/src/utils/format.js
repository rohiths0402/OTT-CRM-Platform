const trim = (value) => String(Number(value.toFixed(2)));

export const formatMoney = (amount) => {
  if (amount >= 10000000) return `₹ ${trim(amount / 10000000)} Cr`;
  if (amount >= 100000) return `₹ ${trim(amount / 100000)} L`;
  return `₹ ${amount.toLocaleString("en-IN")}`;
};
