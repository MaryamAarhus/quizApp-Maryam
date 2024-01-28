document.addEventListener('DOMContentLoaded', async () => {
    let quizQuestions = [];
    const questionsList = document.getElementById('questionsList');
    const submittedQuestionsContainer = document.getElementById('submittedQuestions');
    const quizForm = document.getElementById('quizForm');
    const randomizeBtn = document.getElementById('randomize');
    const correctAnswerSelect = document.getElementById('correctAnswer');
    const filterInput = document.getElementById('filter');
    const saveQuestionsBtn = document.getElementById('saveQuestions');
    const sortOptionsSelect = document.getElementById('sortOptions');
    const saveQuizBtn = document.getElementById('saveQuiz');

    // Check if all necessary elements are present
    if (!questionsList || !submittedQuestionsContainer || !quizForm || !randomizeBtn || !correctAnswerSelect || !filterInput || !saveQuestionsBtn || !sortOptionsSelect || !saveQuizBtn) {
        console.error('One or more elements are missing in your HTML.');
        return;
    }

    // Fetch questions from the API
    try {
        const response = await fetch('https://raw.githubusercontent.com/MaryamAarhus/MaryamAarhus.github.io/main/data/questions.json');
        const data = await response.json();
        quizQuestions = data;
        displayQuestions(quizQuestions);  
    } catch (error) {
        console.error('Error fetching questions:', error);
    }

    attachEventListeners();

    function attachEventListeners() {
        quizForm.addEventListener('submit', handleQuizFormSubmit);
        randomizeBtn.addEventListener('click', randomizeOptions);
        correctAnswerSelect.addEventListener('change', updateOptionColors);
        filterInput.addEventListener('input', () => filterQuestions(filterInput.value.toLowerCase()));
        saveQuestionsBtn.addEventListener('click', saveQuestionsToLocal);
        sortOptionsSelect.addEventListener('change', handleSortChange);
        saveQuizBtn.addEventListener('click', saveQuiz);

        const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', () => filterQuestions(filterInput.value.toLowerCase()));
    } else {
        console.error('Search button element is missing!');
    }
    }

    function handleSortChange() {
    const sortMethod = sortOptionsSelect.value;
    if (sortMethod === 'alpha') {
        sortQuestionsAlphabetically();
    } else if (sortMethod === 'random') {
        sortQuestionsRandomly();
    }
    displayQuestions(); // Refresh the displayed questions after sorting
}


    function handleQuizFormSubmit(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate the form inputs
    if (validateForm()) {
        addQuestion();

        displaySubmittedQuestions();
    } else {
        console.log('Form validation failed.');
    }
}
function addQuestion() {
    if (!validateForm()) {
        return;
    }

    const questionTextElement = document.getElementById('question');
    if (!questionTextElement || !questionTextElement.value) {
        console.error('Question input not found or value is undefined');
        return;
    }
    const questionText = questionTextElement.value.trim();
    
    // Retrieve the options from the form
    const optionsElements = Array.from(document.getElementsByClassName('option'));
    
    // Correct answer index
    const correctAnswerSelect = document.getElementById('correctAnswer');
    if (!correctAnswerSelect) {
        console.error('Correct answer select not found');
        return;
    }
    const correctAnswerIndex = parseInt(correctAnswerSelect.value) - 1; 
    
    // Map the options from input fields to an array of option objects
    const options = optionsElements.map((optionElement, index) => ({
        text: optionElement.value.trim(),
        isCorrect: index === correctAnswerIndex
    }));

    // Log the options to the console
    console.log(options);

    // Create the new question object
    const newQuestion = {
        id: quizQuestions.length + 1, 
        question: questionText,
        options: options
    };

    quizQuestions.push(newQuestion);
    
    localStorage.setItem('quizQuestions', JSON.stringify(quizQuestions)); 

    document.getElementById('quizForm').reset();
    
    displaySubmittedQuestions(); 
}



function displaySubmittedQuestions(questionsToShow = quizQuestions) {
    const submittedQuestionsContainer = document.getElementById('submittedQuestions');
    submittedQuestionsContainer.innerHTML = '<h2>Submitted Questions</h2>'; 

    questionsToDisplay.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-item');

        // Create HTML for the options
        let optionsHtml = question.options.map((option, index) => {
            return `<div class="quiz-option">${index + 1}. ${option.text}${option.isCorrect ? ' (Correct)' : ''}</div>`;
        }).join('');

        // Set the innerHTML of the questionDiv with the question text and options
        questionDiv.innerHTML = `
            <h3>${question.question}</h3>
            ${optionsHtml}
            <button class="answer-reveal" onclick="revealAnswer(${question.id})">Reveal Answer</button>
        `;

        questionsList.appendChild(questionDiv);
    });
}
function displayQuestions(questionsToShow) {
    questionsList.innerHTML = ''; 

    questionsToShow.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-item');

        let optionsHtml = question.options.map((option, index) => 
            `<div class="option">${index + 1}. ${option.text}</div>`
        ).join('');

        questionDiv.innerHTML = `
            <h3>${question.question}</h3>
            ${optionsHtml}
            <button class="answer-reveal" data-question-id="${question.id}" onclick="revealAnswer(this)">Reveal Answer</button>
            <p class="correct-answer-text" style="display: none;"></p>
        `;

        questionsList.appendChild(questionDiv);
    });
}


function displaySubmittedQuestions() {
    // Get the container where the submitted questions will be displayed
    const submittedQuestionsContainer = document.getElementById('submittedQuestions');
    
    // Clear the current content of the container
    submittedQuestionsContainer.innerHTML = '<h2>Submitted Questions</h2>'; 

    // Iterate through the quizQuestions array and create HTML for each question
    quizQuestions.forEach(question => {
        // Create a new div element for each question
        const questionElement = document.createElement('div');
        questionElement.classList.add('question-item');

        let optionsHtml = question.options.map(option => {
            return `<div>${option.text} ${option.isCorrect ? '(Correct)' : ''}</div>`;
        }).join('');

        questionElement.innerHTML = `
            <h3>${question.question}</h3>
            ${optionsHtml}
        `;

        submittedQuestionsContainer.appendChild(questionElement);
    });
}
function saveQuestionsToLocal() {
    try {
        localStorage.setItem('quizQuestions', JSON.stringify(quizQuestions));
        
        alert('Questions saved successfully!');
    } catch (error) {
        console.error('Failed to save questions:', error);
        alert('Failed to save questions. Please try again.');
    }
}
function displayQuestionsFromLocalStorage() {
    try {
        const storedQuestionsJSON = localStorage.getItem('quizQuestions');

        if (storedQuestionsJSON) {
            quizQuestions = JSON.parse(storedQuestionsJSON);

            displaySubmittedQuestions();
        } else {
            console.log('No stored questions to load.');
        }
    } catch (error) {
        console.error('Failed to load questions from local storage:', error);
    }
}
function randomizeOptions() {
    const options = Array.from(document.getElementsByClassName('option'));
    const correctAnswerSelect = parseInt(document.getElementById('correctAnswer').value);

    const currentCorrectValue = correctAnswerSelect.value;

    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i].value, options[j].value] = [options[j].value, options[i].value];
    }

    for (let i = 0; i < options.length; i++) {
        if (options[i].value === currentCorrectValue) {
            correctAnswerSelect.value = i.toString(); 
            break;
        }
    }

    updateOptionColors();
}
function validateForm() {
    const questionInput = document.getElementById('question');
    if (!questionInput || !questionInput.value) {
        alert('Please enter a question.');
        console.log('Validation failed: Question input not found or empty.');
        return false;
    }
    const question = questionInput.value.trim();

    const options = Array.from(document.getElementsByClassName('option'));
    if (options.length === 0) {
        alert('No option fields found.');
        console.log('Validation failed: No option fields found.');
        return false;
    }

    if (!question || question.length > 140) {
        alert('Question length must not exceed 140 characters and cannot be empty.');
        console.log('Validation failed: Question length issue.');
        return false;
    }
    console.log('Validation passed.');
    return true;

    const hasEmptyOption = options.some(option => {
        const isOptionEmpty = !option.value || !option.value.trim();
        console.log(option.value, isOptionEmpty); // Log each option's value and whether it's considered empty
        return isOptionEmpty;
    });

    if (hasEmptyOption) {
        alert('Please fill in all option fields.');
        console.log('Validation failed: Empty option field.');
        return false;
    }

    return true;
}


function sortQuestionsAlphabetically() {
    quizQuestions.sort((a, b) => a.question.localeCompare(b.question));

    displayQuestions();
}
function sortQuestionsRandomly() {
    // Loop through the quizQuestions array in reverse order
    for (let i = quizQuestions.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
    }

    displayQuestions();
}
function filterQuestions(searchText) {
    const filteredQuestions = quizQuestions.filter(question => 
        question.question.toLowerCase().includes(searchText)
    );
    displaySubmittedQuestions(filteredQuestions);  
}
function updateOptionColors() {
    const correctIndex = parseInt(document.getElementById('correctAnswer').value) - 1; // Get the selected index of the correct answer
    const options = Array.from(document.getElementsByClassName('option')); // Get all option elements

    // Loop through all option elements
    options.forEach((option, index) => {
        if (index === correctIndex) {
            // If the option is the correct answer, set the background color to green
            option.style.backgroundColor = '#dff0d8'; // Light green color
        } else {
            // If the option is not the correct answer, set the background color to red
            option.style.backgroundColor = '#f2dede'; // Light red color
        }
    });
}
window.revealAnswer = function(questionId) {
    // Find the question by its ID
    const question = quizQuestions.find(q => q.id === questionId);
    
    // Check if the question exists
    if (!question) {
        console.error('Question not found!');
        return;
    }

    // Get the modal elements
    const answerModal = document.getElementById('answerModal');
    const answerText = document.getElementById('answerText');

    // Check if the modal elements exist
    if (!answerModal || !answerText) {
        console.error('Modal elements not found!');
        return;
    }

    answerText.innerText = question.explanation;

    answerModal.style.display = 'block';
};
function saveQuiz() {
    const quizNameInput = document.getElementById('quizName');
    
    // Check if the quizNameInput element exists
    if (!quizNameInput) {
        console.error('Quiz name input not found!');
        return;
    }

    const quizName = quizNameInput.value.trim();

    // Validate the quiz name
    if (!quizName) {
        alert('Please enter a name for your quiz.');
        return;
    }

    // Save the quiz name to localStorage
    localStorage.setItem('currentQuizName', quizName);

    // Optionally clear the input field
    quizNameInput.value = '';

    // Notify the user
    alert('Quiz name saved successfully!');
}
function startQuiz() {
    // Retrieve player names from input fields
    const player1NameInput = document.getElementById('player1Name');
    const player2NameInput = document.getElementById('player2Name');
    
    // Check if the input elements exist
    if (!player1NameInput || !player2NameInput) {
        console.error('Player name input fields are missing!');
        return;
    }

    let player1Name = player1NameInput.value.trim();
    let player2Name = player2NameInput.value.trim();

    // Validate player names
    if (!player1Name || !player2Name) {
        alert('Please enter names for both players.');
        return;
    }

    // Display player names on the scoreboard
    const player1DisplayName = document.getElementById('player1DisplayName');
    const player2DisplayName = document.getElementById('player2DisplayName');
    
    // Check if the display elements exist
    if (!player1DisplayName || !player2DisplayName) {
        console.error('Scoreboard display elements are missing!');
        return;
    }

    player1DisplayName.textContent = player1Name;
    player2DisplayName.textContent = player2Name;

    // Reset scores and display the scoreboard
    const player1Score = document.getElementById('player1Score');
    const player2Score = document.getElementById('player2Score');
    
    // Check if the score elements exist
    if (!player1Score || !player2Score) {
        console.error('Score elements are missing!');
        return;
    }

    player1Score.value = 0;
    player2Score.value = 0;

    const scoreboard = document.querySelector('.scoreboard');
    if (scoreboard) {
        scoreboard.style.display = 'block';
    } else {
        console.error('Scoreboard element is missing!');
    }

}
document.getElementById('startQuiz').addEventListener('click',  function() {;
window.location.href = 'quizPage.html';
});
let player1Name, player2Name;
let currentQuestionIndex = 0;

function startQuiz() {
    player1Name = document.getElementById('player1Name').value;
    player2Name = document.getElementById('player2Name').value;

    // Display player names and scoreboard
    document.getElementById('player1DisplayName').textContent = player1Name;
    document.getElementById('player2DisplayName').textContent = player2Name;
    document.querySelector('.scoreboard').style.display = 'block';

    // Reset scores and current question index
    document.getElementById('player1Score').textContent = 0;
    document.getElementById('player2Score').textContent = 0;
    currentQuestionIndex = 0;

    document.querySelector('.start-ui').style.display = 'none';
    displayQuestion(currentQuestionIndex);
}


function displayQuestion(index) {
    // Get the question and its container
    const question = quizQuestions[index];
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = ''; // Clear previous question

    // Create and append the question text
    const questionText = document.createElement('h2');
    questionText.textContent = question.question;
    questionContainer.appendChild(questionText);

    // Create and append the options
    question.options.forEach((option, optionIndex) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option.text;
        optionButton.onclick = () => handleOptionClick(option.isCorrect);
        questionContainer.appendChild(optionButton);
    });
}

function handleOptionClick(isCorrect) {
    updateScore(1, isCorrect);
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion(currentQuestionIndex); // Display the next question
    } else {
        endQuiz(); 
    }
}


function updateScore(player, correct) {
    let playerScoreId = `player${player}Score`;

    let score = parseInt(document.getElementById(playerScoreId).textContent);
    if (correct) {
        score++;
    }

    document.getElementById(playerScoreId).textContent = score;
    checkForWinner();
}

function checkForWinner() {
    let score1 = parseInt(document.getElementById('player1Score').textContent);
    let score2 = parseInt(document.getElementById('player2Score').textContent);

    if (score1 >= 10 || score2 >= 10) {
        playEndGameSound();
        alert(`${score1 >= 10 ? player1Name : player2Name} wins!`);
    }
}



function playEndGameSound() {
    const sound = document.getElementById('endGameSound');
    sound.play();
}
});



    
    





    


