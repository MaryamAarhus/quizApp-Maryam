document.addEventListener('DOMContentLoaded', function() {
});

function handleTeacher() {
    window.location.href = 'teacher/teacher.html';
}

function handleStudent() {
    window.location.href = 'student/student.html';
}

document.querySelector('.role-button.teacher').addEventListener('click', handleTeacher);
document.querySelector('.role-button.student').addEventListener('click', handleStudent);
