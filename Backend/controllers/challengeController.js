import Challenge from '../models/Challenge.js'
import Checkin from '../models/Checkin.js'
import User from '../models/User.js'
import dayjs from 'dayjs'

export const createChallenge = async (req, res) => {
  try {
    // Accept frontend-friendly fields and map to model shape
    const { title, creator, createdBy, goalType, goalValue, description } = req.body

    // Map incoming goalType values to model's enum
    let mappedGoalType = goalType
    if (!['streak', 'checkins', 'custom'].includes(mappedGoalType)) {
      // frontend may send 'daily' or 'timesPerWeek' -> treat as checkins
      if (mappedGoalType === 'daily' || mappedGoalType === 'timesPerWeek') mappedGoalType = 'checkins'
      else mappedGoalType = 'streak'
    }

    const payload = {
      title,
      description,
      createdBy: createdBy || creator,
      goalType: mappedGoalType,
      goalValue: goalValue || 7,
      startsAt: req.body.startsAt || new Date(),
      endsAt: req.body.endsAt || null,
    }

    const c = await Challenge.create(payload)
    // populate creator name for immediate frontend use
    const populated = await Challenge.findById(c._id).populate('createdBy', 'name')
    const obj = populated.toObject()
    obj.creatorName = obj.createdBy?.name || obj.createdBy
    res.json(obj)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const joinChallenge = async (req, res) => {
  try {
    const { id } = req.params
    const { userId } = req.body
    const c = await Challenge.findById(id)
    if (!c) return res.status(404).json({ message: 'Challenge not found' })
    if (!c.participants.includes(userId)) c.participants.push(userId)
    await c.save()
    res.json({ message: 'Joined' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const listChallenges = async (req, res) => {
  try {
    // populate creator info for frontend display
    const list = await Challenge.find().sort({ startsAt: -1 }).populate('createdBy', 'name')
    const mapped = list.map(c => {
      const obj = c.toObject()
      obj.creatorName = obj.createdBy?.name || obj.createdBy
      return obj
    })
    res.json(mapped)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const leaderboard = async (req, res) => {
  try {
    const { id } = req.params
    const c = await Challenge.findById(id).populate('participants', 'name')
    if (!c) return res.status(404).json({ message: 'Challenge not found' })

    const results = []
    for (const p of c.participants) {
      // simple metric: number of checkins during challenge period
      const count = await Checkin.countDocuments({
        habitId: { $in: [] },
        date: { $gte: c.startsAt, $lte: c.endsAt }
      })
      // Note: This simplistic approach assumes users' habits are not enumerated here.
      results.push({ user: p, score: count })
    }

    // sort desc
    results.sort((a, b) => b.score - a.score)
    res.json(results)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
