import { ACHIEVEMENTS } from "./achievements.js";
import { lsGet, requireAuth } from "./utils.js";

const listContainer = document.getElementById("achievementsList");

init();

function init() {
  const logged = lsGet("loggedUser");
  if (!logged) return;

  const xp = logged.gamification?.XP ?? 0;
  const unlockedIds = logged.gamification?.achievements ?? [];

  ACHIEVEMENTS.forEach(a => {
    const isUnlocked = unlockedIds.includes(a.id);

    // Calcular progreso para el CSS
    const progressRatio = Math.min(xp / a.threshold, 1);
    const progressPercent = progressRatio * 100;

    const div = document.createElement("div");
    div.className = `achievement-item ${isUnlocked ? "unlocked" : "locked"}`;

    // LOGROS
    div.innerHTML = `
      <div class="achievement-progress">
        <div class="achievement-progress-fill" style="width:${progressPercent}%"></div>
      </div>

      <div class="achievement-content">
        <h3 class="achievement-title">
          ${isUnlocked ? "✔ " : ""}${a.name}
        </h3>

        <p class="achievement-desc">${a.description}</p>

        ${
          isUnlocked
            ? `<span class="achievement-status completed">Completado</span>`
            : `<span class="achievement-status pending">XP actual: ${xp} / ${a.threshold}</span>`
        }
      </div>
    `;

    listContainer.appendChild(div);
  });

}

// Proteger pantalla
requireAuth();