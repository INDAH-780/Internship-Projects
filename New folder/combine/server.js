const express = require("express");
const cors = require("cors"); //Middleware for enabling Cross-Origin Resource Sharing.
const path = require("path"); //Middleware for enabling Cross-Origin Resource Sharing.
const multer = require("multer"); //Middleware for handling multipart/form-data, used for file uploads.
const fs = require("fs");

require("dotenv").config(); // Loads environment variables from a .env file.

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Automatically converts JSON data in the request body into JavaScript objects
app.use(express.urlencoded({ extended: true })); // Allows for parsing URL-encoded data

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Path to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname); // Unique filename to avoid overwriting
  },
});
const upload = multer({ storage: storage }).single("image");

// Upload route
//After successful upload, it uploads the file to Gemini using uploadToGemini and sends back the file URL, description, and file path

app.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = req.file.path;

    try {
      const file = await uploadToGemini(filePath, req.file.mimetype);
      res.json({
        imageUrl: `/uploads/${req.file.filename}`,
        description: req.body.description,
        filePath: filePath,
      });
    } catch (error) {
      console.error("Error during Gemini API call:", error);
      return res
        .status(500)
        .json({ error: "Failed to process file with Gemini API" });
    }
  });
});




// API endpoint for messages

app.post("/api/message", async (req, res) => {
  const { message, filePath } = req.body;

  try {
    let history = [];

    if (filePath) {
      // Ensure the file is uploaded and available for the chat
      const file = await uploadToGemini(filePath, "image/jpeg");

      history.push({
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: file.mimeType,
              fileUri: file.uri,
            },
          },
        ],
      });
    }

    if (message) {
      history.push({
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      });
    }

    if (history.length === 0) {
      throw new Error("No message or file content provided");
    }

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        maxOutputTokens: 2048,
        responseMimeType: "text/plain",
      },
      history: history,
    });

    const result = await chatSession.sendMessage(message);
    console.log(result.response.text());

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({
      reply: "Sorry, something went wrong while generating the response.",
    });
  }
});

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Function to upload a file to Gemini
//Uses the GoogleAIFileManager to upload the file and log the result.
async function uploadToGemini(path, mimeType) {
  if (!path) {
    throw new Error("File path is undefined");
  }
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
