import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import MainPage from "./components/MainPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exam" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;
