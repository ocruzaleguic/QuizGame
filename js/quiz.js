
// LocalStorage – Estado del Quiz


// -----------------------------------------------
function getIndex() {
  return Number(localStorage.getItem("quiz_index")) || 0;
}
function setIndex(i) {
  localStorage.setItem("quiz_index", i);
}


// -----------------------------------------------
function getScore() {
  return Number(localStorage.getItem("quiz_score")) || 0;
}
function addScore() {
  localStorage.setItem("quiz_score", getScore() + 1);
}


function resetQuizState() {
  localStorage.setItem("quiz_index", 0);
  localStorage.setItem("quiz_score", 0);
}



// Cargar Preguntas con Fetch

function loadQuestions() {
  return fetch("./data/quiz.json")
    .then(res => res.json())
    .then(data => data.questions || []);
}


// Mostrar la Pregunta Actual

function showCurrentQuestion(questions) {

  const index = getIndex();
  const q = questions[index];

  if (!q) {
    // No hay más preguntas → final
    location.href = "quizEnd.html";
    return;
  }


  // DOM - Quiz

  const questionText = document.getElementById("questionText");
  const optionsContainer = document.getElementById("optionsContainer");
  const submitBtn = document.getElementById("submitBtn");

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

  optionsContainer.addEventListener("change", () => {
    submitBtn.disabled = false;
  });

  // validar + sumar puntaje
  submitBtn.onclick = () => {
    const selected = document.querySelector("input[name='quizOption']:checked");
    if (!selected) return;

    const selectedIndex = Number(selected.value);

    if (selectedIndex === q.correctIndex) {
      addScore();
    }

    // Avanzar a la siguiente pregunta
    setIndex(index + 1);

    showCurrentQuestion(questions);
  };
}


// Página Final – Mostrar Puntaje

function showFinalScreen(questions) {

  const score = getScore();
  const total = questions.length;

  document.getElementById("finalScore").textContent =
    `${score} / ${total}`;

  document.getElementById("btnRestart").onclick = () => {
    resetQuizState();
    location.href = "quiz.html";
  };

  document.getElementById("btnFinish").onclick = () => {
    resetQuizState();
    location.href = "menu.html";
  };
}


// Inicializador automático

window.onload = () => {

  const page = document.body.dataset.page;

  // ------ Página QUIZ ------
  if (page === "quiz") {

    // Si el quiz está sin estado (primera vez)
    if (localStorage.getItem("quiz_index") === null) {
      resetQuizState();
    }

    loadQuestions().then(questions => {
      showCurrentQuestion(questions);
    });
  }

  // ------ Página FINAL ------
  if (page === "end") {

    loadQuestions().then(questions => {
      showFinalScreen(questions);
    });
  }
};

// En caso se cierre el navegador

window.addEventListener("pagehide", (event) => {
  
  const page = document.body.dataset.page;

  if (page !== "quiz" && page !== "end") return;

  if (event.persisted ) return;

  localStorage.removeItem("quiz_index");
  localStorage.removeItem("quiz_score");

});
