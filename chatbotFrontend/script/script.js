document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chat-form");
  const chatHistory = document.getElementById("chat-history");
  const inputText = document.getElementById("inputText");

  const STORAGE_KEY = "chatHistory";
  const TIMESTAMP_KEY = "chatTimestamp";
  const EXPIRY_TIME = 24 * 60 * 60 * 1000; 

  
  checkChatExpiry();


  loadChatHistory();

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const message = inputText.value.trim();

    if (message) {
 
      addMessageToChatHistory(message, "user-message");
      saveMessageToLocalStorage(message, "user-message");

      const botReply = generateBotReply(message);
      setTimeout(() => {
        addMessageToChatHistory(botReply, "bot-message");
        saveMessageToLocalStorage(botReply, "bot-message");
      }, 1000); 

      inputText.value = "";
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  });

  function addMessageToChatHistory(message, className) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.classList.add(className);
    chatHistory.appendChild(messageElement);
  }

  function generateBotReply(userMessage) {
   
    return `Bot reply to: "${userMessage}"`;
  }

  function saveMessageToLocalStorage(message, className) {
    
    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    
    messages.push({ text: message, class: className });


    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    localStorage.setItem(TIMESTAMP_KEY, Date.now()); 
  }

  function loadChatHistory() {

    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];


    messages.forEach((msg) => {
      addMessageToChatHistory(msg.text, msg.class);
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
