const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // Ensure 'path' is required

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const apiKey = "AIzaSyA8hpjwNRPLuI6z1KfS_yVc5I40cDrZ2MU";
const genAI = new GoogleGenerativeAI(apiKey);

const app = express();
const port = 3000;

const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro",
});

app.use(bodyParser.json());


// Serve the 'styles' and 'scripts' folders individually
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
// Serve static files from the 'assets' directory
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint
app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  const generationConfig = {
    temperature: 0.9,
    topP: 1,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "How hard is it to get a scholarship?" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "The difficulty of getting a scholarship depends on several factors:...",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(message);
  res.json({ reply: result.response.text() });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
