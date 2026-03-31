export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota issues for this demo app
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const userScopedKey = (userId, suffix) => `animex_u${userId}_${suffix}`;
