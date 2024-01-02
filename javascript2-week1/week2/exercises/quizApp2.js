document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const questionsList = document.getElementById('questionsList');
    const filter = document.getElementById('filter');
    let quizQuestions = [];

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            addQuestion();
        }
    });

    document.getElementById('randomize').addEventListener('click', randomizeOptions);
    document.getElementById('correctAnswer').addEventListener('change', updateOptionColors);

    filter.addEventListener('input', filterQuestions);

    function validateForm() {
        const question = document.getElementById('question').value;
        const options = Array.from(document.getElementsByClassName('option'));
        const hasEmptyOption = options.some(opt => opt.value.trim() === '');

        if (!question.trim() || hasEmptyOption) {
            alert('Please fill in all fields.');
            return false;
        }

        if (question.length > 140) {
            alert('Question length must not exceed 140 characters.');
            return false;
        }

        return true;
    }

    function addQuestion() {
        const question = document.getElementById('question').value;
        const options = Array.from(document.getElementsByClassName('option')).map(opt => opt.value);
        const correctIndex = document.getElementById('correctAnswer').selectedIndex;

        const newQuestion = {
            id: quizQuestions.length + 1,
            question,
            options: options.map((text, index) => ({
                text,
                isCorrect: index === correctIndex
            })),
            explanation: `The correct answer is: ${options[correctIndex]}.`
        };

        quizQuestions.push(newQuestion);
        displayQuestions();
        quizForm.reset();
        updateOptionColors(); 
    }

    function displayQuestions() {
        questionsList.innerHTML = '';
        quizQuestions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');

            let optionsHtml = question.options.map((opt, index) => `<div>${index + 1}. ${opt.text}</div>`).join('');
            questionDiv.innerHTML = `
                <h3>${question.question}</h3>
                ${optionsHtml}
                <button class="answer-reveal" onclick="revealAnswer(${question.id})">Reveal Answer</button>
            `;

            questionsList.appendChild(questionDiv);
        });
    }

    function randomizeOptions() {
        const options = Array.from(document.getElementsByClassName('option'));
        const correctAnswerSelect = document.getElementById('correctAnswer');
        let correctValue = correctAnswerSelect.value;

        for (let i = options.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [options[i].value, options[j].value] = [options[j].value, options[i].value];
        }

        options.forEach((opt, index) => {
            if (opt.value === correctValue) {
                correctAnswerSelect.selectedIndex = index;
            }
        });

        updateOptionColors(); 
    }

    function filterQuestions() {
        const searchText = filter.value.toLowerCase();
        const filteredQuestions = quizQuestions.filter(q => q.question.toLowerCase().includes(searchText));
        displayQuestions(filteredQuestions);
    }

    function displayQuestions(questions) {
        questionsList.innerHTML = '';
        (questions || quizQuestions).forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');

            let optionsHtml = question.options.map((opt, index) => `<div>${index + 1}. ${opt.text}</div>`).join('');
            questionDiv.innerHTML = `
                <h3>${question.question}</h3>
                ${optionsHtml}
                <button class="answer-reveal" onclick="revealAnswer(${question.id})">Reveal Answer</button>
            `;

            questionsList.appendChild(questionDiv);
        });
    }

    function updateOptionColors() {
        const correctIndex = document.getElementById('correctAnswer').selectedIndex;
        const options = Array.from(document.getElementsByClassName('option'));
        options.forEach((opt, index) => {
            opt.style.backgroundColor = index === correctIndex ? '#dff0d8' : '#f2dede';
        });
    }

    window.revealAnswer = function(id) {
        const question = quizQuestions.find(q => q.id === id);
        if (!question) return;

        alert(question.explanation);
    }
});
