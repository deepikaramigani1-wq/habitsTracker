# Habit Tracker

A full-stack web application to help you build and track daily habits. Create habits, mark them as done each day, and watch your streak grow.

## Features

- **Create Habits**: Add new habits with name, category, and priority level.
- **Daily Check-in**: Mark habits as completed each day.
- **Streak Tracking**: See how many consecutive days you've completed each habit.
- **Habit Management**: Delete habits and their associated check-ins.
- **Responsive Design**: Works on desktop and mobile (Tailwind CSS).

## Project Structure

```
HabitTracker/
├── Backend/              # Node.js + Express + MongoDB
│   ├── config/
│   │   └── db.js        # MongoDB connection
│   ├── controllers/      # Request handlers
# Habit Tracker

This is a concise, practical README describing the Habit Tracker project, its folder layout, how it works, and how to run it locally. The goal of the project is to provide a small full-stack app to create habits, mark daily check-ins, track streaks, schedule reminders, and run simple challenges.

Key ideas (short):
- Backend: Node.js + Express + Mongoose (MongoDB). Stores Habits, Checkins, Reminders, Challenges.
- Frontend: React + Vite + Tailwind. Small component-based UI under `frontend/src/components`.
- Dev workflow: run backend on :5000 and frontend on :5173 (Vite). Frontend talks to backend via a small Axios wrapper `frontend/src/api.js`.

## Folder structure

Top-level view of the repository (important files only):

```
habitsTracker/
├─ Backend/
│  ├─ config/           # db.js (Mongoose connection)
│  ├─ controllers/      # Express request handlers
│  ├─ models/           # Mongoose models (Habit, Checkin, Reminder, Challenge, User)
│  ├─ routes/           # Express routes
│  ├─ scripts/          # helper scripts (migrateStreaks, reminderScheduler, seedRewards)
│  ├─ server.js         # Express app entrypoint
	│  └─ package.json
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/    # React components (HabitCard, RemindersPage, ChallengesPage...)
│  │  ├─ api.js         # Axios client used by the UI
+ │  └─ main.jsx
│  └─ package.json
├─ start-dev.ps1        # helper script to launch backend+frontend in PowerShell
└─ README.md
```

Note: I trimmed non-essential entries above; the full project contains additional helper files under each folder.

## How it works (short technical summary)

- Data model (high level):
	- Habit: name, userId, goal (type/value), lastCheckinAt, currentStreak, longestStreak, reminders[]
	- Checkin: habitId, date
	- Reminder: userId, habitId (optional), time, timezone, enabled
	- Challenge: title, createdBy, participants[], startsAt/endsAt, goalType/value

- When a user marks a habit as done, the frontend calls POST /api/checkins with { habitId }.
- Backend creates a Checkin (date normalized to start-of-day) and updates the Habit document's streak fields:
	- If lastCheckinAt is yesterday -> increment currentStreak
	- If lastCheckinAt is today -> no-op (idempotent)
	- Otherwise reset currentStreak to 1
	- Update longestStreak when appropriate

## API contract (essential endpoints)

- Habits
	- GET /api/habits/:userId  -> returns list of Habit objects for a user
	- POST /api/habits         -> create habit (payload includes userId, name, goal, startDate)
	- PUT /api/habits/:id      -> update habit
	- DELETE /api/habits/:id   -> delete habit and associated checkins

- Checkins
	- POST /api/checkins           -> { habitId } create today's checkin and update habit streak
	- GET  /api/checkins/streak/:habitId -> returns { streak }

- Reminders
	- POST /api/reminders       -> create reminder { userId, habitId?, time, timezone, enabled }
	- GET  /api/reminders/:userId -> list reminders for a user (each reminder includes populated habit info)
	- PUT  /api/reminders/:id   -> update reminder
	- DELETE /api/reminders/:id -> delete reminder

- Challenges
	- POST /api/challenges         -> create challenge
	- POST /api/challenges/:id/join -> join challenge (body: { userId })
	- GET  /api/challenges         -> list challenges
	- GET  /api/challenges/:id/leaderboard -> placeholder

All endpoints return JSON and use standard HTTP status codes (200 for OK, 4xx for client errors, 5xx for server errors).

## Run locally (concise)

1. Backend

```powershell
cd Backend
npm install
copy .env.example .env   # edit Backend/.env and fill MONGO_URI
npm run dev
```

2. Frontend

```powershell
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open http://localhost:5173 in your browser.

Or from the repo root run the helper PowerShell script:

```powershell
.\start-dev.ps1
```

## Environment and secrets

- Use `Backend/.env.example` as a template. Never commit real credentials. I removed `Backend/.env` from git and added a `.env.example` file.

## Notes, limitations and suggested improvements

- The challenge leaderboard is a placeholder; to implement fully we should decide how participants map to habits and measure their progress within the challenge window.
- Reminders are stored and can be scheduled by `Backend/scripts/reminderScheduler.js` — this scheduler is not automatically started in dev.
- Input validation is minimal; adding server-side validation (e.g., using Joi or express-validator) would make APIs more robust.

## Repo housekeeping recommendation

- The repo currently had `frontend/node_modules` tracked; this should be removed from git to reduce repo size. If you give the go-ahead I will:
	1. Add `frontend/node_modules/` to `.gitignore`
	2. Remove tracked node_modules: `git rm -r --cached frontend/node_modules`
	3. Commit and push the cleanup

## I can do next (pick one)

- Remove `node_modules` from the repo and push a cleaned branch (recommended)
- Implement a proper challenge leaderboard (tie participants to habits)
- Wire the reminder scheduler to run on dev and log sends
- Add input validation to the backend endpoints

Tell me which task you'd like me to do next and I'll implement it and push the change to your repository.

---

Happy habit tracking!

---

Happy habit tracking! 🎯

