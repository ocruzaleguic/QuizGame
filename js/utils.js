

// LocalStorage: Get & Set genéricos

export function lsGet(key, fallback = null) {
  const val = localStorage.getItem(key);
  if (val === null) return fallback;
  return JSON.parse(val);
}

export function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function lsRemove(key) {
  localStorage.removeItem(key);
}



// Archivo JSON por Fetch

export async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}



// Reset de claves múltiples

export function resetKeys(keys = []) {
  keys.forEach(k => localStorage.removeItem(k));
}
