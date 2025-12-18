import { ACHIEVEMENTS } from "./achievements.js";

// LOCALSTORAGE ---------------------------------------------------------------

// ESTRUCTURA DE GAMIFICACIÓN BASE

export const DEFAULT_GAMIFICATION = {
  XP: 0,
  achievements: []
};

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


// JSON Y FETCH ---------------------------------------------------------------

export async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}



// USUARIOS -------------------------------------------------------------------

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
    gamification: {
      ...DEFAULT_GAMIFICATION,
      ...u.gamification
    }
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

// ID único incremental para nuevos usuarios
export function generateUserId() {
  const reg = getRegisteredUsers();
  if (!Array.isArray(reg) || reg.length === 0) return 100;

  return Math.max(...reg.map(u => u.id || 0)) + 1;
}


// GAMIFICACIÓN Y UTILIDADES ---------------------------------------------------

export function ensureGamification(user) {
  if (!user) return user;

  // Si no existe gamification, crear base completa
  if (!user.gamification || typeof user.gamification !== "object") {
    user.gamification = { ...DEFAULT_GAMIFICATION };
    return user;
  }

  // Merge: añadir SOLO lo que falte
  user.gamification = {
    ...DEFAULT_GAMIFICATION,
    ...user.gamification
  };

  return user;
}


// LOGROS DE XP ---------------------

export function checkAndUnlockAchievements(user) {

  if (!user) return [];

  user = ensureGamification(user);
  const unlockedNow = [];

  // Filtrar logros solo tipo XP
  const xpAchievements = ACHIEVEMENTS.filter(a => a.type === "XP");

  for (const ach of xpAchievements) {
    const alreadyUnlocked = user.gamification.achievements.includes(ach.id);
    const meetsThreshold = user.gamification.XP >= ach.threshold;

    if (!alreadyUnlocked && meetsThreshold) {
      // Agregar logro al usuario
      user.gamification.achievements.push(ach.id);
      unlockedNow.push(ach);
    }
  }

  // Si no hubo cambios, salir
  if (unlockedNow.length === 0) {
    return [];
  }

  // Guardar loggedUser
  const safeUser = { ...user };
  delete safeUser.password;
  lsSet("loggedUser", safeUser);

  // Guardar en registeredUsers
  syncUser(user);

  return unlockedNow;
}

// TOAST PARA LOGROS ---------------

const TOAST_QUEUE = "achievementToastQueue";

// Se llama cuando se desbloquean logros
export function showAchievementToast(achievements) {
  if (!Array.isArray(achievements) || achievements.length === 0) return;

  const queue = lsGet(TOAST_QUEUE, []);

  achievements.forEach(a => {
    queue.push({
      id: a.id,
      name: a.name
    });
  });

  lsSet(TOAST_QUEUE, queue);
  playAchievementToasts();
}

// Se puede llamar al cargar cualquier página
export function playAchievementToasts() {
  const queue = lsGet(TOAST_QUEUE, []);
  if (queue.length === 0) return;

  const toast = document.getElementById("achievement-toast");
  if (!toast) return;

  const next = queue.shift();
  lsSet(TOAST_QUEUE, queue);

  toast.textContent = `🎉 Nuevo logro desbloqueado: ${next.name}`;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(playAchievementToasts, 300);
  }, 2500);

}


// SINCRONIZAR USUARIO ---------------------------------------------------------

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

  // Sincronizar usuario
  syncUser(logged);

  // Mostrar Toast
  const unlocked = checkAndUnlockAchievements(logged);
  if (unlocked.length > 0) {
    showAchievementToast(unlocked);
  }

}


// SEGURIDAD -------------------------------------------------------------------

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


// INICIALIZACIONES ------------------------------------------------------------

// Auto-inicialización de los usuarios semilla

export async function initRegisteredUsersFromSeeds() {
  const registered = getRegisteredUsers();
  // Si ya hay usuarios, no tocar nada
  if (registered.length > 0) return;
  const seeds = await getSeedUsers();
  saveRegisteredUsers(seeds);
}


// Auto-inicialización global del Toast

function ensureToastElement() {
  if (document.getElementById("achievement-toast")) return;

  const toast = document.createElement("div");
  toast.id = "achievement-toast";
  toast.className = "achievement-toast hidden";

  document.body.appendChild(toast);
}

// Auto-arranque global

window.addEventListener("DOMContentLoaded", () => {
  ensureToastElement();
  playAchievementToasts();
});
