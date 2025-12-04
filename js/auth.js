import { 
  lsGet, 
  lsSet,
  lsRemove,
  loadJSON,
  getRegisteredUsers, 
  saveRegisteredUsers, 
  getSeedUsers, 
  getAllUsers,
  resetKeys 
} from "./utils.js";



// LOGIN ----------------------------------------------------------------------------

async function runLogin() {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // ✔️ Ahora cargas todos los usuarios combinados
    const allUsers = await getAllUsers();

    const foundUser = allUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password, ...safeUser } = foundUser;
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

    // ✔️ Cargar TODOS los usuarios (semilla + registrados)
    const allUsers = await getAllUsers();

    // Validación correcta sobre todo el sistema
    const exists = allUsers.some(
      u => u.email === email || u.username === username
    );

    if (exists) {
      errorMsg.style.display = "block";
      return;
    }

    // Añadir SOLO a los registrados (localStorage)
    const registered = getRegisteredUsers();
    registered.push({ name, email, username, password });
    saveRegisteredUsers(registered);

    location.href = "login.html";
  };
}



// FUNCIONES UTILES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


// Proteger las pantallas privadas

export function requireAuth() {
  const logged = lsGet("loggedUser");
  if (!logged) location.href = "login.html";
}

// Logout limpio y seguro

export function logout() {
  lsRemove("loggedUser");
  resetKeys(["quiz_index", "quiz_score"]);
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