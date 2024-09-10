document.addEventListener("DOMContentLoaded", function () {
  // Wait until the DOM is fully loaded before executing the script, wait until the html and css is loaded completely before executing js.
  const textChatForm = document.getElementById("chat-form");
  const chatHistory = document.getElementById("chat-history");
  const textInput = document.getElementById("textInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const imageInput = document.getElementById("imageInput");
  const uploadsContainer = document.getElementById("uploads");
  const imagePreview = document.getElementById("imagePreview");
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close");

  const STORAGE_KEY = "chatHistory";
  const TIMESTAMP_KEY = "chatTimestamp";
  const EXPIRY_TIME = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  const BASE_URL = "http://localhost:3000"; // Base URL for accessing files

  // Initialize Markdown parser
  const marked = window.marked;

  // Check if the chat history is older than 4 hours, this is a function call and the function is found down, at the end of this file
  checkChatExpiry();

  // Load chat history from local storage, this is a function call and the function is found down, at the end of this file
  loadChatHistory();
//event listener to handle form submision
  textChatForm.addEventListener("submit", async function (event) {
    event.preventDefault(); //prevent the default form submission

    // Handle text message submission
    const message = textInput.value.trim(); //trim removes unneccesary white spaces
    if (message) {
      addMessageToChatHistory(null, message, "user-message");  //user-message is the classname of the users div that is being created in js and dynamycally added to the chathistory when a user sends a message
      saveMessageToLocalStorage(null, message, "user-message");

      try {
        const response = await fetch(`${BASE_URL}/api/message`, {
          // Send the message to the chatbot API
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: message }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const botReply = data.reply || "Sorry, no reply from the bot.";
        setTimeout(() => {
          addMessageToChatHistory(null, botReply, "bot-message");
          saveMessageToLocalStorage(null, botReply, "bot-message");
        }, 1000);
      } catch (error) {
        console.error("Error fetching bot reply:", error);
      }

      textInput.value = "";
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Handle image upload
    const imageFile = imageInput.files[0];
    const description = descriptionInput.value.trim();
    if (imageFile && description) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("description", description);

      try {
        const uploadResponse = await fetch(`${BASE_URL}/upload`, {
          // Send the form data to the server for upload
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await uploadResponse.json();
        if (data.imageUrl) {
          // Prepend the base URL to the image URL
          const imageUrl = `${BASE_URL}${data.imageUrl}`;
          addMessageToChatHistory(imageUrl, description, "user-message");
          saveMessageToLocalStorage(imageUrl, description, "user-message");

          // Send message and file path to the chatbot
          const messageResponse = await fetch(`${BASE_URL}/api/message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: message,
              filePath: data.filePath,
            }),
          });

          if (!messageResponse.ok) {
            throw new Error("Network response was not ok");
          }

          const messageData = await messageResponse.json();
          const botReply = messageData.reply || "Sorry, no reply from the bot.";
          setTimeout(() => {
            addMessageToChatHistory(null, botReply, "bot-message");
            saveMessageToLocalStorage(null, botReply, "bot-message");
          }, 1000);

          // Clear inputs and preview
          imageInput.value = "";
          imagePreview.src = "";
          textInput.style.display = "block";
          uploadsContainer.style.display = "none";
          descriptionInput.value = "";
          chatHistory.scrollTop = chatHistory.scrollHeight;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
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

  function addMessageToChatHistory(imageSrc, description, className) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);

    if (imageSrc) {
      const imgElement = document.createElement("img");
      imgElement.src = imageSrc;
      imgElement.style.maxWidth = "100px";
      imgElement.style.cursor = "pointer";
      imgElement.addEventListener("click", function () {
        openModal(imageSrc);
      });
      messageElement.appendChild(imgElement);
    }

    // Convert description text to Markdown
    const markdownText = marked.parse(description);

    const textElement = document.createElement("div");
    textElement.classList.add("text");
    textElement.innerHTML = markdownText; // Injecting Markdown as HTML
    messageElement.appendChild(textElement);

    chatHistory.appendChild(messageElement);
  }

  function openModal(imageSrc) {
    modal.style.display = "flex";
    modalImage.src = imageSrc;
  }

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

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
