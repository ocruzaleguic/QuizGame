import { getRegisteredUsers, ensureGamification, lsGet, requireAuth } from "./utils.js";

// SEGURIDAD
requireAuth();


// RANKING ------------------------------------------------------------

runRanking();

function runRanking() {

  const ranking = getRanking();

  const tbody = document.getElementById("rankingList");
  if (!tbody) return;
  tbody.innerHTML = "";

  const loggedUser = lsGet("loggedUser");

  // Manejo de empates
  let lastXP = null;
  let displayPosition = 0;

  ranking.forEach((user, index) => {

  // Posición con empate
  if (user.gamification.XP !== lastXP) {
    displayPosition = index + 1;
    lastXP = user.gamification.XP;
  }

  const card = document.createElement("div");
  card.classList.add("ranking-card");

  // Top 3 visual
  if (displayPosition === 1) card.classList.add("gold");
  else if (displayPosition === 2) card.classList.add("silver");
  else if (displayPosition === 3) card.classList.add("bronze");

  // Usuario logueado
  if (loggedUser && user.id === loggedUser.id) {
    card.classList.add("is-me");
  }

  card.innerHTML = `
    <div class="rank-position">${displayPosition}</div>
    <div class="rank-user">${user.username}</div>
    <div class="rank-xp">${user.gamification.XP} XP</div>
  `;

  tbody.appendChild(card);
});

}

// Retornar array de Ranking ----------------------------

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