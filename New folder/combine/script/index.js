const btnSend = document.getElementById("btnSend");
const imageInput = document.getElementById("imageInput");
const textInput = document.getElementById("textInput");
const previewImage = document.getElementById("previewImage");
const chatHistory = document.getElementById("chatHistory");

// Modal elements
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.querySelector(".close");

  // Initialize Markdown parser
  const marked = window.marked;


// Function to preview the image when selected
imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result; // Preview the image
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
});

// Function to send the image and text
btnSend.addEventListener("click", async function (e) {
  e.preventDefault();
  const text = textInput.value.trim();
  const file = imageInput.files[0];

  // Clear inputs
  textInput.value = "";
  previewImage.src = "";
  imageInput.value = null;

  // Append the image and message to the chat immediately on the UI
  if (file) {
    addMessageToChatHistory(URL.createObjectURL(file), text, "userMessage");
  } else if (text) {
    addMessageToChatHistory(null, text, "userMessage");
  }

  // Send the image and text to the backend
  if (file || text) {
    const formData = new FormData();
    if (file) formData.append("image", file);
    if (text) formData.append("message", text);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to send image to the server.');
      }

      const data = await response.json();

      // Display the bot's message (response) based on the image
      addMessageToChatHistory(null, data.reply, "botMessage");
    } catch (error) {
      console.error('Error sending image or text:', error);
      addMessageToChatHistory(null, 'Error sending data. Please try again.', "errorMessage");
    }
  }
});

function addMessageToChatHistory(imageSrc, text, className) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add(className);

  if (imageSrc) {
    const imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    imageElement.classList.add("previewed-image");
    messageContainer.appendChild(imageElement);
  }

  if (text) {
    const textContainer = document.createElement("div");
    textContainer.classList.add("text");

    // Parse and render Markdown for all messages
    const markdownText = marked.parse(text);
    textContainer.innerHTML = markdownText;

    messageContainer.appendChild(textContainer);
  }

  chatHistory.appendChild(messageContainer);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll to the bottom of the chat
}




closeModal.addEventListener("click", function (e) {
  e.preventDefault();
  modal.style.display = "none";
});

window.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btnSend.click();
  }
});