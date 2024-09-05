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

// .value acceses the current text that the user has typed in the input field

// .trim() removes extra white spaces added by the user.
    if (message) {
 
      addMessageToChatHistory(message, "user-message");
      saveMessageToLocalStorage(message, "user-message");

      const botReply = generateBotReply(message);
      setTimeout(() => {
        addMessageToChatHistory(botReply, "bot-message");
        saveMessageToLocalStorage(botReply, "bot-message");
      }, 1000);  //delay of one second is introduce, and the response is after the user message

      inputText.value = "";
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  });

  //since its just the chathistory container that was created in html, we add a class for the user message and bot message,
  function addMessageToChatHistory(message, className) {
    const messageElement = document.createElement("div"); //the div created will serve as the container for the chat message to be displayed in the chat history.
    messageElement.textContent = message; //text provided, that is the message will be displayed here
    messageElement.classList.add(className); //The className parameter is added to the div's list of classes which  allows you to apply specific CSS styles to the message based on the class name provided that is distinguishing between user message and bot message
    chatHistory.appendChild(messageElement); //the message element which is the div that was created is being added to the chat history with its 
  }

  function generateBotReply(userMessage) {
   
    return `Bot reply to: "${userMessage}"`;
  }

  function saveMessageToLocalStorage(message, className) {
    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; //This line retrieves the existing list of messages from the browser's localStorage using the STORAGE_KEY
    //JSON.parse() converts the stored string back into a JavaScript array. If there are no saved messages (i.e., null is returned), the || [] ensures that messages is initialized as an empty array.
    messages.push({ text: message, class: className });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));  //adds text messages to the associated array
    localStorage.setItem(TIMESTAMP_KEY, Date.now());
  }

  //logic behind the storage history
 
  function loadChatHistory() {

    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];  //retrieves the saved messages from the local storage
//if there is no save message, an empty array is being returned.
//JSON now converts the stored sring back into an array


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
