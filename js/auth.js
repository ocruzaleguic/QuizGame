// Cargar usuarios registrados (localStorage)
function getRegisteredUsers() {
  const data = localStorage.getItem("registeredUsers");
  return data ? JSON.parse(data) : [];
}

// Guardar lista de usuarios registrados
function saveRegisteredUsers(list) {
  localStorage.setItem("registeredUsers", JSON.stringify(list));
}

// Guardar usuario logueado
function setLoggedUser(user) {
  localStorage.setItem("loggedUser", JSON.stringify(user));
}

// LOGIN principal
async function runLogin() {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("loginError");

  form.onsubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();



    // Cargar usuarios semilla
    const res = await fetch("./data/users.json");
    const data = await res.json();
    const seedUsers = data.users;

    // Cargar usuarios registrados del localStorage
    const registered = getRegisteredUsers();

    // Unir listas
    const allUsers = [...seedUsers, ...registered];

    // Buscar coincidencia
    const foundUser = allUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      // Guardar usuario logueado
      setLoggedUser(foundUser);

      // Redirigir
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

    // Validar duplicados
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
    const logged = localStorage.getItem("loggedUser");
    if (logged) {
      location.href = "menu.html";
    }
  }
}

// CARGA AUTOMÁTICA SEGÚN LA PÁGINA ACTUAL
window.onload = () => {

  const page = document.body.dataset.page;

  if (page === "login") runLogin();
  if (page === "register") runRegister();
  if (page === "index") autoRedirectFromIndex();

};
