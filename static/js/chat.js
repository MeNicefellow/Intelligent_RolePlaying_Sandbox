// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 8)]; // Generate a random number between 0 and 7
    }
    return color;
}
// Object to store the narrator-color pairs
let narratorColors = {};

function parseItalic(text) {
    return text.replace(/\*(.*?)\*/g, '<i>$1</i>');
}

function sendMessage() {
    const narratorInput = document.getElementById('narrator-input');
    let chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    let message;
    let color = 'black'; // Default color

    if (narratorInput.value) {
        message = narratorInput.value + ': ' + parseItalic(chatInput.value);
        let narrator = narratorInput.value.toLowerCase(); // Use narrator's name as key
        if (!narratorColors[narrator]) {
            narratorColors[narrator] = getRandomColor(); // Generate a new color for the narrator
        }
        color = narratorColors[narrator];
    } else {
        message = parseItalic(chatInput.value);
    }

    chatInput.value = '';

    if (message) {
         addTalkToChatBox(`<div style="color: ${color};">${message}</div>`); // Call the function here
    }
}

// This is a simplified version of your function that adds a new talk to the chat box
function addTalkToChatBox(talk) {
    // Create a new div for the talk
    let talkDiv = document.createElement('div');
    talkDiv.innerHTML = talk; // Use innerHTML instead of textContent

    // Create an edit button
    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        editTalk(talkDiv);
    });

    // Add the talk and the edit button to the chat box
    talkDiv.appendChild(editButton);
    document.getElementById('chat-box').appendChild(talkDiv);
}

function editTalk(talkDiv) {
    // Save the current talk text
    let currentTalk = talkDiv.innerHTML; // Get the HTML content, including the "Edit" button
    let editButton = talkDiv.querySelector('button');
    currentTalk = currentTalk.replace(editButton.outerHTML, ''); // Remove the "Edit" button from the content

    // Create an input field with the current talk text
    let inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentTalk;
    inputField.style.width = '100%'; // Make the input field as wide as its parent container

    // Clear the HTML content of the div
    talkDiv.innerHTML = '';

    // When the user presses enter, save the changes, remove the input field, and add the "Edit" button back
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            talkDiv.innerHTML = inputField.value; // Set the new HTML content
            talkDiv.appendChild(editButton); // Add the "Edit" button back
        }
    });

    // Add the input field to the div
    talkDiv.appendChild(inputField);

    // Focus the input field
    inputField.focus();
}
document.getElementById('generate-button').addEventListener('click', function() {
    let chatText = document.getElementById('chat-box').innerHTML;
    let narratorText = document.getElementById('narrator-input').value;

    document.getElementById('loading-indicator').style.display = 'inline';
    let parametersForm = document.getElementById('parameters-form');
    let max_tokens = parametersForm.elements.max_tokens.value;
    let min_p = parametersForm.elements.min_p.value;
    let top_k = parametersForm.elements.top_k.value;
    let top_p = parametersForm.elements.top_p.value;
    let temperature = parametersForm.elements.temperature.value;
    fetch('/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chatText: chatText,
            narratorText: narratorText,
            max_tokens: max_tokens,
            min_p: min_p,
            top_k: top_k,
            top_p: top_p,
            temperature: temperature
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading-indicator').style.display = 'none';
        const chatBox = document.getElementById('chat-box');
        const messages = data.answer;
        messages.forEach(message => {
            if (message) {
                let color = 'black'; // Default color
                if (message.includes(':')) {
                    let narrator = message.split(':')[0].toLowerCase(); // Use narrator's name as key
                    if (!narratorColors[narrator]) {
                        narratorColors[narrator] = getRandomColor(); // Generate a new color for the narrator
                    }
                    color = narratorColors[narrator];
                }
                message = parseItalic(message);
                addTalkToChatBox(`<div style="color: ${color};">${message}</div>`);// Use the narrator's color
            }
        });
    })
    .catch((error) => {
        document.getElementById('loading-indicator').style.display = 'none';
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
document.getElementById('new-story-btn').addEventListener('click', function() {
    document.getElementById('chat-box').innerHTML = '';
});
function saveStory() {
    let chatHistory = document.getElementById('chat-box').innerHTML;
    let storyName = prompt("Please enter a name for the story:", "Default Story Name"); // Add this line
    if (storyName == null || storyName == "") {
        storyName = "Default Story Name"; // Use the current automatic name as the default value
    }
    fetch('/save_story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({story: chatHistory, name: storyName}), // Add the storyName to the request body
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response
        if (data.status === 'success') {
            alert('Story saved successfully!');
            getAllStories(); // Reload the list of stories
        } else {
            alert('Failed to save the story');
        }
    })
    .catch((error) => {
        // Handle the error
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

// Load the story list when the page loads
document.addEventListener('DOMContentLoaded', function() {
    getAllStories();
});