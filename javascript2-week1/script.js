document.addEventListener('DOMContentLoaded', () => {
    const randomizeButton = document.getElementById('randomize');
    const form = document.getElementById('quizForm');
    const answerBlocks = document.querySelectorAll('.answer-block');

    // Randomize the order of the answers
    randomizeButton.addEventListener('click', () => {
        let shuffledBlocks = Array.from(answerBlocks);
        shuffleArray(shuffledBlocks);
        const answersContainer = document.getElementById('answers');

        answersContainer.innerHTML = '';

        shuffledBlocks.forEach(block => {
            answersContainer.appendChild(block);
        });
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        // Reset colors for all answers
        answerBlocks.forEach(block => block.querySelector('.answer').style.backgroundColor = '');

        // Get the selected correct answer
        const selectedCorrectAnswer = Array.from(answerBlocks).find(block => block.querySelector('.correct-answer').checked);

        if (selectedCorrectAnswer) {
            // Highlight correct answer in green and others in red
            answerBlocks.forEach(block => {
                const input = block.querySelector('.answer');
                if (input.id === selectedCorrectAnswer.querySelector('.correct-answer').value) {
                    input.style.backgroundColor = 'lightgreen';
                } else {
                    input.style.backgroundColor = 'lightcoral';
                }
            });
        }
    });
});
