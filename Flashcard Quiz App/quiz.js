const flashcardsContainer = document.querySelector(".card-list-container");
const addQuestionCard = document.getElementById("add-question-card");
const saveBtn = document.getElementById("save-btn");
const questionInput = document.getElementById("question");
const answerInput = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addFlashcardBtn = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const startQuizBtn = document.getElementById("start-quiz");
const quizSection = document.getElementById("quiz-section");
const quizQuestion = document.getElementById("quiz-question");
const quizAnswer = document.getElementById("quiz-answer");
const submitQuizAnswerBtn = document.getElementById("submit-quiz-answer");
const restartQuizBtn = document.getElementById("restart-quiz");
const quizFeedback = document.getElementById("quiz-feedback");
const closeQuizBtn = document.getElementById("close-quiz-btn");
const quizProgress = document.getElementById("quiz-progress");
const deleteAllBtn = document.getElementById("delete-all");
const emptyState = document.getElementById("empty-state");

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let editCardId = null;
let currentQuestionIndex = 0;
let score = 0;

function saveToLocalStorage() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function resetForm() {
  questionInput.value = "";
  answerInput.value = "";
  errorMessage.classList.add("hidden");
  editCardId = null;
  saveBtn.textContent = "Save Flashcard";
}

function openForm() {
  addQuestionCard.classList.remove("hidden");
  questionInput.focus();
}

function closeForm() {
  addQuestionCard.classList.add("hidden");
  resetForm();
}

function renderFlashcards() {
  flashcardsContainer.innerHTML = "";

  if (flashcards.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  flashcards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const questionEl = document.createElement("h3");
    questionEl.textContent = card.question;

    const answerEl = document.createElement("div");
    answerEl.className = "answer-div hidden";
    answerEl.textContent = card.answer;

    const cardActions = document.createElement("div");
    cardActions.className = "card-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "small-btn toggle-btn";
    toggleBtn.textContent = "Show Answer";
    toggleBtn.addEventListener("click", () => {
      answerEl.classList.toggle("hidden");
      toggleBtn.textContent = answerEl.classList.contains("hidden")
        ? "Show Answer"
        : "Hide Answer";
    });

    const actionGroup = document.createElement("div");
    actionGroup.className = "action-group";

    const editBtn = document.createElement("button");
    editBtn.className = "small-btn edit-btn";
    editBtn.innerHTML = `<i class="fa-solid fa-pen"></i>`;
    editBtn.title = "Edit Flashcard";
    editBtn.addEventListener("click", () => editFlashcard(card.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "small-btn delete-btn";
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteBtn.title = "Delete Flashcard";
    deleteBtn.addEventListener("click", () => deleteFlashcard(card.id));

    actionGroup.appendChild(editBtn);
    actionGroup.appendChild(deleteBtn);

    cardActions.appendChild(toggleBtn);
    cardActions.appendChild(actionGroup);

    cardElement.appendChild(questionEl);
    cardElement.appendChild(answerEl);
    cardElement.appendChild(cardActions);

    flashcardsContainer.appendChild(cardElement);
  });
}

function addOrUpdateFlashcard() {
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();

  if (!question || !answer) {
    errorMessage.classList.remove("hidden");
    return;
  }

  errorMessage.classList.add("hidden");

  if (editCardId) {
    flashcards = flashcards.map((card) =>
      card.id === editCardId ? { ...card, question, answer } : card
    );
  } else {
    flashcards.push({
      id: Date.now(),
      question,
      answer,
    });
  }

  saveToLocalStorage();
  renderFlashcards();
  closeForm();
}

function editFlashcard(id) {
  const card = flashcards.find((item) => item.id === id);
  if (!card) return;

  questionInput.value = card.question;
  answerInput.value = card.answer;
  editCardId = id;
  saveBtn.textContent = "Update Flashcard";
  openForm();
}

function deleteFlashcard(id) {
  flashcards = flashcards.filter((card) => card.id !== id);
  saveToLocalStorage();
  renderFlashcards();
}

function deleteAllFlashcards() {
  if (flashcards.length === 0) return;

  const confirmDelete = confirm("Are you sure you want to delete all flashcards?");
  if (!confirmDelete) return;

  flashcards = [];
  saveToLocalStorage();
  renderFlashcards();
  closeQuiz();
}

function startQuiz() {
  if (flashcards.length === 0) {
    alert("No flashcards available. Please add some flashcards first.");
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";

  quizSection.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= flashcards.length) {
    endQuiz();
    return;
  }

  const currentCard = flashcards[currentQuestionIndex];
  quizQuestion.textContent = currentCard.question;
  quizAnswer.value = "";
  quizProgress.textContent = `Question ${currentQuestionIndex + 1} of ${flashcards.length}`;
  quizAnswer.focus();
}

function submitQuizAnswer() {
  if (currentQuestionIndex >= flashcards.length) return;

  const userAnswer = quizAnswer.value.trim();
  if (!userAnswer) {
    quizFeedback.textContent = "Please enter an answer before submitting.";
    quizFeedback.className = "quiz-feedback wrong";
    return;
  }

  const correctAnswer = flashcards[currentQuestionIndex].answer.trim();

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    score++;
    quizFeedback.textContent = "Correct!";
    quizFeedback.className = "quiz-feedback correct";
  } else {
    quizFeedback.textContent = `Incorrect. Correct answer: ${correctAnswer}`;
    quizFeedback.className = "quiz-feedback wrong";
  }

  currentQuestionIndex++;

  setTimeout(() => {
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz-feedback";
    showQuestion();
  }, 1200);
}

function endQuiz() {
  quizProgress.textContent = "Quiz Completed";
  quizQuestion.textContent = "Great job! You've completed the quiz.";
  quizAnswer.value = "";
  quizAnswer.style.display = "none";
  submitQuizAnswerBtn.style.display = "none";

  quizFeedback.innerHTML = `
    <div class="score-box">
      Quiz completed! Your score is <strong>${score}</strong> out of <strong>${flashcards.length}</strong>.
    </div>
  `;
}

function restartQuiz() {
  if (flashcards.length === 0) return;

  quizAnswer.style.display = "block";
  submitQuizAnswerBtn.style.display = "inline-block";
  currentQuestionIndex = 0;
  score = 0;
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";
  showQuestion();
}

function closeQuiz() {
  quizSection.classList.add("hidden");
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";
  quizAnswer.style.display = "block";
  submitQuizAnswerBtn.style.display = "inline-block";
}

addFlashcardBtn.addEventListener("click", () => {
  resetForm();
  openForm();
});

closeBtn.addEventListener("click", closeForm);
saveBtn.addEventListener("click", addOrUpdateFlashcard);
startQuizBtn.addEventListener("click", startQuiz);
submitQuizAnswerBtn.addEventListener("click", submitQuizAnswer);
restartQuizBtn.addEventListener("click", restartQuiz);
closeQuizBtn.addEventListener("click", closeQuiz);
deleteAllBtn.addEventListener("click", deleteAllFlashcards);

quizAnswer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitQuizAnswer();
  }
});

renderFlashcards();
