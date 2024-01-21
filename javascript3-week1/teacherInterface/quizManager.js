class QuizManager {
    static saveQuiz(quiz) {
        const quizzes = QuizManager.getQuizzes();
        quizzes.push(quiz);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }

    static getQuizzes() {
        const storedQuizzes = localStorage.getItem('quizzes');
        if (storedQuizzes) {
            return JSON.parse(storedQuizzes);
        }
        return [];
    }

    static updateQuiz(updatedQuiz) {
        let quizzes = QuizManager.getQuizzes();
        const index = quizzes.findIndex(q => q.id === updatedQuiz.id);
        if (index !== -1) {
            quizzes[index] = updatedQuiz;
            localStorage.setItem('quizzes', JSON.stringify(quizzes));
        }
    }

    static deleteQuiz(quizId) {
        let quizzes = QuizManager.getQuizzes();
        quizzes = quizzes.filter(q => q.id !== quizId);
        localStorage.setItem('quizzes', JSON.stringify(quizzes));
    }
}
