let currentQuestionIndex = 0;
let quizQuestions = [];
let player1 = { name: "", correctAnswers: 0, wrongAnswers: 0 };
let player2 = { name: "", correctAnswers: 0, wrongAnswers: 0 };
let currentPlayer = 1;

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions();
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
function startQuiz() {
    player1.name = document.getElementById('player1Name').value;
    player2.name = document.getElementById('player2Name').value;
}
});

async function fetchQuestions() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/MaryamAarhus/MaryamAarhus.github.io/main/data/questions.json');
        const data = await response.json();
        quizQuestions = data;
        displayQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        // Handle errors as appropriate
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuiz();
        return;
    }

    const questionContainer = document.getElementById('question');
    const answerOptions = document.getElementById('answer-options');
    const nextButton = document.getElementById('next-question');

    // Reset
    questionContainer.innerHTML = '';
    answerOptions.innerHTML = '';
    nextButton.disabled = true;

    // Set question text
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;

    // Create answer buttons
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.textContent = option.text;
        li.onclick = () => selectAnswer(option.isCorrect, index);
        answerOptions.appendChild(li);
    });
}

function selectAnswer(isCorrect, index) {
    const answerOptions = document.getElementById('answer-options');
    const children = Array.from(answerOptions.children);

    if (isCorrect) {
        currentPlayer === 1 ? player1.correctAnswers++ : player2.correctAnswers++;
    } else {
        currentPlayer === 1 ? player1.wrongAnswers++ : player2.wrongAnswers++;
    }
    updateScoreUI();

    children.forEach((child, idx) => {
        if (idx === index) {
            child.classList.add(isCorrect ? 'correct' : 'incorrect');
        } else {
            child.classList.add('disabled');
        }
    });

    const nextButton = document.getElementById('next-question');
    nextButton.disabled = false;
    // Switch player after answering
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

function updateScoreUI() {
    // Update the UI with the new scores
    document.getElementById('player1CorrectAnswers').textContent = player1.correctAnswers;
    document.getElementById('player1WrongAnswers').textContent = player1.wrongAnswers;
    document.getElementById('player2CorrectAnswers').textContent = player2.correctAnswers;
    document.getElementById('player2WrongAnswers').textContent = player2.wrongAnswers;
}

document.getElementById('next-question').addEventListener('click', () => {
    currentQuestionIndex++;
    displayQuestion();
});

function endQuiz() {
    let winnerName = player1.correctAnswers > player2.correctAnswers ? player1.name : player2.name;
    let winnerScore = player1.correctAnswers > player2.correctAnswers ? player1.correctAnswers : player2.correctAnswers;
    
    alert(`${winnerName} wins with a score of ${winnerScore}!`);
    
    // Make the "Show Results" button visible
    const showResultsButton = document.getElementById('showResultsButton');
    showResultsButton.classList.remove('hidden');
    
    // Add click event listener to the "Show Results" button
    showResultsButton.addEventListener('click', () => {
        // Redirect to the winner page or display the results in any other way
        window.location.href = `winner.html?winner=${encodeURIComponent(winnerName)}&score=${winnerScore}`;
    });
}




