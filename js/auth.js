import {
  lsGet,
  lsSet,
  lsRemove,
  getRegisteredUsers,
  saveRegisteredUsers,
  getAllUsers,
  resetKeys,
  generateUserId,
  ensureGamification,
  syncUser
} from "./utils.js";


// LOGIN ----------------------------------------------------------------------------

async function runLogin() {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const allUsers = await getAllUsers();

    const foundUser = allUsers.find(
      u => u.username === username && u.password === password
    );

    if (!foundUser) {
      errorMsg.style.display = "block";
      return;
    }

    // Asegurar XP
    const userWithXP = ensureGamification({ ...foundUser });

    // ¿Ya existe en registeredUsers?
    let reg = getRegisteredUsers();
    const exists = reg.some(u => u.id === userWithXP.id);

    // Migración desde seed → conservar password
    if (!exists) {
      reg.push({ ...userWithXP });
      saveRegisteredUsers(reg);
    }

    // Recuperar usuario real
    const persistent = reg.find(u => u.id === userWithXP.id);

    // Guardar sesión sin password
    const safeUser = { ...persistent };
    delete safeUser.password;
    lsSet("loggedUser", safeUser);

    location.href = "menu.html";
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
