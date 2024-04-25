import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LogInPage from "./Views/Login";
import SignUpPage from "./Views/SignUp";

function App() {
  return (
      <Router>
          <Routes>
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
      </Router>
  );
}

export default App;
