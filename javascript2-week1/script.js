document.getElementById('randomize').addEventListener('click', function() {
    let answers = document.querySelectorAll('.answers div');
    for (let i = answers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [answers[i].innerHTML, answers[j].innerHTML] = [answers[j].innerHTML, answers[i].innerHTML];
    }
});
document.getElementById('quiz-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let correctAnswer = document.querySelector('input[type="radio"]:checked + input').value;
    let answersInputs = document.querySelectorAll('.answers input[type="text"]');

    answersInputs.forEach(input => {
        if (input.value === correctAnswer) {
            input.style.backgroundColor = 'lightgreen';
        } else {
            input.style.backgroundColor = 'lightcoral';
        }
    });
});