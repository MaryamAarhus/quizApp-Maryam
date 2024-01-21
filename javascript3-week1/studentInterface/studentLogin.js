document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        try {
            const response = await fetch('/api/teacher/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('Login successful', data);

            window.location.href = 'teacherDashboard.html';

        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    });
});
