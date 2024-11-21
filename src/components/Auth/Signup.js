import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch(`https://lecotes-backend.onrender.com/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        alert("Signup Successful!")
        navigate("/login");
      } else {
        alert("Signup Successful!")
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-96 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-6 font-poppins tracking-tight">
          Create Account
        </h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-300"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-purple-400">
            <i className="fas fa-user"></i>
          </span>
        </div>
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-300"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-purple-400">
            <i className="fas fa-envelope"></i>
          </span>
        </div>
        <div className="relative mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg w-full focus:outline-none focus:ring-4 focus:ring-purple-400 transition-all duration-300"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-purple-400">
            <i className="fas fa-lock"></i>
          </span>
        </div>
        <button
          onClick={handleSignup}
          className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300"
        >
          Sign Up
        </button>
        <Link
          to="/login"
          className="block text-center mt-4 text-purple-600 hover:text-purple-800 underline transition duration-200"
        >
          Already have an account? Log in here.
        </Link>
      </div>
    </div>
  );
}

export default Signup;
