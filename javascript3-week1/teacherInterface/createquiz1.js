let quizQuestions = [];
const questionsList = document.getElementById('questionsList');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/MaryamAarhus/MaryamAarhus.github.io/main/data/questions.json');
        const data = await response.json();
        quizQuestions = data;
        displayQuestionsFromLocalStorage();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }

    document.getElementById('quizForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            addQuestion();
            displaySubmittedQuestions();
        }
    });

    document.getElementById('randomize').addEventListener('click', randomizeOptions);
    document.getElementById('correctAnswer').addEventListener('change', updateOptionColors);
    document.getElementById('filter').addEventListener('input', () => filterQuestions(document.getElementById('filter').value.toLowerCase()));
    document.getElementById('saveQuestions').addEventListener('click', saveQuestionsToLocal);
    document.getElementById('sortOptions').addEventListener('change', handleSortChange);
});

function randomizeOptions() {
    // Get the current options and the correct answer index
    const options = Array.from(document.getElementsByClassName('option'));
    const correctAnswerSelect = document.getElementById('correctAnswer');
    let correctIndex = correctAnswerSelect.selectedIndex;
    
    // Shuffle the options
    for (let i = options.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [options[i].value, options[j].value] = [options[j].value, options[i].value];

        // Update the correctIndex if the correct answer was involved in the swap
        if (correctIndex === i) {
            correctIndex = j;
        } else if (correctIndex === j) {
            correctIndex = i;
        }
    }

    // Update the value of the correctAnswerSelect dropdown to reflect the new correct answer index
    correctAnswerSelect.selectedIndex = correctIndex;

    // Call updateOptionColors to visually refresh the options display if needed
    updateOptionColors();
}

function displaySubmittedQuestions() {
    const submittedQuestionsContainer = document.getElementById('submittedQuestions');
    submittedQuestionsContainer.innerHTML = ''; // Clear previous content

    quizQuestions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question-item');

        let optionsHtml = question.options.map((opt, index) => 
            `<div class="${opt.isCorrect ? 'correct-option' : 'option'}">${index + 1}. ${opt.text}</div>`
        ).join('');

        questionElement.innerHTML = `
            <h3>${question.question}</h3>
            ${optionsHtml}
            <button class="answer-reveal" onclick="revealAnswer(${question.id})">Reveal Answer</button>
        `;

        submittedQuestionsContainer.appendChild(questionElement);
    });
}
function validateForm() {
    const question = document.getElementById('question').value.trim();
    const options = Array.from(document.getElementsByClassName('option'));
    
    // Check if the question is empty or too long
    if (!question || question.length > 140) {
        alert('Question length must not exceed 140 characters and cannot be empty.');
        return false;
    }

    // Check if any of the options are empty
    const hasEmptyOption = options.some(opt => !opt.value.trim());
    if (hasEmptyOption) {
        alert('Please fill in all option fields.');
        return false;
    }

    return true;
}

function addQuestion() {
    if (!validateForm()) {
        return;
    }

    const questionText = document.getElementById('question').value.trim();
    const optionsElements = Array.from(document.getElementsByClassName('option'));
    
    // Correct answer index
    const correctAnswerIndex = parseInt(document.getElementById('correctAnswer').value) - 1; 
    const options = optionsElements.map((optionElement, index) => ({
        text: optionElement.value.trim(),
        isCorrect: index === correctAnswerIndex
    }));

    const newQuestion = {
        id: quizQuestions.length + 1, 
        question: questionText,
        options: options
    };

    quizQuestions.push(newQuestion);
    localStorage.setItem('quizQuestions', JSON.stringify(quizQuestions)); // Save to local storage

    document.getElementById('quizForm').reset();
    displaySubmittedQuestions(); // Display submitted questions
}

// Rest of your functions...

function handleSortChange(event) {
    if (event.target.value === 'alpha') {
        sortQuestionsAlphabetically();
    } else if (event.target.value === 'random') {
        sortQuestionsRandomly();
    }
    displaySubmittedQuestions(); // Update display
}

function sortQuestionsAlphabetically() {
    quizQuestions.sort((a, b) => a.question.localeCompare(b.question));
}

function sortQuestionsRandomly() {
    for (let i = quizQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
    }
}