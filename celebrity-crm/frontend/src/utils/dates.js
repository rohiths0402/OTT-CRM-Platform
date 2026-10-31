export const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return startOfDay(next);
};

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const monthGrid = (monthStart) => {
  const first = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
};

export const toMinutes = (label) => {
  const [time, period] = label.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const formatMonth = (date) =>
  date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export const formatDay = (date) =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

export const dayLabel = (date, today) => {
  const diff = Math.round((startOfDay(date) - startOfDay(today)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { weekday: "long" });
};
