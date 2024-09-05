

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
    //[0] accesses the first file in the list. If the user has selected multiple files, this will only get the first one.
    const imageFile = imageInput.files[0]; //.files is a property of the file input element that returns a FileList object, which is a list of files selected by the user.
    const description = descriptionInput.value.trim();

    if (imageFile && description) {
      const reader = new FileReader(); //Creates a new FileReader object, which is used to read the content of the file (imageFile).
      reader.onload = function (e) {
        //this function is executed when the file has been read
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
      // reader: This is an instance of FileReader, which is used to read files from the user's system.
      // readAsDataURL(): This method of FileReader reads the content of the file and encodes it as a base64 data URL.

      //The line reader.readAsDataURL(imageFile); is used in conjunction with the FileReader object to read the content of a file, specifically an image file, and convert it into a data URL.
      /*  The data URL is a base64-encoded string that represents the file’s content. For images, this means converting the image into a format that can be embedded directly into HTML or CSS. This is useful for displaying images without needing a separate file request to a */
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
