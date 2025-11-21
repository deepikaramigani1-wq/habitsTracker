import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import RewardsPage from "./components/RewardsPage";
import Insights from "./components/Insights";
import RemindersPage from "./components/RemindersPage";
import ChallengesPage from "./components/ChallengesPage";
import Login from "./components/Login";
import Signup from "./components/Signup";

// Import HabitCard
import HabitCard from "./components/HabitCard";

// Simple wrapper page to render HabitCard
const HabitsPageWrapper = () => {
  const exampleHabit = {
    _id: "1",
    name: "Read Book",
    category: "Personal",
    priority: 2,
    goalType: "daily",
    goalValue: 1,
  };

  const handleDelete = (id) => console.log("Delete habit with id:", id);
  const handleSelect = (id) => console.log("Selected habit for chart:", id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Habits</h1>
      <HabitCard habit={exampleHabit} onDelete={handleDelete} onSelect={handleSelect} />
    </div>
  );
};

// Landing page for unauthenticated users
const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-4xl font-bold">Welcome to Habit Tracker</h1>
      <p className="text-gray-600">Please sign in or sign up to continue</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Sign In
        </Link>
        <Link to="/signup" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      {/* Show navbar only when logged in */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/habits" /> : <LandingPage />}
        />

        {/* Auth Pages */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/habits" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/habits" /> : <Signup />}
        />

        {/* Protected App Pages */}
        <Route
          path="/habits"
          element={isAuthenticated ? <HabitsPageWrapper /> : <Navigate to="/login" />}
        />
        <Route
          path="/rewards"
          element={isAuthenticated ? <RewardsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/insights"
          element={isAuthenticated ? <Insights /> : <Navigate to="/login" />}
        />
        <Route
          path="/reminders"
          element={isAuthenticated ? <RemindersPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/challenges"
          element={isAuthenticated ? <ChallengesPage /> : <Navigate to="/login" />}
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}



