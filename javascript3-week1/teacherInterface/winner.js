document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const winnerName = urlParams.get('winner');
    const winnerScore = urlParams.get('score');

    // Display the winner information
    const winnerAnnouncementDiv = document.getElementById('winner-announcement');
    winnerAnnouncementDiv.innerHTML = `<p>Congratulations ${winnerName}! You won the quiz with a score of ${winnerScore}.</p>`;
});
