import React, { useEffect, useState } from 'react'
import { fetchHabits, createHabit, deleteHabit, updateHabit } from '../api'
import HabitCard from './HabitCard'

function parseJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch (e) {
    return null
  }
}

export default function HabitsPage() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')

  const getUserId = () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const p = parseJwt(token)
    return p?.id || null
  }

  const load = async () => {
    setLoading(true)
    try {
      const userId = getUserId()
      const res = await fetchHabits(userId)
      setHabits(res.data || [])
    } catch (err) {
      console.error('[HabitsPage] load error', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      const userId = getUserId()
      await createHabit({ userId, name, category })
      setName('')
      setCategory('')
      await load()
    } catch (err) {
      console.error('[HabitsPage] create error', err)
      alert(err.response?.data?.message || 'Failed to create habit')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteHabit(id)
      await load()
    } catch (err) {
      console.error('[HabitsPage] delete error', err)
    }
  }

  if (loading) return <div className="text-center py-8">Loading habits...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Habits</h1>

      <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Habit name"
          required
          className="px-3 py-2 border rounded col-span-2"
        />
        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Category (optional)"
          className="px-3 py-2 border rounded"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={creating}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {creating ? 'Creating...' : 'Create Habit'}
          </button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {habits.length === 0 && <div className="text-center text-slate-500">No habits yet — create one above.</div>}
        {habits.map(h => (
          <HabitCard
            key={h._id}
            habit={h}
            onDeleted={() => handleDelete(h._id)}
            onUpdated={() => load()} // reload habits on update
          />
        ))}
      </div>
    </div>
  )
}
