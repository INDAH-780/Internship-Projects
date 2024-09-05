const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
const port = 3000;

// Middleware
app.use(cors());  //Enables Cross-Origin Resource Sharing (CORS) for the application, allowing the server to handle request from different domains

app.use(express.json());  //This middleware automatically converts JSON data in the request body into JavaScript objects.
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); //The cb (callback) function is called with null for the error and the path to the destination directory.
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname); //Creates a unique filename using the current timestamp followed by the original file name to avoid overwriting files with the same name.
  },
});
const upload = multer({ storage: storage }).single("image");

// Upload route
//When a POST request is made to this path, the callback function is executed to handle the request
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    //uses an upload middleware function to process the file upload. This middleware is configured using multer, which handles multipart form data, including file uploads.
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!req.file) { //check if file is uploaded or not
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`; //this is the destination of the uploaded file

    res.json({
      imageUrl: filePath, // URL to access the uploaded image
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
