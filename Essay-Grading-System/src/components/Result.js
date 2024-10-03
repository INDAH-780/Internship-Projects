// src/components/Result.js
import React from "react";

const Result = ({ grade }) => {
  return (
    <div>
      <h2>Your Grade</h2>
      <p>{grade ? `Score: ${grade.score}` : "No grade available"}</p>
    </div>
  );
};

export default Result;
