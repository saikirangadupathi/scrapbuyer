import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AuthPage from './buyerLogin.js';

import ScrapBuyerDashboard from './buyerDashboard.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<AuthPage onLogin={handleLogin} />}
          />
          <Route path="/ScrapBuyerDashboard" element={<ScrapBuyerDashboard onConfirmLocation={() => {}} />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
