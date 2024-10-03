// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import ExamPage from "./components/ExamPage";
import GradePage from "./components/GradePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/grade" element={<GradePage />} />
      </Routes>
    </Router>
  );
};

export default App;
