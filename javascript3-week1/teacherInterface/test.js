document.addEventListener('DOMContentLoaded', function () {
    const quizListContainer = document.getElementById('quizListContainer');
    const quizCreationForm = document.getElementById('quizCreationForm');

    function loadQuizzes() {
        // Load quizzes from localStorage
        const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
        quizListContainer.innerHTML = '';
        quizzes.forEach(quiz => {
            const quizLink = document.createElement('a');
            quizLink.href = `quiz.html?name=${encodeURIComponent(quiz)}`;
            quizLink.textContent = quiz;
            quizListContainer.appendChild(quizLink);
        });
    }

    quizCreationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const quizName = document.getElementById('quizNameInput').value.trim();

        if (quizName) {
            const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
            if (quizzes.includes(quizName)) {
                alert("Quiz with this name already exists!");
                return;
            }
            quizzes.push(quizName);
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
            loadQuizzes();
            document.getElementById('quizNameInput').value = '';
        }
    });

    loadQuizzes();
});
