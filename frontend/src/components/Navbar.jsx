import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) return onLogout();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="mb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-sky-600">HabitTracker</div>
            <div className="hidden md:flex items-center gap-2">
              <Link to="/habits" className="px-3 py-2 rounded hover:bg-sky-50">📋 Habits</Link>
              <Link to="/rewards" className="px-3 py-2 rounded hover:bg-slate-50">🎁 Rewards</Link>
              <Link to="/insights" className="px-3 py-2 rounded hover:bg-slate-50">📊 Insights</Link>
              <Link to="/reminders" className="px-3 py-2 rounded hover:bg-slate-50">⏰ Reminders</Link>
              <Link to="/challenges" className="px-3 py-2 rounded hover:bg-slate-50">🏁 Challenges</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={handleLogout} className="px-3 py-2 bg-red-500 text-white rounded">Logout</button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="p-2 rounded hover:bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white rounded shadow p-3">
            <div className="flex flex-col gap-2">
              <Link to="/habits" onClick={() => setOpen(false)} className="px-2 py-2 rounded">📋 Habits</Link>
              <Link to="/rewards" onClick={() => setOpen(false)} className="px-2 py-2 rounded">🎁 Rewards</Link>
              <Link to="/insights" onClick={() => setOpen(false)} className="px-2 py-2 rounded">📊 Insights</Link>
              <Link to="/reminders" onClick={() => setOpen(false)} className="px-2 py-2 rounded">⏰ Reminders</Link>
              <Link to="/challenges" onClick={() => setOpen(false)} className="px-2 py-2 rounded">🏁 Challenges</Link>
              <button onClick={() => { setOpen(false); handleLogout(); }} className="mt-2 px-3 py-2 bg-red-500 text-white rounded">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}