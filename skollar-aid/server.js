const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // Ensure 'path' is required
const fs = require("fs");
const csv = require("csv-parser");

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




const customData = [];

// Load CSV data into customData
fs.createReadStream(path.join(__dirname, 'scholaships.csv'))
  .pipe(csv())
  .on('data', (data) => customData.push(data))
  .on('end', () => {
    console.log('CSV data loaded:', customData);
  });

function getCustomResponse(message) {
  const key = message.toLowerCase().replace(/[^a-z]/g, '');
  const entry = customData.find(item => item.question.toLowerCase().replace(/[^a-z]/g, '') === key);
  return entry ? entry.answer : null;
}

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

  // Check custom data first
  const customResponse = getCustomResponse(message);
  if (customResponse) {
    return res.json({ reply: customResponse });
  }

  const generationConfig = {
    temperature: 0.9,
    topP: 1,
    maxOutputTokens: 2048,
    responseMimeType: "text/plain",
  };

   const chatSession = model.startChat({
     generationConfig,
     history: [{ role: "user", parts: [{ text: message }] }],
   });
  const result = await chatSession.sendMessage(message);
  res.json({ reply: result.response.text() });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
