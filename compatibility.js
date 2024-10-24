window.onload = function() {
    const checkResults = document.getElementById('checkResults');

    // Check for webcam access
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
            checkResults.innerHTML += "<p class='result compatible'>Webcam access: Compatible</p>";
            checkTestCompatibility();
        })
        .catch(() => {
            checkResults.innerHTML += "<p class='result not-compatible'>Webcam access: Not Compatible</p>";
            checkResults.innerHTML += "<p>Please ensure your device has a working webcam.</p>";
        });
    
    // Check internet speed
    checkInternetSpeed();
};

function checkTestCompatibility() {
    // Example check for browser compatibility
    const isCompatibleBrowser = !!(window.chrome || window.safari || window.firefox);
    
    if (isCompatibleBrowser) {
        // Redirect to assessment page after a short delay
        setTimeout(() => {
            window.location.href = 'assessment.html';
        }, 2000);
    } else {
        document.getElementById('checkResults').innerHTML += "<p class='result not-compatible'>Your browser is not supported. Please use Chrome, Safari, or Firefox.</p>";
    }
}

function checkInternetSpeed() {
    const checkResults = document.getElementById('checkResults');
    const startTime = (new Date()).getTime();
    const image = new Image();
    
    image.src = "https://www.gstatic.com/webp/gallery/1.jpg"; // A small image
    image.onload = () => {
        const endTime = (new Date()).getTime();
        const duration = (endTime - startTime) / 1000; // Duration in seconds
        const bitsLoaded = 8 * (image.src.length * 1000); // Size of the image in bits
        const speedBps = bitsLoaded / duration; // Speed in bits per second
        const speedKbps = speedBps / 1024; // Speed in kilobits per second
        const speedMbps = speedKbps / 1024; // Speed in megabits per second

        if (speedMbps > 1) { // Check for minimum speed
            checkResults.innerHTML += `<p class='result compatible'>Internet speed: ${speedMbps.toFixed(2)} Mbps (Compatible)</p>`;
        } else {
            checkResults.innerHTML += `<p class='result not-compatible'>Internet speed: ${speedMbps.toFixed(2)} Mbps (Not Compatible, please check your connection)</p>`;
        }
    };
    image.onerror = () => {
        checkResults.innerHTML += "<p class='result not-compatible'>Unable to check internet speed.</p>";
    };
}
