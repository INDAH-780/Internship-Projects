// server.js
require("dotenv").config();
const express = require("express");
const essayRoutes = require("./routes/essayRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Define routes
app.use("/api/essays", essayRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
