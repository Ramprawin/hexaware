// Handle signup form submission
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Store the credentials in localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    // Show success alert and navigate to the login page
    alert('User registered successfully! Please login.');
    window.location.href = 'login.html';
});

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Retrieve credentials from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    // Check if credentials match
    if (username === storedUsername && password === storedPassword) {
        alert('Login successful!');
        window.location.href = 'compatibility.html';  // Redirect to compatibility check page
    } else {
        alert('Incorrect username or password');
    }
});

// Device compatibility check
if (document.getElementById('compatibilityCheck')) {
    const compatibilityButton = document.getElementById('checkCompatibility');
    compatibilityButton.addEventListener('click', function() {
        // Check internet speed (basic simulation)
        const startTime = new Date().getTime();
        fetch('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png') // Use a small image for testing speed
            .then(response => response.blob())
            .then(() => {
                const endTime = new Date().getTime();
                const duration = endTime - startTime; // Time taken in milliseconds
                const speed = (1 / (duration / 1000)) * 1000; // Speed in Mbps (approximation)
                alert(`Internet speed check completed. Speed: ${speed.toFixed(2)} Mbps`);
                window.location.href = 'assessment.html';  // Redirect to assessment page if compatible
            })
            .catch(() => {
                alert('Internet speed check failed. Please ensure you are connected to the internet.');
            });
    });
}

// Simulated AI-Generated MCQs
const mcqs = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        question: "Who developed the theory of relativity?",
        options: ["Newton", "Einstein", "Galileo", "Bohr"],
        correctAnswer: "Einstein"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Venus", "Mars", "Jupiter"],
        correctAnswer: "Mars"
    },
    {
        question: "Which element has the atomic number 1?",
        options: ["Oxygen", "Hydrogen", "Carbon", "Nitrogen"],
        correctAnswer: "Hydrogen"
    }
];

// Load questions on assessment page
if (document.getElementById('questionsContainer')) {
    const container = document.getElementById('questionsContainer');
    mcqs.forEach((mcq, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `<p>${index + 1}. ${mcq.question}</p>`;

        const optionsList = document.createElement('ul');
        optionsList.className = 'options';
        mcq.options.forEach(option => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<input type="radio" name="question${index}" value="${option}"> ${option}`;
            optionsList.appendChild(listItem);
        });

        questionDiv.appendChild(optionsList);
        container.appendChild(questionDiv);
    });

    // Access the webcam
    const webcam = document.getElementById('webcam');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            webcam.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing the webcam: ', error);
            alert('Could not access the webcam. Please allow camera access to take the test.');
        });

    // Timer setup
    let timeLeft = 120; // 2 minutes in seconds
    const timerDisplay = document.getElementById('timeLeft');
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up! Your test has been submitted.');
            handleSubmit();
        } else {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }, 1000);

    // Tab switch handling
    let tabSwitchCount = 0; // Count of tab switches

    window.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // If the tab is hidden
            tabSwitchCount++; // Increment the tab switch count
            if (tabSwitchCount === 1) {
                alert('Warning: Please do not switch tabs during the test!');
            } else if (tabSwitchCount >= 2) {
                alert('You have switched tabs multiple times. Your test will be submitted automatically.');
                handleSubmit(); // Automatically submit the test
            }
        } else {
            // When the tab becomes visible again, reset the switch count
            tabSwitchCount = 2;
        }
    });

    // Handle test submission
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);

    function handleSubmit() {
        clearInterval(timerInterval); // Stop the timer
        const selectedAnswers = [];
        mcqs.forEach((mcq, index) => {
            const answer = document.querySelector(`input[name="question${index}"]:checked`);
            selectedAnswers.push(answer ? answer.value : null);
        });

        // Calculate score
        const score = selectedAnswers.reduce((acc, answer, index) => {
            return acc + (answer === mcqs[index].correctAnswer ? 1 : 0);
        }, 0);

        // Redirect to thank you page with score as a URL parameter
        window.location.href = `thankyou.html?score=${score}&total=${mcqs.length}`; // Pass score and total questions
    }
}
