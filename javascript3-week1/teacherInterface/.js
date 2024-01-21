function displayQuestions(questionsToShow = null) {
    const questionsToDisplay = questionsToShow || quizQuestions;
    questionsList.innerHTML = '';

    questionsToDisplay.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-item');

        let optionsHtml = question.options.map((opt, index) => 
            `<div class="quiz-option">${index + 1}. ${opt.text} ${opt.isCorrect ? '(Correct)' : ''}</div>`
        ).join('');

        questionDiv.innerHTML = `
            <h3>${question.question}</h3>
            ${optionsHtml}
            <button class="answer-reveal" onclick="revealAnswer(${question.id})">Reveal Answer</button>
        `;

        questionsList.appendChild(questionDiv);
    });
}

document.getElementById('quizForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            addQuestion();
            displaySubmittedQuestions();
        }
    });