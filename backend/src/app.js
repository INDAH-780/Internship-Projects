const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Sample route for health check
app.get("/", (req, res) => {
  res.send("Essay Grading Backend API is running");
});

// Importing Routes
const essayRoutes = require("./routes/essayRoutes");
app.use("/api/essays", essayRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
