import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://lecotes-backend.onrender.com/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies
      });
  
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-96 animate-fade-in-down">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-6 font-poppins tracking-tight">
          Lecotes!
        </h2>
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
          onClick={handleLogin}
          className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300"
        >
          Log In
        </button>
        <Link
          to="/signup"
          className="block text-center mt-4 text-purple-600 hover:text-purple-800 underline transition duration-200"
        >
          Don't have an account? Sign up here.
        </Link>
      </div>
    </div>
  );
}

export default Login;
