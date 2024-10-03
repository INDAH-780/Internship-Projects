// src/components/Timer.js
import React, { useState, useEffect } from "react";

const Timer = ({ onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }

    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onFinish]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="timer">
      <p>Time Left: {formatTime(timeLeft)}</p>
    </div>
  );
};

export default Timer;
