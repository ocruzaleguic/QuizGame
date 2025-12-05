import { lsGet, lsSet, lsRemove, loadJSON, resetKeys } from "./utils.js";

let optionsContainer = null;
let submitBtn = null;

// Estado del Quiz

function getIndex() {
  return lsGet("quiz_index", 0);
}

function setIndex(i) {
  lsSet("quiz_index", i);
}

function getScore() {
  return lsGet("quiz_score", 0);
}

function addScore() {
  lsSet("quiz_score", getScore() + 1);
}

function resetQuizState() {
  lsSet("quiz_index", 0);
  lsSet("quiz_score", 0);
}

// Cargar Preguntas

function loadQuestions() {
  const selectedArea = lsGet("selected_area");

  // Si NO hay área seleccionada → redirigir a seleccion-area
  if (!selectedArea) {
    location.href = "seleccion-area.html";
    return Promise.resolve([]);
  }

  return loadJSON("./data/quiz.json")
    .then(data => {
      const area = data.areas.find(a => a.id === selectedArea);
      if (!area) {
        alert("Área inválida o sin preguntas.");
        location.href = "seleccion-area.html";
        return [];
      }
      return area.questions;
    });
}


// Función para inicializar el listener
function initQuizPage() {
  optionsContainer = document.getElementById("optionsContainer");
  submitBtn = document.getElementById("submitBtn");

  optionsContainer.addEventListener("change", () => {
    submitBtn.disabled = false;
  });
}


// Mostrar Pregunta Actual

function showCurrentQuestion(questions) {
  const index = getIndex();
  const q = questions[index];

  if (!q) {
    location.href = "quizEnd.html";
    return;
  }

  const questionText = document.getElementById("questionText");

  questionText.textContent = q.question;
  optionsContainer.innerHTML = "";
  submitBtn.disabled = true;

  q.options.forEach((opt, i) => {
    const lbl = document.createElement("label");
    lbl.className = "option-item";
    lbl.innerHTML = `
      <input type="radio" name="quizOption" value="${i}">
      <span>${opt}</span>
    `;
    optionsContainer.appendChild(lbl);
  });

  submitBtn.onclick = () => {
    const selected = document.querySelector("input[name='quizOption']:checked");
    if (!selected) return;

    const selectedIndex = Number(selected.value);

    if (selectedIndex === q.correctIndex) {
      addScore();
    }

    setIndex(index + 1);
    showCurrentQuestion(questions);
  };
}

// Página Final – Puntaje

function showFinalScreen(questions) {
  const score = getScore();
  const total = questions.length;

  document.getElementById("finalScore").textContent = `${score} / ${total}`;

  document.getElementById("btnRestart").onclick = () => {
    resetQuizState();
    location.href = "quiz.html";
  };

  document.getElementById("btnFinish").onclick = () => {
    resetQuizState();
    location.href = "menu.html";
  };
}

// Inicializador

window.onload = () => {
  const page = document.body.dataset.page;

  if (page === "quiz") {

  // Si NO hay área seleccionada  redirigir
  if (!lsGet("selected_area")) {
    location.href = "seleccion-area.html";
    return;
  }

  if (lsGet("quiz_index") === null) resetQuizState();

  initQuizPage();
  loadQuestions().then(showCurrentQuestion);
}


  if (page === "end") {
    loadQuestions().then(showFinalScreen);
  }
};

// Limpiar estado al cerrar

window.addEventListener("pagehide", (event) => {
  const page = document.body.dataset.page;

  if (page !== "quiz" && page !== "end") return;
  if (event.persisted) return;

  resetKeys(["quiz_index", "quiz_score"]);
});
