const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "uploads"))); // Serve files from the uploads directory

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");

// Upload route
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

    res.json({
      imageUrl: `/${filePath}`,  // URL to access the uploaded image
      description: req.body.description,
    });
  });
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
