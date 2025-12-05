import { lsGet, lsSet, loadJSON, requireAuth } from "./utils.js";

// No permitir entrar a esta página sin login
requireAuth();

const areasContainer = document.getElementById("areasContainer");
const continueBtn = document.getElementById("continueBtn");

let selectedArea = lsGet("selected_area");

// Inicializar página
init();

async function init() {
  const data = await loadJSON("./data/quiz.json");


  // Render de áreas

  data.areas.forEach(area => {
    const div = document.createElement("div");
    div.className = "area-item";

    div.innerHTML = `
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
        <input type="radio" name="area" value="${area.id}" 
            ${selectedArea === area.id ? "checked" : ""}>
        ${area.name}
      </label>
    `;

    areasContainer.appendChild(div);
  });
  

  // Habilitar botón si ya hay una seleccionada

  if (selectedArea) {
    continueBtn.disabled = false;
  }

  const radios = document.querySelectorAll("input[name='area']");

  radios.forEach(radio => {
    radio.addEventListener("change", e => {
      selectedArea = e.target.value;
      lsSet("selected_area", selectedArea);
      continueBtn.disabled = false;
    });
  });

  continueBtn.addEventListener("click", () => {
    location.href = "./menu.html";
  });
}
