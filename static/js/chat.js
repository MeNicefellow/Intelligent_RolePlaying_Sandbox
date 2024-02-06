function sendMessage() {
    const narratorInput = document.getElementById('narrator-input');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    let message; // Declare message here

    if (narratorInput.value) {
        message = narratorInput.value + ': ' + chatInput.value; // Assign a value to message
    } else {
        message = chatInput.value; // Assign a value to message
    }

    chatInput.value = ''; // Clear chat input after sending

    if (message) {
        // Display the user's message
        chatBox.innerHTML += `<div>${message}</div>`;
    }
}

document.getElementById('generate-button').addEventListener('click', function() {
    let chatText = document.getElementById('chat-box').innerHTML;
    let narratorText = document.getElementById('narrator-input').value;

    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({chatText: chatText, narratorText: narratorText}),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the server's response here
        console.log(data);
        // Add the server's response to the chat box
        const chatBox = document.getElementById('chat-box');
        const messages = data.answer;
        messages.forEach(message => {
            if (message) {
                chatBox.innerHTML += `<div>${message}</div>`; // Create a new div for each text
            }
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('clear-btn').addEventListener('click', function() {
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: 'clear' })
    })
    .then(response => response.json())
    .then(data => {
        // Clear the chat box
        document.getElementById('chat-box').innerHTML = '';
    });
});

document.getElementById('chat-input').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault(); // Prevents the default action (form submission)
        sendMessage();
    }
});

document.getElementById('change-background').addEventListener('click', function() {
    let currentImage = document.body.style.backgroundImage;
    currentImage = currentImage.replace('url("', '').replace('")', '').split('/').pop();

    // If currentImage is an empty string, set it to the name of the default background image
    if (!currentImage) {
        currentImage = '1.webp'; // Replace with the actual name of your default background image
    }

    fetch('/next_background_image?current_image=' + currentImage)
        .then(response => response.json())
        .then(data => {
            const nextImage = 'assets/backgrounds/' + data.image_name;
            document.body.style.backgroundImage = 'url(' + nextImage + ')';
        });
});

function saveStory() {
    let chatHistory = document.getElementById('chat-box').innerHTML;
    fetch('/save_story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({chatHistory: chatHistory}),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getAllStories();  // Refresh the list of stories after saving a new one
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function loadStory(filename) {
    fetch(`/load_story?filename=${filename}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('chat-box').innerHTML = data.chat_history;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getAllStories() {
    fetch('/get_stories')
    .then(response => response.json())
    .then(data => {
        // Display the list of stories on the webpage
        // This is a basic implementation and you might want to replace it with your own UI
        let storiesList = document.getElementById('stories-list');
        storiesList.innerHTML = '';
        data.stories.forEach(story => {
            let listItem = document.createElement('li');
            listItem.textContent = story;
            listItem.onclick = () => loadStory(story);
            storiesList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}