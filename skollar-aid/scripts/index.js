

// DOM elements
const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const form = document.getElementById("chat-form");
const displayedImage = document.getElementById("files");


let selectedFile = null;

// Handle file selection and image preview
displayedImage.addEventListener("change", (event) => {
  const file = event.target.files[0];
  selectedFile = file;
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById("imagePreview");
      img.src = e.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }

  // Upload function
 
  const formData = new FormData();
  formData.append("image", file);

//This is for uploading the file to the server
  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json()) 
    .then((data) => {
      console.log("File upload success:", data);

      // the path of the file is been returned from the server through the data.filePath
      const filePath = data.filePath; 

      // Use the file path to upload to Gemini
      return fetch("http://localhost:3000/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: filePath,
          mimeType: "image/jpeg", // Adjust based on the file type
        }),
      });
    })
    .then((response) => response.text())
    .then((data) => {
      console.log("Gemini upload success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});


// Send message function
async function sendMessage() {
  const userMessage = userInput.value.trim();
  userInput.value = ""; 

  if (!userMessage && !selectedFile) {
    console.log("Please enter a message or select a file.");
    return;
  }

  console.log(selectedFile);
   try {
     const response = await fetch("http://localhost:3000/api/message", {
      
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ message: userMessage, imagePath: selectedFile }),
     });

     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }

     const data = await response.json();
     console.log("Response data:", data);


     chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
     chatHistory.innerHTML += `<div class="bot-message">${data.reply}</div>`;
   } catch (error) {
     console.error("Error:", error);
     chatHistory.innerHTML += `<div class="error-message">Error: ${error.message}</div>`;
   }

 
}


form.addEventListener("submit", (event) => {
  event.preventDefault(); 
  const loader = document.getElementById("loader");
  loader.style.display = "block"; 
  sendMessage().finally(() => {
    loader.style.display = "none";
  });
});
