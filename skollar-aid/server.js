const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
require("dotenv").config(); // To load environment variables from a .env file

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load API Key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error(
    "API key is missing. Please set GEMINI_API_KEY in your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);
const app = express();

const port = 3000;

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
// Array to hold the custom data
const customData = [];

// Load CSV data into customData
fs.createReadStream(path.join(__dirname, "scholaships.csv"))
  .pipe(csv())
  .on("data", (data) => customData.push(data))
  .on("end", () => {
    console.log("CSV data loaded:", customData);
  });

// Function to get a custom response from the loaded data
function getCustomResponse(message) {
  // Normalize the message
  const key = message.toLowerCase().replace(/[^a-z]/g, "");
  // Search for a matching entry in the custom data
  const entry = customData.find((item) =>
    item["Scholarship Name"].toLowerCase().includes(key)
  );
  return entry
    ? `Scholarship Name: ${entry["Scholarship Name"]}, Type: ${entry["Scholarship Type"]}, Host Country: ${entry["Host Country"]}, Eligibility: ${entry["Eligibility"]}, Application Dateline: ${entry["Application Dateline"]}, Link: ${entry["Application Link"]}`
    : null;
}

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/assets", express.static(path.join(__dirname, "loader")));
app.use(express.static(path.join(__dirname)));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint for messages
app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  // Check custom data first
  const customResponse = getCustomResponse(message);
  if (customResponse) {
    return res.json({ reply: customResponse });
  }

  try {
    // Set generation configuration
    const generationConfig = {
      temperature: 0.9,
      topP: 1,
      maxOutputTokens: 2048,
      responseMimeType: "text/plain",
    };

    // Start a chat session with the generative model
    const chatSession = model.startChat({
      generationConfig,
      history: [{ role: "user", parts: [{ text: message }] }],
    });

    // Send message and get response
    const result = await chatSession.sendMessage(message);
    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error generating response:", error);
    res
      .status(500)
      .json({
        reply: "Sorry, something went wrong while generating the response.",
      });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
