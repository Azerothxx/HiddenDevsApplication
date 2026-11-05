// Connected Discord-GitHub
// Disc (Azerothxx) Roblox (Azerothxx)

// Various HTML DOM elements
const startBtn = document.getElementById("start-btn");
const quizScreen = document.getElementById("quiz-screen");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const progressBar = document.getElementById("progress");
const startScreen = document.getElementById("start-screen");
const resultScreen = document.getElementById("result-screen");
const finalScore = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultsMessage = document.getElementById("results-message");
const cardsContainer = document.getElementById("cards-container");
const restartBtn = document.getElementById("restart-btn");

// Quiz Data
const quizQuestions = [
    {
        question: "What is the capital of the Philippines?",
        answers: [
            { text: "Davao", correct: false },
            { text: "Cebu", correct: false },
            { text: "Manila", correct: true },
            { text: "Mactan", correct: false },
        ],
    },
    {
        question: "Who is our national hero?",
        answers: [
            { text: "Apolonario Mabini", correct: false },
            { text: "Jose Rizal", correct: true },
            { text: "Andres Bonifacio", correct: false },
            { text: "J Rizz", correct: false },
        ],
    },
    {
        question: "What is the language of the Filipinos?",
        answers: [
            { text: "English", correct: false },
            { text: "Spanish", correct: false },
            { text: "Filipino", correct: true },
            { text: "Bisaya", correct: false },
        ],
    },
    {
        question: "How many islands are in the Philippines?",
        answers: [
            { text: "5,000", correct: false },
            { text: "7,641", correct: true },
            { text: "10,000", correct: false },
            { text: "3,500", correct: false },
        ],
    },
    {
        question: "What is the currency of the Philippines?",
        answers: [
            { text: "Peso", correct: true },
            { text: "Dollar", correct: false },
            { text: "Yen", correct: false },
            { text: "Rupee", correct: false },
        ],
    },
];

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let answerDisabled = false;
let quizCards = [];

// HTML DOM elements init
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Event Listeners
startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);

// Functions

/*   
    Shows randomly positioned gif, (not actually a random gif) 
*/
function addRandomGif() {
    const img = document.createElement("img");
    img.src =
        "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGEyYmg1MTFueGp2ZWVlamM2NWpscWJmNXFkbGlwdmZxMXRhMm8zcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohs4CacylzFaHjMM8/giphy.gif";
    img.classList.add("random-gif");
    img.style.position = "fixed";
    img.style.left = Math.random() * (window.innerWidth - 150) + "px";
    img.style.top = Math.random() * (window.innerHeight - 150) + "px";
    img.style.width = "150px";
    img.style.zIndex = "1000";
    img.style.pointerEvents = "none";

    document.body.appendChild(img);
}

/*   
    After effect update for dom elements
*/
function showResults() {
    const percentage = (score / quizQuestions.length) * 100;

    quizScreen.classList.remove("active");
    resultScreen.classList.add("active");

    finalScore.textContent = score;

    if (percentage === 100)
        resultsMessage.textContent =
            "Perfect score you are a good man have some chicken 🍗.";
    else if (percentage >= 80)
        resultsMessage.textContent = "The voices are sane enough.";
    else if (percentage >= 60)
        resultsMessage.textContent = "You are teetering on insanity.";
    else {
        for (let index = 0; index < 10; index++) {
            addRandomGif();
        }
        resultsMessage.textContent = "Ť̴̟̗̲̰̭̦̰̠͋́̀͆̆͐̏̈́͗̇̕̕͝h̶̤̩̘̣͍͋̀̾̆́̓͜ͅe̴̛̛̫͙̥͕̟͖͉̹̜͖̩̲̮̖̐̄̅̐͜ ̶̘̗̍͆̆͑͆̍̂͋͠͠v̴͔͈̠̥̤̙̻̠̱̫͔͋̒͑̑̿̚̕͝o̷͎̪̱͂͆͛̇̊͝ị̸̛̲͆͌̈́͒̀̎̄͑̈́̀͂͒̏͘c̴͕͎͋͘ë̸̛̗̳́̽̍̈́̑̓̈́̃̊̉̈́̎͠s̷̤̽̉̓͆̀̓͘͠ ̶̡̛̼̘̺͙͎̻̭̳̟̣̥͖͓̭̉̀̽͆͊̈́̑̈́̑̎͝ä̷̘̫͙̽̄̿̓͒̃̋͠r̵̦̗͓̯̣͕̣̞̟̦̬̣̎̆̐̅͆͌ȩ̴̧̢̲͖̲̲̣͇̪̱̺̓̐̽̔̃̈́ ̸̨̧̳̙͔͓͎̩̮̺̻͍͙̲͑͊͋̔i̵̧̟̼̙̫̎́̀͋͆́̐̚̕͠n̴̨̼̤͚͔̺͕͉͉̳̱̊͝ş̵̙̫͈͍̩̩͆́͊͑̽̆̂͂̍͐̕̕͘͜ī̷͈̏̊͌̈́́̌̈́̋̐̂̀̔̕d̶̮̞̰͍̪̘̄͛̊̈́̈ẹ̸͎̘̮͓̯̪̼̩̺̃̂̌̉̈́̈͑̄͝͝ͅ ̴̘̩̯͇̞̦̠̪̤͆̑͒̉̍̋̌̚͘͘͝m̶̺̤͙͉̺̘͈͈̏̃̄̆͋͑̈́͒̃̆̀̓͝ỹ̵̡͖͇̩͓̩̃̽̑̚͝͝ ̶̛̮̭̪͖̫̫̞̦̬̰̼̠̆͆͆̈̒̋́̍̇̆̀̕͜s̷̛̞̠̈́͛͊k̷̨̜͇͍̈́̊̓̀̿̃̍̑̐̄̊̒̕͝ì̶̧̛̝̥̞̰͕̅̅͛̌͑̈̾͌̆̾͂͝ͅn̶̢̛̥͖̗̺̰̭͇̓͐̐͂̏̌͂̇͋̃̚̚͠͠.";
    }
}

/*   
    Plays effects for an answer element and updates state
*/
function selectAnswer(event) {
    if (answerDisabled) return;
    answerDisabled = true;

    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    const currentCard = quizCards[currentQuestionIndex];
    const answersContainer = currentCard.querySelector(".answers-container");

    selectedButton.textContent = `You ${(isCorrect && "good") || "bad"} `;

    Array.from(answersContainer.children).forEach((button) => {
        if (button.dataset.correct === "true") button.classList.add("correct");
        else button.classList.add("incorrect");
    });

    if (isCorrect) {
        score++;
        scoreSpan.textContent = score;
    }

    setTimeout(() => {
        // Transition current card out
        currentCard.classList.remove("active");
        currentCard.classList.add("exit");

        currentQuestionIndex++;

        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion(isCorrect);
        } else {
            showResults();
        }
    }, 1000);
}

/*   
    Creates a card div and will place them in the div container with id/classs "cards-container"
    Houses 2 other elements text and the answers container     
*/
function createQuizCard(questionData, index) {
    const card = document.createElement("div");
    card.classList.add("quiz-card");
    card.dataset.index = index;

    const questionText = document.createElement("h2");
    questionText.classList.add("question-text");
    questionText.textContent = questionData.question;

    const answersContainer = document.createElement("div");
    answersContainer.classList.add("answers-container");

    // Loops through questionData answers, each to create a button for
    questionData.answers.forEach((answer) => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.classList.add("answers-btn");
        button.dataset.correct = answer.correct;
        button.addEventListener("click", selectAnswer);
        answersContainer.appendChild(button);
    });

    card.appendChild(questionText);
    card.appendChild(answersContainer);

    return card;
}

/*   
    Updates progress elements, condition check if to show another gif, shows next card
*/
function showQuestion(isCorrect) {
    answerDisabled = false;

    const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    progressBar.style.width = progressPercent + "%";

    // Will add a randomly positioned gif for every wrong answer
    if (isCorrect === false) {
        for (let index = 0; index < currentQuestionIndex; index++) {
            addRandomGif();
        }
    }

    // Activate the current card
    quizCards[currentQuestionIndex].classList.add("active");
}

function startQuiz() {
    // Clear out any existing GIFs
    document.querySelectorAll(".random-gif").forEach((gif) => gif.remove());

    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = score;

    startScreen.classList.remove("active");
    quizScreen.classList.add("active");

    cardsContainer.innerHTML = "";
    quizCards = [];

    quizQuestions.forEach((question, index) => {
        const card = createQuizCard(question, index);
        quizCards.push(card);
        cardsContainer.appendChild(card);
    });

    showQuestion();
}

function restartQuiz() {
    resultScreen.classList.remove("active");
    startQuiz();
}
