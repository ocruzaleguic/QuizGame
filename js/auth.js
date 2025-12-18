import {
  lsGet,
  lsSet,
  lsRemove,
  getRegisteredUsers,
  saveRegisteredUsers,
  resetKeys,
  generateUserId,
  ensureGamification,
  DEFAULT_GAMIFICATION,
  initRegisteredUsersFromSeeds
} from "./utils.js";


// LOGIN ----------------------------------------------------------------------------

async function runLogin() {

  // Inicializar usuarios seed solo la primera vez
  await initRegisteredUsersFromSeeds();

  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.onsubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const registeredUsers = getRegisteredUsers();

    const foundUser = registeredUsers.find(
      u => u.username === username && u.password === password
    );

    if (!foundUser) {
      errorMsg.style.display = "block";
      return;
    }

    // Asegurar estructura de gamificación
    const userWithXP = ensureGamification({ ...foundUser });

    // Guardar sesión sin password
    const safeUser = { ...userWithXP };
    delete safeUser.password;
    lsSet("loggedUser", safeUser);

    location.href = "menu.html";
  };
}


// REGISTRO -------------------------------------------------------------------------

async function runRegister() {

  // Inicializar usuarios seed solo la primera vez
  await initRegisteredUsersFromSeeds();

  const form = document.getElementById("registerForm");
  const errorMsg = document.getElementById("registerError");

  form.onsubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value.trim();

    const allUsers = getRegisteredUsers();

    // Validación global
    const exists = allUsers.some(
      u => u.email === email || u.username === username
    );

    if (exists) {
      errorMsg.style.display = "block";
      return;
    }

    // Crear nuevo usuario
    const newUser = {
      id: generateUserId(),
      name,
      email,
      username,
      password,
      gamification: { ...DEFAULT_GAMIFICATION }
    };

    allUsers.push(newUser);
    saveRegisteredUsers(allUsers);

    location.href = "login.html";
  };
}


// FUNCIONES AUXILIARES -------------------------------------------------------------

// Logout limpio
export function logout() {
  lsRemove("loggedUser");
  resetKeys(["quiz_index", "quiz_score", "selected_area"]);
  location.href = "login.html";
}

// Auto-redirección desde index
function autoRedirectFromIndex() {
  if (document.body.dataset.page === "index") {
    const logged = lsGet("loggedUser");
    if (logged) location.href = "menu.html";
  }
}


// INIT -----------------------------------------------------------------------------

window.onload = () => {
  const page = document.body.dataset.page;

  if (page === "login") runLogin();
  if (page === "register") runRegister();
  if (page === "index") autoRedirectFromIndex();
};
