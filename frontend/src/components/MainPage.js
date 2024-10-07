import React, { useEffect, useState } from "react";
import axios from "axios";
import Timer from "./Timer"; // Assuming you have a Timer component
import EssayForm from "./EssayForm"; // Import your EssayForm
import Result from "./Result"; // Import your Result component

const MainPage = () => {
  const [essays, setEssays] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetTimer, setResetTimer] = useState(false); // State for timer reset

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/essays/questions"
        );
        console.log(response.data); // Log the response
        const fetchedQuestions = response.data.questions;
        setQuestions(fetchedQuestions);
        setEssays(new Array(fetchedQuestions.length).fill("")); // Initialize essays with empty strings
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      alert(
        "This exam is not available on mobile devices. Please use a desktop or laptop."
      );
      window.location.href = "https://example.com/"; // Redirect if on mobile
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Standard message for most browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleEssayChange = (value) => {
    const updatedEssays = [...essays];
    updatedEssays[currentQuestionIndex] = value;
    setEssays(updatedEssays);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://61008658e051634cd7.gradio.live/api/predict",
        {
          data: essays,
        }
      );

      const resultData = response.data.data[0];
      setResult({
        "Task Achievement": resultData[0],
        "Coherence and Cohesion": resultData[1],
        Vocabulary: resultData[2],
        Grammar: resultData[3],
        Overall: resultData[4],
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting essays:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    // Clear all states to restart the exam
    setEssays([]);
    setSubmitted(false);
    setResult(null);
    setCurrentQuestionIndex(0);
    setResetTimer(true); // Trigger timer reset
  };

  return (
    <div className="main-page">
      <Timer isSubmitted={submitted} onReset={resetTimer} />{" "}
      {/* Pass reset state */}
      <div className="questions-container">
        {questions.length > 0 && !submitted ? (
          <div className="question-item">
            <p>
              {currentQuestionIndex + 1}. {questions[currentQuestionIndex]}
            </p>
            <EssayForm
              essay={essays[currentQuestionIndex]}
              onEssayChange={(value) => handleEssayChange(value)}
            />
          </div>
        ) : (
          <p></p>
        )}
      </div>
      {!submitted && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Essay
        </button>
      )}
      {submitted && <Result result={result} />}{" "}
      {/* Display result after submission */}
      
    </div>
  );
};

export default MainPage;
