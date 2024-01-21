document.addEventListener('DOMContentLoaded', function() {
    const name = localStorage.getItem('teacherName');
    const email = localStorage.getItem('teacherEmail');

    const welcomeMessageElement = document.getElementById('welcomeMessage');
    if (welcomeMessageElement) {
        welcomeMessageElement.textContent = 'Welcome, ' + name;
    } else {
        console.error('No element found with ID "welcomeMessage"');
    }

    loadTeacherProfile();

    // Event listeners for main actions
    document.querySelector('button#createQuiz').addEventListener('click', function() {
        window.location.href = 'createQuiz.html';
    });

    document.querySelector('button#editQuiz').addEventListener('click', function() {
        window.location.href = 'editQuiz.html';
    });

    document.querySelector('button#viewResults').addEventListener('click', function() {
        window.location.href = 'viewResults.html';
    });
});

function loadTeacherProfile() {
    fetch('/api/teacher/profile')
        .then(response => response.json())
        .then(data => {
            document.querySelector('h2').textContent = 'Welcome, ' + data.name;
        })
        .catch(error => console.error('Error loading teacher profile:', error));
}
