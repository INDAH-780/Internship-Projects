

document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chat-form");
  const chatHistory = document.getElementById("chat-history");
  const imageInput = document.getElementById("imageInput");
  const descriptionInput = document.getElementById("descriptionInput");
  //const sendButton = document.getElementById("sendButton");

  const STORAGE_KEY = "chatHistory";
  const TIMESTAMP_KEY = "chatTimestamp";
  const EXPIRY_TIME = 24 * 60 * 60 * 1000; 

 //These functions are being hoisted
  checkChatExpiry();
  loadChatHistory();

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const imageFile = imageInput.files[0 ];
    const description = descriptionInput.value.trim();

    if (imageFile && description) {
      const reader = new FileReader();
      reader.onload = function (e) {
     
        addMessageToChatHistory(e.target.result, description, "user-message");
        saveMessageToLocalStorage(e.target.result, description, "user-message");

        
        const botReply = generateBotReply();
        setTimeout(() => {
          addMessageToChatHistory(null, botReply, "bot-message");
          saveMessageToLocalStorage(null, botReply, "bot-message");
        }, 1000); 

        imageInput.value = "";
        descriptionInput.value = "";
        chatHistory.scrollTop = chatHistory.scrollHeight;
      };
      reader.readAsDataURL(imageFile);
    }
  });

  function addMessageToChatHistory(imageSrc, description, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);

    if (imageSrc) {
      const imgElement = document.createElement("img");
      imgElement.src = imageSrc;
      messageElement.appendChild(imgElement);
    }

    const textElement = document.createElement("div");
    textElement.classList.add("text");
    textElement.textContent = description;
    messageElement.appendChild(textElement);

    chatHistory.appendChild(messageElement);
  }

  function generateBotReply() {
    // Basic bot reply logic for testing
    return `Received your image. How can I assist you further?`;
  }

  function saveMessageToLocalStorage(imageSrc, description, className) {
    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    messages.push({ imageSrc, description, className });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    localStorage.setItem(TIMESTAMP_KEY, Date.now()); 
  }

  function loadChatHistory() {
    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    messages.forEach((msg) => {
      addMessageToChatHistory(msg.imageSrc, msg.description, msg.className);
    });
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function checkChatExpiry() {
    const savedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    if (savedTimestamp) {
      const currentTime = Date.now();
      const timeDifference = currentTime - savedTimestamp;

      if (timeDifference > EXPIRY_TIME) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TIMESTAMP_KEY);
      }
    }
  }
});
