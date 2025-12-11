import { lsGet, lsSet, loadJSON, requireAuth } from "./utils.js";

// No permitir entrar a esta página sin login

requireAuth();

const areasContainer = document.getElementById("areasContainer");
const continueBtn = document.getElementById("continueBtn");

let selectedArea = lsGet("selected_area");  // Puede existir por sesiones previas

if (areasContainer && continueBtn) {
  init();
}


async function init() {
  const data = await loadJSON("./data/quiz.json");

  // Render de áreas
  data.areas.forEach(area => {
  const label = document.createElement("label");
  label.className = "area-item";

  label.innerHTML = `
    <input type="radio" name="area" value="${area.id}"
      ${selectedArea === area.id ? "checked" : ""}>
    ${area.name}
  `;

  areasContainer.appendChild(label);
});


  // Habilitar botón si ya había algo guardado
  if (selectedArea) {
    continueBtn.disabled = false;
  }

  const radios = document.querySelectorAll("input[name='area']");

  radios.forEach(radio => {
    radio.addEventListener("change", e => {
      selectedArea = e.target.value;
      continueBtn.disabled = false;   // Solo habilitar el botón
    });
  });

  continueBtn.addEventListener("click", () => {
    if (!selectedArea) return;
    lsSet("selected_area", selectedArea);
    location.href = "./menu.html";
  });
}

// FUNCIONES REUTILIZABLES --------------------------------------------------

// Devuelve el ID del area
export function getSelectedAreaId() {
    return lsGet("selected_area");
}

// Carga quiz.json y devuelve el área completa
export async function loadSelectedArea() {
    const id = getSelectedAreaId();
    if (!id) return null;

    try {
        const res = await fetch("./data/quiz.json");
        const data = await res.json();

        return data.areas.find(a => a.id === id) || null;
    } catch (err) {
        console.error("Error cargando área:", err);
        return null;
    }
}

// Devuelve el nombre del área
export async function showSelectedArea(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const area = await loadSelectedArea();
    el.textContent = area ? `Área: ${area.name}` : "Área no seleccionada";
}
