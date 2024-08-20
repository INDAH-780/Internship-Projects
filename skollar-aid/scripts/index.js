const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const form = document.getElementById("chat-form");
// const student = document.getElementsByClassName

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = ""; // Clear input field
  console.log("User message:", userMessage);

  try {
    const response = await fetch("http://localhost:3000/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }), // Ensure 'message' key matches the backend
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse the JSON response
    const data = await response.json();
    console.log("Response data:", data);

    const botMessage = data.reply;
    console.log("Bot message:", botMessage);

    // Add chat message to the chat history
    chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
    chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;

  } catch (error) {
    console.error("Error:", error);
    // Optionally display an error message to the user
    chatHistory.innerHTML += `<div class="error-message">Error: ${error.message}</div>`;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Show the loader
  sendMessage().finally(() => {
    loader.style.display = "none"; // Hide the loader after the message is sent
  });
});
