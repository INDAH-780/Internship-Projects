// src/components/GradePage.js
import React from "react";

const GradePage = ({ grade }) => {
  return (
    <div className="grade-page">
      <h2>Your Grade</h2>
      <p>{grade ? `You scored: ${grade}` : "No grade available"}</p>
    </div>
  );
};

export default GradePage;
