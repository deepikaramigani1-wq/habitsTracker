
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { addCheckin, updateHabit } from '../api'

export default function HabitCard({ habit, onDeleted, onUpdated }) {
  const [done, setDone] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(habit.name)
  const [editCategory, setEditCategory] = useState(habit.category || '')
  const [editPriority, setEditPriority] = useState(habit.priority || 2)
  const [editGoalType, setEditGoalType] = useState(habit.goal?.type || 'daily')
  const [editGoalValue, setEditGoalValue] = useState(habit.goal?.value || 1)

  const handleCheck = async () => {
    try {
      console.debug('[HabitCard] handleCheck start', habit._id)
      const res = await addCheckin({ habitId: habit._id })
      console.debug('[HabitCard] addCheckin response', res?.data)

      // mark done after successful request
      setDone(true)

      if (onUpdated) onUpdated(habit._id)
    } catch (err) {
      console.error('[HabitCard] handleCheck error', err)
      const msg = err?.response?.data?.message || err?.message || 'Unknown error'
      alert('Could not mark as done: ' + msg)
    }
  }

  const handleDelete = async () => {
    if (!onDeleted) return
    if (!confirm('Delete this habit?')) return

    try {
      setDeleting(true)
      await onDeleted(habit._id)
    } catch (err) {
      console.error(err)
      alert('Could not delete habit. Check your network or server.')
    } finally {
      setDeleting(false)
    }
  }

  const handleEditSave = async () => {
    try {
      const payload = {
        name: editName,
        category: editCategory,
        priority: parseInt(editPriority, 10),
        goal: {
          type: editGoalType,
          value: parseInt(editGoalValue, 10)
        }
      }
      await updateHabit(habit._id, payload)
      setEditing(false)
      if (onUpdated) onUpdated(habit._id)
    } catch (err) {
      console.error('[HabitCard] save error', err)
      alert('Failed to save habit')
    }
  }

  const created = habit.startDate ? dayjs(habit.startDate).format("MMM D") : 'N/A'

  return (
    <div className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl shadow bg-white hover:shadow-md transition">
      <div>
        {!editing ? (
          <>
            <h3 className="text-lg font-semibold text-slate-800">{habit.name}</h3>
            <p className="text-sm text-slate-500">{habit.category || "General"} • started {created}</p>
            <div className="mt-2 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-block w-3 h-3 rounded-full bg-green-200"></span>
                <span>Priority: {habit.priority}</span>
              </div>
              <div className="text-sm text-slate-600">
                🔥 Current: <span className="font-medium text-orange-500">{habit.currentStreak || 0}</span>
              </div>
              <div className="text-sm text-slate-600">
                ⭐ Best: <span className="font-medium text-yellow-600">{habit.longestStreak || 0}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              className="border p-2 rounded"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
            />
            <div className="flex gap-2">
              <select
                className="border p-2 rounded"
                value={editPriority}
                onChange={(e) => setEditPriority(parseInt(e.target.value, 10))}
              >
                <option value={1}>Priority 1</option>
                <option value={2}>Priority 2</option>
                <option value={3}>Priority 3</option>
              </select>
              <select
                className="border p-2 rounded"
                value={editGoalType}
                onChange={(e) => setEditGoalType(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="timesPerWeek">Times / Week</option>
              </select>
              <input
                type="number"
                min={1}
                className="border p-2 rounded w-24"
                value={editGoalValue}
                onChange={(e) => setEditGoalValue(parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row md:flex-col items-end md:items-center gap-2 ml-auto">
        {!editing ? (
          <>
            <button
              onClick={handleCheck}
              disabled={done}
              className={`px-4 py-2 rounded-lg font-semibold shadow-sm transition active:scale-95 ${
                done
                  ? 'bg-slate-200 text-slate-500 cursor-default'
                  : 'bg-sky-600 text-white hover:bg-sky-700'
              }`}
            >
              {done ? 'Done ✓' : '✓ Done'}
            </button>

            <div className="flex gap-3 items-center">
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`text-sm ${deleting ? 'text-slate-400' : 'text-slate-500 hover:text-red-500'}`}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleEditSave} className="px-3 py-1 bg-emerald-500 text-white rounded">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 border rounded">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
