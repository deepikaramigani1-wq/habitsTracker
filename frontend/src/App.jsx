import React, { useEffect, useState } from 'react'
import { fetchHabits, createHabit, deleteHabit } from './api'
import HabitCard from './components/HabitCard'
import RewardsPage from './components/RewardsPage'
import Insights from './components/Insights'
import RemindersPage from './components/RemindersPage'
import ChallengesPage from './components/ChallengesPage'
import Charts from './components/Charts'
import Login from './components/Login'
import Signup from './components/Signup'
import dayjs from 'dayjs'

export default function App() {
  const [habits, setHabits] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState(2)
  const [goalType, setGoalType] = useState('daily')
  const [goalValue, setGoalValue] = useState(1)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState('habits')
  const [chartHabitId, setChartHabitId] = useState(null)
  const [authPage, setAuthPage] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState(null);

  const load = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true)
      const res = await fetchHabits(userId)
      setHabits(res.data)
      if (res.data && res.data.length > 0) setChartHabitId(res.data[0]._id)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      // Optionally decode userId from JWT
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserId(payload.id);
        }
      } catch {}
      load();
    }
  }, [isAuthenticated])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const payload = {
      userId,
      name,
      category,
      priority: parseInt(priority, 10),
      goal: {
        type: goalType,
        value: parseInt(goalValue, 10)
      },
      startDate: dayjs().toDate()
    }

    try {
      const res = await createHabit(payload)
      console.log('[App] Habit created successfully:', res.data)
      setName("")
      setCategory("")
      setPriority(2)
      load()
    } catch (err) {
      console.error('[App] Error creating habit:', err.response?.data || err.message)
      alert('Failed to add habit: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id)
      load()
    } catch (err) {
      console.error('[App] Error deleting habit:', err.response?.data || err.message)
      alert('Failed to delete habit: ' + (err.response?.data?.message || err.message))
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Habit Tracker</h1>
        <div className="flex gap-2 mb-6 justify-center">
          <button onClick={() => setAuthPage('login')} className={`px-4 py-2 rounded-lg font-semibold transition ${authPage === 'login' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>Login</button>
          <button onClick={() => setAuthPage('signup')} className={`px-4 py-2 rounded-lg font-semibold transition ${authPage === 'signup' ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>Sign Up</button>
        </div>
        {authPage === 'login' ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Signup onSignup={() => setIsAuthenticated(true)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex justify-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Habit Tracker</h1>
      <div className="flex gap-2 mb-6 justify-center">
        <button onClick={() => setPage('habits')} className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'habits' ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>📋 Habits</button>
        <button onClick={() => setPage('rewards')} className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'rewards' ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>🎁 Rewards</button>
        <button onClick={() => setPage('insights')} className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'insights' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>📊 Insights</button>
        <button onClick={() => setPage('reminders')} className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'reminders' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>⏰ Reminders</button>
        <button onClick={() => setPage('challenges')} className={`px-4 py-2 rounded-lg font-semibold transition ${page === 'challenges' ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>🏁 Challenges</button>
        <button onClick={() => {localStorage.removeItem('token'); setIsAuthenticated(false); setUserId(null);}} className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white">Logout</button>
      </div>
      {/* Rewards Page */}
      {page === 'rewards' && <RewardsPage userId={userId} />}
      {page === 'insights' && <Insights userId={userId} />}
      {page === 'reminders' && <RemindersPage userId={userId} habits={habits} />}
      {page === 'challenges' && <ChallengesPage userId={userId} />}
      {/* Show charts section under habits for quick preview of first habit */}
      {page === 'habits' && habits.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm text-slate-600">Chart:</label>
            <select value={chartHabitId || ''} onChange={(e) => setChartHabitId(e.target.value)} className="border p-2 rounded">
              {habits.map(h => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </select>
          </div>
          <Charts habitId={chartHabitId} range={30} />
        </div>
      )}
      {/* Habits Page */}
      {page === 'habits' && (
        <>
      {/* Add Habit Form */}
      <form onSubmit={handleAdd} className="p-4 bg-white shadow rounded-xl flex flex-col gap-3 mb-6">
        <input type="text" placeholder="Habit name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Category (optional)" value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded" />
        <div className="flex gap-2">
          <select value={goalType} onChange={(e) => setGoalType(e.target.value)} className="border p-2 rounded flex-1">
            <option value="daily">Daily</option>
            <option value="timesPerWeek">Times / Week</option>
          </select>
          <input type="number" min={1} value={goalValue} onChange={(e) => setGoalValue(e.target.value)} className="border p-2 rounded w-28" title="Goal value" />
        </div>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border p-2 rounded">
          <option value={1}>Priority 1</option>
          <option value={2}>Priority 2</option>
          <option value={3}>Priority 3</option>
        </select>
        <button type="submit" className="bg-sky-500 text-white px-4 py-2 rounded">Add Habit</button>
      </form>
      {/* Habits List */}
      {loading ? (
        <p className="text-center text-slate-500">Loading...</p>
      ) : habits.length === 0 ? (
        <p className="text-center text-slate-400">No habits yet. Add one!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {habits.map((h) => (
            <HabitCard key={h._id} habit={h} onDeleted={handleDelete} onUpdated={load} />
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}

