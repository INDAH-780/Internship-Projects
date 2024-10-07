import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/exam');
  };

  return (
    <div className="home-container">
      <button className="start-btn" onClick={handleStart}>
        Start Exam
      </button>
    </div>
  );
};

export default HomePage;
