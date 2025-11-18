import Checkin from "../models/Checkin.js";
import dayjs from "dayjs";
import Habit from "../models/Habit.js";

export const addCheckin = async (req, res) => {
  try {
    const { habitId } = req.body;

    const today = dayjs().startOf("day").toDate();

    const existing = await Checkin.findOne({ habitId, date: today });
    if (existing) return res.json(existing);

    const checkin = await Checkin.create({ habitId, date: today });
    // Update habit's streak fields
    try {
      const habit = await Habit.findById(habitId)
      if (habit) {
        const last = habit.lastCheckinAt ? dayjs(habit.lastCheckinAt).startOf('day') : null
        const todayStart = dayjs().startOf('day')

        let newStreak = 1
        if (last) {
          if (last.isSame(todayStart, 'day')) {
            newStreak = habit.currentStreak || 1
          } else if (last.isSame(todayStart.subtract(1, 'day'), 'day')) {
            newStreak = (habit.currentStreak || 0) + 1
          } else {
            newStreak = 1
          }
        }

        const newLongest = Math.max(habit.longestStreak || 0, newStreak)

        habit.lastCheckinAt = todayStart.toDate()
        habit.currentStreak = newStreak
        habit.longestStreak = newLongest

        await habit.save()
      }
    } catch (err) {
      // non-fatal: log but don't fail the checkin creation
      console.error('[checkinController] failed to update habit streak', err)
    }

    res.json(checkin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStreak = async (req, res) => {
  try {
    const { habitId } = req.params;

    const checkins = await Checkin.find({ habitId }).sort({ date: -1 });

    let streak = 0;
    let currentDate = dayjs().startOf("day");

    for (let c of checkins) {
      if (dayjs(c.date).isSame(currentDate, "day")) {
        streak++;
        currentDate = currentDate.subtract(1, "day");
      } else break;
    }

    res.json({ streak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
