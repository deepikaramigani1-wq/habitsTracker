import Reminder from '../models/Reminder.js'
import Habit from '../models/Habit.js'

export const createReminder = async (req, res) => {
  try {
    const { userId, habitId, time, timezone, enabled } = req.body
    const r = await Reminder.create({ userId, habitId, time, timezone, enabled })
    res.json(r)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const listReminders = async (req, res) => {
  try {
    const { userId } = req.params
    // populate habit and return results with `habit` property to match frontend expectations
    const reminders = await Reminder.find({ userId }).populate('habitId', 'name')
    const mapped = reminders.map(r => {
      const obj = r.toObject()
      obj.habit = obj.habitId || null
      // keep legacy field too
      return obj
    })
    res.json(mapped)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await Reminder.findByIdAndUpdate(id, req.body, { new: true })
    if (!updated) return res.status(404).json({ message: 'Reminder not found' })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params
    const removed = await Reminder.findByIdAndDelete(id)
    if (!removed) return res.status(404).json({ message: 'Reminder not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
