import { getRegisteredUsers, ensureGamification, lsGet, requireAuth } from "./utils.js";


// RANKING ------------------------------------------------------

runRanking();

function runRanking() {

  // SEGURIDAD 
  requireAuth();

  const ranking = getRanking();

  const tbody = document.getElementById("rankingBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const loggedUser = lsGet("loggedUser");

  ranking.forEach((user, index) => {
    const tr = document.createElement("tr");

    // Posición
    const posTd = document.createElement("td");
    posTd.textContent = index + 1;

    // Username
    const userTd = document.createElement("td");
    userTd.textContent = user.username;

    // XP
    const xpTd = document.createElement("td");
    xpTd.textContent = user.gamification.XP;


    // Resaltar usuario logueado --------------------
    if (loggedUser && user.id === loggedUser.id) {
      tr.classList.add("is-me");
    }

    tr.append(posTd, userTd, xpTd);
    tbody.appendChild(tr);
  });
}

// Retornar cadena de usuarios ordenada por XP de mayor a menor 

export function getRanking() {

  const users = getRegisteredUsers();

  const ranking = users.map(user => {
    const safeUser = { ...user };
    // Asegurar estructura de gamificación
    ensureGamification(safeUser);
    return safeUser;
  });

  // Ordenar por XP descendente
  ranking.sort(
    (a, b) => b.gamification.XP - a.gamification.XP
  );

  return ranking;
}