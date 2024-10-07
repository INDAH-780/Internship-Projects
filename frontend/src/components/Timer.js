import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

const Timer = ({ isSubmitted, onReset }) => {
  const totalTime = 300; // 5 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    // Load the remaining time from localStorage, if available
    const savedTime = localStorage.getItem("timeLeft");
    const savedTimestamp = localStorage.getItem("timestamp");

    // Calculate the difference between now and the saved timestamp
    const now = Math.floor(Date.now() / 1000);
    if (savedTime && savedTimestamp) {
      const timeElapsed = now - parseInt(savedTimestamp, 10);
      const updatedTime = parseInt(savedTime, 10) - timeElapsed;
      setTimeLeft(updatedTime > 0 ? updatedTime : 0);
    }

    // Timer function to count down every second
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0 || isSubmitted) {
          clearInterval(interval);
          if (prevTime <= 0 && !isSubmitted) {
            // Time elapsed and not submitted, redirect to start page
            localStorage.removeItem("timeLeft"); // Clear stored time
            localStorage.removeItem("timestamp"); // Clear timestamp
            navigate("/"); // Redirect to start page
          }
          return 0; // Timer reached zero
        }

        const newTime = prevTime - 1;
        // Save the remaining time and current timestamp
        localStorage.setItem("timeLeft", newTime);
        localStorage.setItem("timestamp", Math.floor(Date.now() / 1000));
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear the interval when unmounted
  }, [isSubmitted, navigate]);

  // Reset timer when a new session starts
  useEffect(() => {
    if (onReset) {
      setTimeLeft(totalTime);
      localStorage.removeItem("timeLeft");
      localStorage.removeItem("timestamp");
    }
  }, [onReset, totalTime]);

  // Convert timeLeft from seconds to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="timer-container">
      Time Left: {minutes}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default Timer;
