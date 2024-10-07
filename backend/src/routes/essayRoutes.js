const express = require("express");
const {
  fetchQuestion,
} = require("../controllers/essayControllers");
const router = express.Router();

//const router = Router();

//router.post("/submit", submitEssay); // Route for submitting essays
router.get("/questions", fetchQuestion); // Route to fetch questions

module.exports = router;
