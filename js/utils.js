
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

// Usuarios registrados

export function getRegisteredUsers() {
  return lsGet("registeredUsers", []);
}

export function saveRegisteredUsers(list) {
  lsSet("registeredUsers", list);
}

// Usuarios semilla + combinados

export async function getSeedUsers() {
  const data = await loadJSON("./data/users.json");
  return data.users;
}

export async function getAllUsers() {
  const seed = await getSeedUsers();
  const reg = getRegisteredUsers();
  return [...seed, ...reg];
}

// Saber si existe una key en localStorage
export function lsHas(key) {
  return localStorage.getItem(key) !== null;
}

// Redirigir si no hay un área seleccionada
export function requireArea() {
  if (!lsHas("selected_area")) {
    window.location.replace("seleccion-area.html");
  }
}

// Verifica si hay usuario logueado
export function requireAuth() {
  const user = lsGet("loggedUser");

  if (!user) {
    window.location.replace("./login.html");
  }
}
