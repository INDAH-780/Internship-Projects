document.addEventListener("DOMContentLoaded", function () {
  const textChatForm = document.getElementById("chat-form");
  const chatHistory = document.getElementById("chat-history");
  const textInput = document.getElementById("textInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const imageInput = document.getElementById("imageInput");
  const uploadsContainer = document.getElementById("uploads");
  const imagePreview = document.getElementById("imagePreview");
  //for the enlarge image
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close");

  const STORAGE_KEY = "chatHistory";
  const TIMESTAMP_KEY = "chatTimestamp";
  const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check if the chat history is older than 24 hours
  checkChatExpiry();

  // Load chat history from local storage
  loadChatHistory();

  textChatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const message = textInput.value.trim();
    const imageFile = imageInput.files[0];
    const description = descriptionInput.value.trim();

    if (message) {
      addMessageToChatHistory(null, message, "user-message");
      saveMessageToLocalStorage(null, message, "user-message");

      const botReply = generateBotReply();
      setTimeout(() => {
        addMessageToChatHistory(null, botReply, "bot-message");
        saveMessageToLocalStorage(null, botReply, "bot-message");
      }, 1000);

      textInput.value = "";
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    if (imageFile && description) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("description", description);

     fetch("http://localhost:3000/upload", {
       method: "POST",
       body: formData,
     })
       .then((response) => response.json())
       .then((data) => {
       if (data.imageUrl) {
        
        data.imageUrl = "http://localhost:3000" + data.imageUrl;
        console.log(data.imageUrl);
         addMessageToChatHistory(data.imageUrl, description, "user-message");
         saveMessageToLocalStorage(data.imageUrl, description, "user-message");

         const botReply = generateBotReply();
         setTimeout(() => {
           addMessageToChatHistory(null, botReply, "bot-message");
           saveMessageToLocalStorage(null, botReply, "bot-message");
         }, 1000);

         imageInput.value = "";
         imagePreview.src = "";
         textInput.style.display = "block";
         uploadsContainer.style.display = "none";
         descriptionInput.value = "";
         chatHistory.scrollTop = chatHistory.scrollHeight;
       }
       })
       .catch((error) => {
         console.error("Error uploading image:", error);
       });
    }
  });

  imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        imagePreview.src = e.target.result;

        textInput.style.display = "none";
        uploadsContainer.style.display = "block";
      };

      reader.readAsDataURL(file);
    }
  });
//This function is responsible for adding chats to the history
  function addMessageToChatHistory(imageSrc, description, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);

//dynamically adding images to chat history
  if (imageSrc) {
    console.log("Image Source:", imageSrc);
    const imgElement = document.createElement("img");
    imgElement.src = imageSrc;
    imgElement.style.maxWidth = "100px"; // Small preview size
    imgElement.style.cursor = "pointer"; // Show pointer cursor on hover
    imgElement.addEventListener("click", function () {
      openModal(imageSrc); // Open modal with the clicked image
    });
    messageElement.appendChild(imgElement);

    //for the enlargeimage

    // Function to open the modal with a specific image
    function openModal(imageSrc) {
      modal.style.display = "flex";
      modalImage.src = imageSrc;
    }

    // Close the modal when clicking the close button
    closeModal.addEventListener("click", function () {
      modal.style.display = "none";
    });

    // Close the modal when clicking outside the image
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }


    const textElement = document.createElement("div");
    textElement.classList.add("text");
    textElement.textContent = description;
    messageElement.appendChild(textElement);

    chatHistory.appendChild(messageElement);
  }

  function generateBotReply() {
    return `Received your message/image. How can I assist you further?`;
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

