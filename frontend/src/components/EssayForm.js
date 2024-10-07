import React from "react";

const EssayForm = ({ essay, onEssayChange }) => {
  return (
    <textarea
      placeholder="Write your essay here..."
      value={essay}
      onChange={(e) => onEssayChange(e.target.value)} // Call the provided function on change
      rows={4}
      style={{ width: "100%", marginBottom: "10px" }}
    />
  );
};

export default EssayForm;
