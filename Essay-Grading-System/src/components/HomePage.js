// src/components/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const startExam = () => {
    navigate("/exam");
  };

  return (
    <div className="home-page">
      <h1>Welcome to the Essay Grading System</h1>
      <button onClick={startExam}>Start Exam</button>
    </div>
  );
};

export default HomePage;
