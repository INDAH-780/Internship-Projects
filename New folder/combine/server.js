const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");


const app = express();

const port = 3000;
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");
let filePath;

app.post("/upload", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.sendStatus(500).json(err);

    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    filePath = req.file.path
});
});


// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
//app.use("/assets", express.static(path.join(__dirname, "loader")));
app.use(express.static(path.join(__dirname)));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});