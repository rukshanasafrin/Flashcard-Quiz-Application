const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
const startQuizButton = document.getElementById("start-quiz");
const quizSection = document.getElementById("quiz-section");
const quizQuestion = document.getElementById("quiz-question");
const quizAnswer = document.getElementById("quiz-answer");
const submitQuizAnswerButton = document.getElementById("submit-quiz-answer");
const restartQuizButton = document.getElementById("restart-quiz");
const quizFeedback = document.getElementById("quiz-feedback");
const closeQuizBtn = document.getElementById("close-quiz-btn");

let editBool = false;
let flashcards = [];
let currentQuestionIndex = 0;
let score = 0;

addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

closeBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  addQuestionCard.classList.add("hide");
  if (editBool) {
    editBool = false;
    submitQuestion();
  }
});

cardButton.addEventListener("click", () => {
  editBool = false;
  tempQuestion = question.value.trim();
  tempAnswer = answer.value.trim();
  if (!tempQuestion || !tempAnswer) {
    errorMessage.classList.remove("hide");
  } else {
    container.classList.remove("hide");
    errorMessage.classList.add("hide");
    flashcards.push({ question: tempQuestion, answer: tempAnswer });
    viewlist();
    question.value = "";
    answer.value = "";
  }
});

function viewlist() {
  const listCard = document.getElementsByClassName("card-list-container")[0];
  listCard.innerHTML = '';
  flashcards.forEach((card, index) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML += `<p class="question-div">${card.question}</p>`;
    const displayAnswer = document.createElement("p");
    displayAnswer.classList.add("answer-div", "hide");
    displayAnswer.innerText = card.answer;
    const link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "show-hide-btn");
    link.innerHTML = "Show/Hide";
    link.addEventListener("click", () => {
      displayAnswer.classList.toggle("hide");
    });
    div.appendChild(link);
    div.appendChild(displayAnswer);
    const buttonsCon = document.createElement("div");
    buttonsCon.classList.add("buttons-con");
    const editButton = document.createElement("button");
    editButton.setAttribute("class", "edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", () => {
      editBool = true;
      modifyElement(editButton, true);
      addQuestionCard.classList.remove("hide");
    });
    buttonsCon.appendChild(editButton);
    disableButtons(false);
    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      modifyElement(deleteButton);
    });
    buttonsCon.appendChild(deleteButton);
    div.appendChild(buttonsCon);
    listCard.appendChild(div);
  });
  hideQuestion();
}

const modifyElement = (element, edit = false) => {
  const parentDiv = element.parentElement.parentElement;
  const parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    const parentAns = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAns;
    question.value = parentQuestion;
    disableButtons(true);
  }
  const index = flashcards.findIndex(card => card.question === parentQuestion);
  if (index !== -1) {
    flashcards.splice(index, 1);
  }
  parentDiv.remove();
};

const disableButtons = (value) => {
  const editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};

startQuizButton.addEventListener("click", () => {
  if (flashcards.length === 0) {
    alert("No flashcards added. Please add some flashcards first.");
    return;
  }
  container.classList.add("hide");
  quizSection.classList.remove("hide");
  currentQuestionIndex = 0;
  score = 0;
  quizFeedback.innerText = '';
  showNextQuestion();
});

const showNextQuestion = () => {
  if (currentQuestionIndex < flashcards.length) {
    quizQuestion.innerText = flashcards[currentQuestionIndex].question;
    quizAnswer.value = '';
  } else {
    endQuiz();
  }
};

submitQuizAnswerButton.addEventListener("click", () => {
  const userAnswer = quizAnswer.value.trim();
  if (userAnswer === flashcards[currentQuestionIndex].answer) {
    score++;
  }
  currentQuestionIndex++;
  showNextQuestion();
});

const endQuiz = () => {
  quizQuestion.innerText = '';
  quizAnswer.value = '';
  quizFeedback.innerText = `Quiz completed! Your score is ${score} out of ${flashcards.length}.`;
};

restartQuizButton.addEventListener("click", () => {
  currentQuestionIndex = 0;
  score = 0;
  quizFeedback.innerText = '';
  showNextQuestion();
});

function hideQuestion() {
  addQuestionCard.classList.add("hide");
}

closeQuizBtn.addEventListener("click", () => {
  quizSection.classList.add("hide");
  container.classList.remove("hide");
});