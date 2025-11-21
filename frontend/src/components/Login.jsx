import React, { useState } from "react";
import axios from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      onLogin && onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 text-center mt-1 mb-6">
          Login to continue
        </p>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          Login
        </button>

        {error && (
          <div className="text-red-600 text-sm text-center font-semibold mt-3">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

