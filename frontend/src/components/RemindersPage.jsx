import React, { useEffect, useState } from 'react'
import { fetchReminders, createReminder, deleteReminder, fetchHabits } from '../api'

export default function RemindersPage({ userId, habits: initialHabits = [] }) {
  const [reminders, setReminders] = useState([])
  const [time, setTime] = useState('08:00')
  const [enabled, setEnabled] = useState(true)
  const [habitId, setHabitId] = useState('')
  const [habits, setHabits] = useState(initialHabits)

  const load = async () => {
    try {
      const res = await fetchReminders(userId)
      setReminders(res.data || [])
    } catch (err) {
      console.error('[RemindersPage] load', err)
    }
  }

  useEffect(() => { if (userId) load() }, [userId])

  // If no habits provided, fetch them for the user so select shows options
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const res = await fetchHabits(userId)
        setHabits(res.data || [])
      } catch (err) {
        console.error('[RemindersPage] loadHabits', err)
      }
    }
    if (userId && (!initialHabits || initialHabits.length === 0)) loadHabits()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createReminder({ userId, habitId, time, enabled })
      setTime('08:00')
      setHabitId('')
      load()
      alert('Reminder created')
    } catch (err) {
      console.error('[RemindersPage] create', err)
      alert('Failed to create reminder')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete reminder?')) return
    try {
      await deleteReminder(id)
      load()
    } catch (err) {
      console.error('[RemindersPage] delete', err)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Reminders</h2>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 flex gap-2">
        <select value={habitId} onChange={(e) => setHabitId(e.target.value)} className="border p-2 rounded flex-1">
          <option value="">(Choose habit)</option>
          {habits.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="border p-2 rounded w-36" />
        <button className="bg-indigo-500 text-white px-4 py-2 rounded">Add</button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        {reminders.length === 0 ? <div className="text-slate-500">No reminders</div> : (
          <div className="flex flex-col gap-2">
            {reminders.map(r => (
              <div key={r._id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.habit ? r.habit.name : 'General'}</div>
                  <div className="text-sm text-slate-500">{r.time} • {r.enabled ? 'On' : 'Off'}</div>
                </div>
                <div>
                  <button onClick={() => handleDelete(r._id)} className="text-sm text-red-500">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
