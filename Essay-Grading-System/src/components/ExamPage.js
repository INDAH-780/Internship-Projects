// src/components/ExamPage.js
import React, { useState, useEffect } from "react";
import EssayForm from "./EssayForm";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";

const ExamPage = () => {
  const [isExamFinished, setIsExamFinished] = useState(false);
  const navigate = useNavigate();

  const handleFinishExam = () => {
    setIsExamFinished(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      return (event.returnValue = "Are you sure you want to leave?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className="exam-page">
      <h2>Essay Question</h2>
      <p>Write an essay about the benefits of education in modern society.</p>
      <Timer onFinish={handleFinishExam} />
      {!isExamFinished ? (
        <EssayForm />
      ) : (
        <button onClick={() => navigate("/grade")}>See Your Grade</button>
      )}
    </div>
  );
};

export default ExamPage;
