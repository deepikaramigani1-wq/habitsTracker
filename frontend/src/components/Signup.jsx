import React, { useState } from "react";
import axios from "../api";

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/signup", { username, password });
      localStorage.setItem("token", res.data.token);
      onSignup && onSignup();
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Sign Up
        </button>

        {error && (
          <div className="mt-4 text-center text-red-600 font-medium">
            {error}
          </div>
        )}
      </form>
    
  );
}

