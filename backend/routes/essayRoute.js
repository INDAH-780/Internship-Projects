// /routes/essayRoutes.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// POST /api/essays/grade
router.post("/grade", async (req, res) => {
  const { essay } = req.body;

  if (!essay) {
    return res.status(400).json({ message: "Essay content is required" });
  }

  try {
    // Call Hugging Face API
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/KevSun/IELTS_essay_scoring",
      { inputs: essay },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );

    // Respond with the score
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to grade essay" });
  }
});

module.exports = router;
