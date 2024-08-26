const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const form = document.getElementById("chat-form");
const displayedImage = document.getElementById("files");
// const student = document.getElementsByClassName

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = ""; 
  console.log("User message:", userMessage);

  try {
    const response = await fetch("http://localhost:3000/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }), 
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
displayedImage.addEventListener('change', async function(event) {
  const formData = new FormData();

      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const img = document.getElementById('imagePreview');
          img.src = e.target.result;
          img.style.display = 'block'; 
        };
        
        reader.readAsDataURL(file); 
      }

       formData.append("file", file); 

       
        try{
           const options = {
             method: "POST",
             body: formData,
           };
          const response = await fetch('http://localhost:3000/upload', options)
          const data = await response.json();
          console.log(data)

        }catch (err){
          console.log(err)
        }
    })

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent form submission
  const loader = document.getElementById("loader");
  loader.style.display = "block"; // Show the loader
  sendMessage().finally(() => {
    loader.style.display = "none"; // Hide the loader after the message is sent
  });
});
