
// LOCALSTORAGE ----------------------------------------------------

// Get & Set genéricos
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

// Reset de claves múltiples
export function resetKeys(keys = []) {
  keys.forEach(k => localStorage.removeItem(k));
}

// Saber si existe una key en localStorage
export function lsHas(key) {
  return localStorage.getItem(key) !== null;
}



// JSON Y FETCH ----------------------------------------------------
export async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}



// USUARIOS --------------------------------------------------------

// HACER USUARIOS PERSISTENTES

export function getRegisteredUsers() {
  return lsGet("registeredUsers", []);
}

export function saveRegisteredUsers(list) {
  lsSet("registeredUsers", list);
}

// Semilla + combinados

export async function getSeedUsers() {
  const data = await loadJSON("./data/users.json");
  // Cada usuario semilla tiene gamificación (se genera una copia)
  return data.users.map(u => ({ ...u, gamification: u.gamification ?? { XP: 0 } }));
}

export async function getAllUsers() {
  const seed = await getSeedUsers();
  const reg = getRegisteredUsers();
  return [...seed, ...reg];
}



// SEGURIDAD -------------------------------------------------------

// Redirigir si no hay un área seleccionada
export function requireArea() {
  if (!lsHas("selected_area")) {
    window.location.replace("seleccion-area.html");
  }
}

// Verifica si hay usuario logueado Y si ya eligió un área
export function requireAuth() {
  const logged = lsGet("loggedUser");

  // Si no está logueado → enviar a login
  if (!logged) {
    window.location.replace("login.html");
    return;
  }

  const page = document.body.dataset.page;

  // Páginas permitidas sin selección de área:
  if (page === "login" || page === "seleccion-area") {
    return;
  }

  // Si no tiene área → enviar a seleccion-area
  if (!localStorage.getItem("selected_area")) {
    window.location.replace("seleccion-area.html");
  }
}



// GAMIFICACIÓN Y AYUDANTES ----------------------------------------

// ID único incremental para nuevos usuarios registrados

export function generateUserId() {
  const reg = lsGet("registeredUsers", []);
  if (!Array.isArray(reg) || reg.length === 0) return 1;
  return Math.max(...reg.map(u => u.id || 0)) + 1;
}

// Asegurar que un usuario tenga el objeto gamification con XP

export function ensureGamification(user) {
  if (!user) return user;
  if (!user.gamification || typeof user.gamification !== "object") {
    user.gamification = { XP: 0 };
    return user;
  }
  if (user.gamification.XP == null) {
    user.gamification.XP = 0;
  }
  return user;
}

// Sincronizar la versión actual del usuario en registeredUsers

export function syncUser(user) {
  if (!user || user.id == null) return;
  let reg = getRegisteredUsers();
  const exists = reg.some(u => u.id === user.id);
  if (exists) {
    reg = reg.map(u => (u.id === user.id ? user : u));
  } else {
    reg.push(user);
  }
  saveRegisteredUsers(reg);
}

// Añadir XP al usuario en sesión y persistirlo

export function addXP(amount = 0) {
  if (!Number.isFinite(amount) || amount === 0) return;
  let logged = lsGet("loggedUser");
  if (!logged || !logged.id) return;

  logged = ensureGamification(logged);
  logged.gamification.XP = (logged.gamification.XP || 0) + amount;

  // Guardar en sesión (sin password si existiera)
  const { password, ...safeLogged } = logged;
  lsSet("loggedUser", safeLogged);

  // Guardar permanente en registeredUsers
  syncUser(safeLogged);
}
