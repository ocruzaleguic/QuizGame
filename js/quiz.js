import { lsGet, lsSet, lsRemove, loadJSON, resetKeys, addXP } from "./utils.js";

// Redirección sin doble renderización
if (!localStorage.getItem("selected_area")) {
  window.location.replace("seleccion-area.html");
}

// QUIZ ----------------------------------------------------------------------

// Estado del Quiz en localStorage ----------------------------
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

// Cargar Preguntas -------------------------------------------

function loadQuestions() {
  const selectedArea = lsGet("selected_area");

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

// Inicializar los listeners ----------------------------------

let optionsContainer = null;
let submitBtn = null;

function initQuizPage() {
  optionsContainer = document.getElementById("optionsContainer");
  submitBtn = document.getElementById("submitBtn");

  optionsContainer.addEventListener("change", () => {
    submitBtn.disabled = false;
  });
}


// Mostrar Pregunta Actual ------------------------------------

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
    const label = document.createElement("label");
    label.className = "quiz-option";
    label.innerHTML = `
    <input type="radio" name="quizOption" value="${i}">
    <span>${opt}</span>
  `;

    optionsContainer.appendChild(label);
  });


  submitBtn.onclick = () => submitAnswer(q, questions);
}

function submitAnswer(q, questions) {
  const selected = document.querySelector("input[name='quizOption']:checked");
  if (!selected) return;

  const selectedIndex = Number(selected.value);
  const correctIndex = q.correctIndex;

  const optionDivs = document.querySelectorAll("#optionsContainer .quiz-option");
  const radios = document.querySelectorAll("input[name='quizOption']");



  // Al marcar "Aceptar respuesta" -----------------------------

  if (selectedIndex === correctIndex) {
    addScore();
    addXP(10);

    // Feedback visual -----------------------------------------

    optionDivs[selectedIndex].classList.add("correct");
  } else {
    optionDivs[selectedIndex].classList.add("incorrect");
    optionDivs[correctIndex].classList.add("correct");
  }

  // Desactivar UI mientras dura la retroalimentación ----------

  submitBtn.disabled = true;
  radios.forEach(r => r.disabled = true);

  // Espera de 1.5 segundos antes de avanzar -------------------

  setTimeout(() => {
    setIndex(getIndex() + 1);
    showCurrentQuestion(questions);
  }, 1500);
}


// QUIZ END -------------------------------------------------------------------------

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
