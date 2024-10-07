import React from "react";
import EssayForm from "./EssayForm"; // Ensure this path is correct

const QuestionComponent = ({ questions, onEssayChange, essays }) => {
  return (
    <div className="questions-container">
      <h2>Essay Questions</h2>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <div key={index} className="question-item">
            <p>
              {index + 1}. {question}
            </p>
            <EssayForm
              essay={essays[index]}
              onEssayChange={(value) => onEssayChange(index, value)}
            />
          </div>
        ))
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default QuestionComponent;
