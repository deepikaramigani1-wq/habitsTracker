import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex gap-2 mb-6 justify-center">
      <Link to="/habits" className="px-4 py-2 bg-sky-500 text-white rounded">📋 Habits</Link>
      <Link to="/rewards" className="px-4 py-2 bg-purple-500 text-white rounded">🎁 Rewards</Link>
      <Link to="/insights" className="px-4 py-2 bg-emerald-500 text-white rounded">📊 Insights</Link>
      <Link to="/reminders" className="px-4 py-2 bg-indigo-500 text-white rounded">⏰ Reminders</Link>
      <Link to="/challenges" className="px-4 py-2 bg-rose-500 text-white rounded">🏁 Challenges</Link>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
