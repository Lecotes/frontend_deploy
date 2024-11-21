import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import TextAnnotator from "./components/TextAnnotator/TextAnnotator";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('https://lecotes-backend.onrender.com/api/auth/session', {
        credentials: 'include',
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Not logged in');
            }
        })
        .then((data) => { 
          setUser(data);
      })
        .catch(() => setUser(null));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Navigate to="/login" /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/text/:id" element={user ? <TextAnnotator user={user} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
