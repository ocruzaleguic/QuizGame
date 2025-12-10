import {
  lsGet,
  lsSet,
  lsRemove,
  loadJSON,
  getRegisteredUsers,
  saveRegisteredUsers,
  getSeedUsers,
  getAllUsers,
  resetKeys,
  generateUserId,
  ensureGamification
} from "./utils.js";


// LOGIN ----------------------------------------------------------------------------

async function runLogin() {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Carga de los usuarios combinados (seeds + registrados)
    const allUsers = await getAllUsers();

    const foundUser = allUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      // Asegurar que el usuario tenga gamification
      const userWithXP = ensureGamification({ ...foundUser });

      // Registrar en registeredUsers si aún no existe (migra semilla)
      let reg = getRegisteredUsers();
      const exists = reg.some(u => u.id === userWithXP.id);

      if (!exists) {
        // Guardamos la versión persistente (incluye gamification)
        reg.push(userWithXP);
        saveRegisteredUsers(reg);
      }

      // Recuperar la versión persistente (para mantener consistencia)
      const persistent = reg.find(u => u.id === userWithXP.id);

      // Guardar loggedUser sin password
      const { password: _pwd, ...safeUser } = persistent;
      lsSet("loggedUser", safeUser);

      location.href = "menu.html";
    } else {
      errorMsg.style.display = "block";
    }
  };
}


// REGISTRO -------------------------------------------------------------------------

function runRegister() {
  const form = document.getElementById("registerForm");
  const errorMsg = document.getElementById("registerError");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value.trim();

    // Cargar TODOS los usuarios (semilla + registrados)
    const allUsers = await getAllUsers();

    // Validación correcta sobre todo el sistema
    const exists = allUsers.some(
      u => u.email === email || u.username === username
    );

    if (exists) {
      errorMsg.style.display = "block";
      return;
    }

    // Crear nuevo usuario con id y gamification
    const newUser = {
      id: generateUserId(),
      name,
      email,
      username,
      password,
      gamification: { XP: 0 }
    };

    // Añadir SOLO a los registrados (localStorage)
    const registered = getRegisteredUsers();
    registered.push(newUser);
    saveRegisteredUsers(registered);

    location.href = "login.html";
  };
}



// FUNCIONES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


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

// Inicializador
window.onload = () => {
  const page = document.body.dataset.page;

  if (page === "login") runLogin();
  if (page === "register") runRegister();
  if (page === "index") autoRedirectFromIndex();
};
