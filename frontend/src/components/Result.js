import React from "react";

const Result = ({ result }) => {
  // Check if the result is null or empty
  if (!result) {
    return <p>No results available.</p>; // Display a message if no result is available
  }

  return (
    <div className="result-container">
      <h2>Essay Grading Results</h2>
      <ul>
        <li>Task Achievement: {result["Task Achievement"]}</li>
        <li>Coherence and Cohesion: {result["Coherence and Cohesion"]}</li>
        <li>Vocabulary: {result.Vocabulary}</li>
        <li>Grammar: {result.Grammar}</li>
        <li>Overall: {result.Overall}</li>
      </ul>
      <div className="disclaimer">
        <p>
         The results provided are based on a model and may not
          reflect actual performance.
        </p>
      </div>
    </div>
  );
};

export default Result;
