// // document.addEventListener("DOMContentLoaded", function () {
// //   const textChatForm = document.getElementById("chat-form");
// //   const chatHistory = document.getElementById("chat-history");
// //   const textInput = document.getElementById("textInput");
// //   const descriptionInput = document.getElementById("descriptionInput");
// //   const imageInput = document.getElementById("imageInput");
// //   const uploadsContainer = document.getElementById("uploads");
// //   const imagePreview = document.getElementById("imagePreview");
// //   //for the enlarge image
// //   const modal = document.getElementById("imageModal");
// //   const modalImage = document.getElementById("modalImage");
// //   const closeModal = document.querySelector(".close");

// //   const STORAGE_KEY = "chatHistory";
// //   const TIMESTAMP_KEY = "chatTimestamp";
// //   const EXPIRY_TIME = 2 * 60 * 60 * 1000; // 4 hours in milliseconds

// //   // Check if the chat history is older than 24 hours
// //   checkChatExpiry();

// //   // Load chat history from local storage
// //   loadChatHistory();

// //   textChatForm.addEventListener("submit", function (event) {
// //     event.preventDefault();
// //     const message = textInput.value.trim();
// //     const imageFile = imageInput.files[0];
// //     const description = descriptionInput.value.trim();

// //     if (message) {
// //       addMessageToChatHistory(null, message, "user-message");
// //       saveMessageToLocalStorage(null, message, "user-message");

// //        try {
// //      const response = await fetch("http://localhost:3000/api/message", {
      
// //        method: "POST",
// //        headers: {
// //          "Content-Type": "application/json",
// //        },
// //        body: JSON.stringify({ message: userMessage, imagePath: selectedFile }),
// //      });

// //       // const botReply = generateBotReply();
// //       // setTimeout(() => {
// //       //   addMessageToChatHistory(null, botReply, "bot-message");
// //       //   saveMessageToLocalStorage(null, botReply, "bot-message");
// //       // }, 1000);

// //       textInput.value = "";
// //       chatHistory.scrollTop = chatHistory.scrollHeight;
// //     }

// //     if (imageFile && description) {
// //       const formData =
// //         new FormData(); /* Creates a new FormData object, which is a special type of object used to construct key/value pairs to send files or form data (like text) in HTTP requests.
// // It is commonly used in POST requests to send data to the server, especially when dealing with files. */
// //       formData.append("image", imageFile);
// //       formData.append("description", description);

// //       fetch("http://localhost:3000/upload", {
// //         //where the image and description will be sent.
// //         //fetch is to make a network request
// //         //the post request contains the formdata that holds the images and the descriptions

// //         method: "POST",
// //         body: formData,
// //       })
// //         .then((response) => response.json()) //converts the response into JSON format, so it can be handled as a JavaScript object.
// //         .then((data) => {
// //           //data is the JSON object received from the server, containing information like the uploaded image URL.
// //           if (data.imageUrl) {
// //             //Checks if the imageUrl property exists in the data object. This indicates that the image was successfully uploaded, and the server returned a URL where the image is hosted.
// //             data.imageUrl = "http://localhost:3000" + data.imageUrl; //Concatenates the base URL http://localhost:3000 with the imageUrl provided by the server
// //             console.log(data.imageUrl);
// //             addMessageToChatHistory(data.imageUrl, description, "user-message");
// //             saveMessageToLocalStorage(
// //               data.imageUrl,
// //               description,
// //               "user-message"
// //             );

// //             // const botReply = generateBotReply();
// //             // setTimeout(() => {
// //             //   addMessageToChatHistory(null, botReply, "bot-message");
// //             //   saveMessageToLocalStorage(null, botReply, "bot-message");
// //             // }, 1000);

// //                // the path of the file is been returned from the server through the data.filePath
// //       const filePath = data.filePath; 

     
// //       return fetch("http://localhost:3000/gemini", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           path: filePath,
// //           mimeType: "image/jpeg", 
// //         }),
// //       });
// //     })
// //     .then((response) => response.text())
// //     .then((data) => {
// //       console.log("Gemini upload success:", data);
// //     })
// //     .catch((error) => {
// //       console.error("Error:", error);
// //     });

// //             imageInput.value = "";
// //             imagePreview.src = "";
// //             textInput.style.display = "block";
// //             uploadsContainer.style.display = "none";
// //             descriptionInput.value = "";
// //             chatHistory.scrollTop = chatHistory.scrollHeight;
// //           }
// //         })
// //         .catch((error) => {
// //           console.error("Error uploading image:", error);
// //         });
// //     }
// //   });

// //   imageInput.addEventListener("change", function () {
// //     /* This adds an event listener to the HTML element named imageInput 
// // The change event is triggered whenever a user selects an image via the file input.
// // When a file is selected, the function below will be executed. */
// //     const file = imageInput.files[0]; //if incase many images are chosen, just the first is taken into consideration

// //     if (file) {
// //       const reader = new FileReader();
// //       /* if an image is present, a new FileReader object is created, which is used to read the content of the selecetd image
// // FileReader allows web applications to asynchronously read the content of files  and process them in the browser. */

// //       reader.onload = function (e) {
// //         imagePreview.src = e.target.result;

// //         /* The src attribute of imagePreview is set to the result of the file reading operation, which is a data URL (i.e., a base64-encoded string representing the image).
// // This causes the selected image to be previewed by displaying it in the imagePreview element while the textInput is set to none, */
// //         textInput.style.display = "none";
// //         uploadsContainer.style.display = "block";
// //       };

// //       reader.readAsDataURL(file);
// //       // reader: This is an instance of FileReader, which is used to read files from the user's system.
// //       // readAsDataURL(): This method of FileReader reads the content of the file and encodes it as a base64 data URL.

// //       //The line reader.readAsDataURL(imageFile); is used in conjunction with the FileReader object to read the content of a file, specifically an image file, and convert it into a data URL.
// //       /*  The data URL is a base64-encoded string that represents the file’s content. For images, this means converting the image into a format that can be embedded directly into HTML or CSS. This is useful for displaying images without needing a separate file request to a */
// //     }
// //   });
// // //This function is responsible for adding chats to the history
// //   function addMessageToChatHistory(imageSrc, description, className) {
// //     const messageElement = document.createElement("div");
// //     messageElement.classList.add("message", className);

// // //dynamically adding images to chat history
// //   if (imageSrc) {
// //     console.log("Image Source:", imageSrc);
// //     const imgElement = document.createElement("img");
// //     imgElement.src = imageSrc;
// //     imgElement.style.maxWidth = "100px"; // Small preview size
// //     imgElement.style.cursor = "pointer"; // Show pointer cursor on hover

// //     //while adding images to the chat history, an even listener is added on the images such that once the inage is clicked, the modal fnction becomes active
// //     imgElement.addEventListener("click", function () {
// //       openModal(imageSrc); // Open modal with the clicked image
// //     });
// //     messageElement.appendChild(imgElement);

// //     //for the enlarged image

// //     // Function to open the modal with a specific image
// //     function openModal(imageSrc) {
// //       modal.style.display = "flex"; //Essentially, this opens the modal by making it visible.
// //       modalImage.src = imageSrc; //changes the image displayed inside the modal to the one specified by imageSrc
// //     }

// //     // Close the modal when clicking the close button
// //     closeModal.addEventListener("click", function () { //u could still close the modal by clicking the close icon
// //       modal.style.display = "none";
// //     });

// //     // Close the modal when clicking outside the image
// //     window.addEventListener("click", function (event) {
// //       //This listens for any click event happening anywhere on the page
// //       if (event.target === modal) {
// //         modal.style.display = "none";  //when clicked outside the modal, it closes automatically
// //       }
// //     });
// //   }


// //     const textElement = document.createElement("div");
// //     textElement.classList.add("text");
// //     textElement.textContent = description;
// //     messageElement.appendChild(textElement);

// //     chatHistory.appendChild(messageElement);
// //   }

// //   // function generateBotReply() {
// //   //   return `Received your message/image. How can I assist you further?`;
// //   // }

// //   function saveMessageToLocalStorage(imageSrc, description, className) {
// //     let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// //     messages.push({ imageSrc, description, className });
// //     localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
// //     localStorage.setItem(TIMESTAMP_KEY, Date.now());
// //   }

// //   function loadChatHistory() {
// //     let messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
// //     messages.forEach((msg) => {
// //       addMessageToChatHistory(msg.imageSrc, msg.description, msg.className);
// //     });
// //     chatHistory.scrollTop = chatHistory.scrollHeight;
// //   }

// //   function checkChatExpiry() {
// //     const savedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
// //     if (savedTimestamp) {
// //       const currentTime = Date.now();
// //       const timeDifference = currentTime - savedTimestamp;

// //       if (timeDifference > EXPIRY_TIME) {
// //         localStorage.removeItem(STORAGE_KEY);
// //         localStorage.removeItem(TIMESTAMP_KEY);
// //       }
// //     }
// //   }
// // });


// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const multer = require("multer");

// const app = express();
// const port = 3000;

// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");
// const { GoogleAIFileManager } = require("@google/generative-ai/server");

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
// const fileManager = new GoogleAIFileManager(apiKey);

// //const app = express();

// //const port = 3000;
// app.use(cors());

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// async function uploadToGemini(path, mimeType) {
//   const uploadResult = await fileManager.uploadFile(path, {
//     mimeType,
//     displayName: path,
//   });
//   const file = uploadResult.file;
//   console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
//   return file;
// }
// // Middleware
// //app.use(cors());  //Enables Cross-Origin Resource Sharing (CORS) for the application, allowing the server to handle request from different domains

// app.use(express.json());  //This middleware automatically converts JSON data in the request body into JavaScript objects.
// app.use(express.urlencoded({ extended: true }));

// // Serve static files from the 'uploads' directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "uploads")); //The cb (callback) function is called with null for the error and the path to the destination directory.
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "_" + file.originalname); //Creates a unique filename using the current timestamp followed by the original file name to avoid overwriting files with the same name.
//   },
// });
// const upload = multer({ storage: storage }).single("image");

// // Upload route
// //When a POST request is made to this path, the callback function is executed to handle the request
// app.post("/upload", (req, res) => {
//   upload(req, res, (err) => {
//     //uses an upload middleware function to process the file upload. This middleware is configured using multer, which handles multipart form data, including file uploads.
//     if (err) {
//       console.error("Error during file upload:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (!req.file) { //check if file is uploaded or not
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const filePath = `/uploads/${req.file.filename}`; 
//     //this is the destination of the uploaded file

//      //filePath = req.file.path
     

//           try {
//             function fileToGenerativePart(path, mimeType){
              
//               return {
//                   path: filePath,
//                   mimeType: mimeType,
//                 inlineData: {
//                   data: Buffer.from(fs.readFileSync(path)).toString("base64"),
//                   mimeType
//                 }
//               }
//             }
//       // Set generation configuration for the Gemini API
//       const generationConfig = {
//         temperature: 0.9,
//         topP: 1,
//         maxOutputTokens: 2048,
//         responseMimeType: "text/plain",
//       };

//       // Start a chat session with the generative model
//       const model = genAI.getGenerativeModel({
//         model: "gemini-1.5-flash",
//       });

//       const prompt = req.body.message
//       const answer = await model.generateContent([prompt, fileToGenerativePart(filePath, "image/jpeg")])
//       const response = await answer.response
//       const text = response.text()
//       res.send(text)

      
//     } catch (error) {
//       console.error("Error during Gemini API call:", error);
//       return res.status(500).json({ error: "Failed to process message with Gemini API" });
//     }
//   });
// });
// // Array to hold the custom data
// const customData = [];

//     res.json({
//       imageUrl: filePath, // URL to access the uploaded image
//       description: req.body.description,
//     });
//   });
// });

// // Serve the index.html file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });


// // API endpoint for messages
// app.post("/api/message", async (req, res) => {
//   const { message, imagePath } = req.body;


//   try {
//     // Set generation configuration
//     const generationConfig = {
//       temperature: 0.9,
//       topP: 1,
//       maxOutputTokens: 2048,
//       responseMimeType: "text/plain",
//     };

    

//     const files = [
//     await uploadToGemini(filePath, "image/jpeg"),
//   ];

//     const chatSession = model.startChat({
//     generationConfig,

//     history: [{
//         role: "user",
//         parts: [
//           {
//             fileData: {
//               mimeType: files[0].mimeType,
//               fileUri: files[0].uri,
//             },
//           },
//         ],
//       },
//     ],
//   });

//   const result = await chatSession.sendMessage(message);
//   console.log(result.response.text());

    
//     res.json({ reply: result.response.text() });
//   } catch (error) {
//     console.error("Error generating response:", error);
//     res.status(500).json({
//       reply: "Sorry, something went wrong while generating the response.",
//     });
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
