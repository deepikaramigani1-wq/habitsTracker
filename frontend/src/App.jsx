import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import RewardsPage from "./components/RewardsPage";
import Insights from "./components/Insights";
import RemindersPage from "./components/RemindersPage";
import ChallengesPage from "./components/ChallengesPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import HabitCard from "./components/HabitCard";
import HabitsPage from "./components/HabitsPage";

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
      <HabitCard habit={exampleHabit} onDeleted={handleDelete} onUpdated={handleSelect} />
    </div>
  );
};

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

// Wrapper component to inject navigate
const AppWrapper = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  // decode simple JWT payload to extract user id
  const parseJwt = (token) => {
    try {
      const payload = token.split('.')[1]
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(decodeURIComponent(escape(json)))
    } catch (e) {
      return null
    }
  }

  const token = localStorage.getItem('token')
  const currentUser = token ? parseJwt(token) : null
  const userId = currentUser?.id || currentUser?._id || null

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/"); // redirect to landing page
  };

  return (
    <>
      {isAuthenticated && <Navbar onLogout={handleLogout} />}

      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/habits" /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/habits" /> : <Login onLogin={() => navigate('/habits')} />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/habits" /> : <Signup onSignup={() => navigate('/habits')} />} />
        <Route path="/habits" element={isAuthenticated ? <HabitsPage userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/rewards" element={isAuthenticated ? <RewardsPage userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/insights" element={isAuthenticated ? <Insights userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/reminders" element={isAuthenticated ? <RemindersPage userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/challenges" element={isAuthenticated ? <ChallengesPage userId={userId} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}




