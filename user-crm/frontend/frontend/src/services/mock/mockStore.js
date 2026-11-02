import { seedData, defaultPreferences } from "../../features/mockData";

const PREFIX = "loop_mock_";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    if (raw !== null) return JSON.parse(raw);
  } catch (error) {
    console.warn(`Could not read mock data "${key}"`, error);
  }
  return fallback;
}

function write(key, value) {
  localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  return value;
}

function ensureCollection(key) {
  const current = read(key, null);
  if (current === null) return write(key, seedData[key] || []);
  return current;
}

export const mockStore = {
  list(key) { return ensureCollection(key); },
  create(key, data) {
    const records = ensureCollection(key);
    const record = { ...data, id: data?.id || `${key.slice(0, 3).toUpperCase()}-${Date.now()}` };
    write(key, [record, ...records]);
    return record;
  },
  update(key, id, data) {
    const records = ensureCollection(key);
    const updated = records.map((record) => String(record.id) === String(id) ? { ...record, ...data } : record);
    write(key, updated);
    return updated.find((record) => String(record.id) === String(id)) || null;
  },
  remove(key, id) {
    const records = ensureCollection(key);
    write(key, records.filter((record) => String(record.id) !== String(id)));
    return true;
  },
  getPreferences() { return read("preferences", defaultPreferences); },
  savePreferences(data) {
    const current = this.getPreferences();
    const merged = {
      ...current,
      ...data,
      profile: { ...current.profile, ...data.profile },
      notifications: { ...current.notifications, ...data.notifications },
      appearance: { ...current.appearance, ...data.appearance },
    };
    return write("preferences", merged);
  },
  get(key, fallback = []) { return read(key, fallback); },
  set(key, value) { return write(key, value); },
  removeKey(key) { localStorage.removeItem(`${PREFIX}${key}`); },
};
