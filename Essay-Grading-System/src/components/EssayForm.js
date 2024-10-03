// src/components/EssayForm.js
import React, { useState } from "react";
import axios from "axios";

const EssayForm = () => {
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/essays/grade",
        { essay }
      );
      setGrade(response.data.grade);
    } catch (error) {
      console.error("Error grading essay:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        placeholder="Write your essay here..."
        required
      />
      <button type="submit" disabled={loading || !essay}>
        {loading ? "Grading..." : "Submit Essay"}
      </button>
      {grade && <p>Your Grade: {grade}</p>}
    </form>
  );
};

export default EssayForm;
