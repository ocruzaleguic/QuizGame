import { getRegisteredUsers, ensureGamification } from "./utils.js";

export function getRanking() {

  const users = getRegisteredUsers();

  const ranking = users.map(user => {

    // Clonamos para NO modificar el original
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


console.log("RANKING:", getRanking());
