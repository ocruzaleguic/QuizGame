import { lsGet, lsSet, loadJSON } from "./utils.js";

// Usuarios registrados

function getRegisteredUsers() {
  return lsGet("registeredUsers", []);
}

function saveRegisteredUsers(list) {
  lsSet("registeredUsers", list);
}

function setLoggedUser(user) {
  lsSet("loggedUser", user);
}

// LOGIN

async function runLogin() {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const data = await loadJSON("./data/users.json");
    const seedUsers = data.users;

    const registered = getRegisteredUsers();

    const allUsers = [...seedUsers, ...registered];

    const foundUser = allUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      setLoggedUser(foundUser);
      location.href = "menu.html";
    } else {
      errorMsg.style.display = "block";
    }
  };
}

// REGISTRO

function runRegister() {
  const form = document.getElementById("registerForm");
  const errorMsg = document.getElementById("registerError");

  form.onsubmit = (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const username = document.getElementById("regUser").value.trim();
    const password = document.getElementById("regPass").value.trim();

    const registered = getRegisteredUsers();

    const exists = registered.some(
      u => u.email === email || u.username === username
    );

    if (exists) {
      errorMsg.style.display = "block";
      return;
    }

    const newUser = { name, email, username, password };

    registered.push(newUser);
    saveRegisteredUsers(registered);

    location.href = "login.html";
  };
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
