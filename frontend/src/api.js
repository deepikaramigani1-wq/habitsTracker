import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const API = axios.create({
	baseURL,
	timeout: 5000,
})

// simple logging to help debug network issues in development
API.interceptors.request.use((config) => {
	// eslint-disable-next-line no-console
	console.debug('[api] request', config.method, config.url)
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
})

API.interceptors.response.use(
	(res) => res,
	(err) => {
		// eslint-disable-next-line no-console
		console.error('[api] response error', err.message)
		return Promise.reject(err)
	}
)

export const fetchHabits = (userId) => API.get(`/habits/${userId}`)
export const createHabit = (payload) => API.post('/habits', payload)
export const deleteHabit = (id) => API.delete(`/habits/${id}`)
export const updateHabit = (id, payload) => API.put(`/habits/${id}`, payload)
export const addCheckin = (payload) => API.post('/checkins', payload)
export const getStreak = (habitId) => API.get(`/checkins/streak/${habitId}`)
// Rewards
export const fetchRewards = () => API.get('/rewards')
export const claimReward = (userId, rewardId) => API.post('/rewards/claim', { userId, rewardId })
export const getUserRewards = (userId) => API.get(`/rewards/${userId}`)

// Habit stats
export const fetchHabitStats = (habitId, range = 30) => API.get(`/habit-stats/${habitId}/stats?range=${range}`)
export const fetchHabitProgress = (habitId) => API.get(`/habit-stats/${habitId}/progress`)

// Reminders
export const fetchReminders = (userId) => API.get(`/reminders/${userId}`)
export const createReminder = (payload) => API.post('/reminders', payload)
export const updateReminder = (id, payload) => API.put(`/reminders/${id}`, payload)
export const deleteReminder = (id) => API.delete(`/reminders/${id}`)

// Challenges
export const fetchChallenges = () => API.get('/challenges')
export const createChallenge = (payload) => API.post('/challenges', payload)
export const joinChallenge = (challengeId, userId) => API.post(`/challenges/${challengeId}/join`, { userId })
export const fetchChallenge = (id) => API.get(`/challenges/${id}`)

export default API