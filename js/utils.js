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

export async function loadAreaName() {
  const selectedAreaId = lsGet("selected_area");
  if (!selectedAreaId) return null;

  try {
    const data = await loadJSON("./data/quiz.json");
    const area = data.areas.find(a => a.id === selectedAreaId);
    return area ? area.name : null;
  } catch (e) {
    console.error("Error cargando área:", e);
    return null;
  }
}


// JSON Y FETCH ----------------------------------------------------
export async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}



// USUARIOS --------------------------------------------------------

// Usuarios registrados
export function getRegisteredUsers() {
  return lsGet("registeredUsers", []);
}

export function saveRegisteredUsers(list) {
  lsSet("registeredUsers", list);
}

// Usuarios semilla
export async function getSeedUsers() {
  const data = await loadJSON("./data/users.json");
  return data.users.map(u => ({
    ...u,
    gamification: u.gamification ?? { XP: 0 }
  }));
}

// Combinar usuarios priorizando registrados sobre seeds
export async function getAllUsers() {
  const seed = await getSeedUsers();
  const reg = getRegisteredUsers();

  const merged = [...reg];

  seed.forEach(s => {
    const conflict = merged.some(
      u => u.username === s.username || u.email === s.email
    );
    if (!conflict) merged.push(s);
  });

  return merged;
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



// GAMIFICACIÓN Y UTILIDADES --------------------------------------

// ID único incremental para nuevos usuarios
export function generateUserId() {
  const reg = getRegisteredUsers();
  if (!Array.isArray(reg) || reg.length === 0) return 100;

  return Math.max(...reg.map(u => u.id || 0)) + 1;
}

export function ensureGamification(user) {
  if (!user) return user;

  if (!user.gamification || typeof user.gamification !== "object") {
    user.gamification = { XP: 0, achievements: [] };
    return user;
  }

  // XP
  if (user.gamification.XP == null) {
    user.gamification.XP = 0;
  }

  // Achievements
  if (!Array.isArray(user.gamification.achievements)) {
    user.gamification.achievements = [];
  }

  return user;
}



// SINCRONIZAR USUARIO
export function syncUser(userPartial) {
  if (!userPartial || userPartial.id == null) return;

  let reg = getRegisteredUsers();

  const original = reg.find(u => u.id === userPartial.id);
  if (!original) return; // No sincronizar seeds

  const updated = {
    ...original,         // mantiene password
    ...userPartial,      // aplica cambios
    password: original.password
  };

  reg = reg.map(u => u.id === updated.id ? updated : u);
  saveRegisteredUsers(reg);
}



// Añadir XP sin destruir contraseña
export function addXP(amount = 0) {
  if (!Number.isFinite(amount) || amount === 0) return;

  let logged = lsGet("loggedUser");
  if (!logged || !logged.id) return;

  logged = ensureGamification(logged);
  logged.gamification.XP += amount;

  // Guardar loggedUser sin password
  const safeLogged = { ...logged };
  delete safeLogged.password;
  lsSet("loggedUser", safeLogged);

  // Sincronizar usando datos reales (en registeredUsers)
  syncUser(logged);
}
