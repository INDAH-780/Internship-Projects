document.addEventListener("DOMContentLoaded", function () {
  const textChatForm = document.getElementById("chat-form");
  const chatHistory = document.getElementById("chat-history");
  const textInput = document.getElementById("textInput");
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");
  const closeIcon = document.querySelector(".close-icon");
  const imageWrapper = document.querySelector(".image-wrapper");
  const uploadIcon = document.querySelector(".imgg label");
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.querySelector(".close");

  const STORAGE_KEY = "chatHistory";
  const TIMESTAMP_KEY = "chatTimestamp";
  const EXPIRY_TIME = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  const BASE_URL = "http://localhost:3000"; // Base URL for accessing files

  // Initialize Markdown parser
  const marked = window.marked;

  // Check chat history expiry and load if valid
  checkChatExpiry();
  loadChatHistory();

  // Hide image wrapper by default
  imageWrapper.style.display = "none";

  closeIcon.addEventListener("click", function () {
    imagePreview.src = "";
    imageWrapper.style.display = "none";
  });
  console.log("Adding click listener to uploadIcon");

  uploadIcon.addEventListener("click", function (event) {
    console.log("Upload icon clicked");
    event.preventDefault(); // Prevent default action, like form submission
    imageInput.click(); // Trigger file input click
  });

console.log("Adding change listener to imageInput");
  imageInput.addEventListener("change", function () {
     console.log("Image input changed");
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imageWrapper.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  textChatForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const message = textInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!message && !imageFile) {
      // No message or image, so don't proceed
      return;
    }

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("message", message);

      try {
        const response = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.imageUrl) {
          const imageUrl = `${BASE_URL}${data.imageUrl}`;

          // Clear the input fields immediately
          textInput.value = "";
          imageInput.value = ""; 
          imagePreview.src = "";
          imageWrapper.style.display = "none";

          // Add to chat history
          addMessageToChatHistory(imageUrl, message, "user-message");
          saveMessageToLocalStorage(imageUrl, message, "user-message");

          // Send message and image info to chatbot API
          const chatResponse = await fetch(`${BASE_URL}/api/message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: message, filePath: data.filePath }),
          });

          if (!chatResponse.ok) {
            throw new Error("Network response was not ok");
          }

          const chatData = await chatResponse.json();
          const botReply = chatData.reply || "Sorry, no reply from the bot.";
          setTimeout(() => {
            addMessageToChatHistory(null, botReply, "bot-message");
            saveMessageToLocalStorage(null, botReply, "bot-message");
          }, 1000);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      // Handle text-only submission
      textInput.value = "";
      addMessageToChatHistory(null, message, "user-message");
      saveMessageToLocalStorage(null, message, "user-message");

      try {
        const response = await fetch(`${BASE_URL}/api/message`, {
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
    }
     console.log("Form submitted");
  });

  function addMessageToChatHistory(imageSrc, text, className) {
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

    const markdownText = marked.parse(text);
    const textElement = document.createElement("div");
    textElement.classList.add("text");
    textElement.innerHTML = markdownText;
    messageElement.appendChild(textElement);

    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom after message
  }

  function saveMessageToLocalStorage(imageSrc, message, className) {
    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    messages.push({ imageSrc, message, className });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    localStorage.setItem(TIMESTAMP_KEY, Date.now());
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

  function loadChatHistory() {
    let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    messages.forEach((msg) => {
      addMessageToChatHistory(msg.imageSrc, msg.message, msg.className);
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
