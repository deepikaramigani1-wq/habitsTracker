# Habit Tracker - Local Development & Testing Guide

## Quick Start

### Start Both Servers (Backend + Frontend)

From the project root, run:

```powershell
cd C:\Users\Administrator\HabitTracker
powershell -ExecutionPolicy Bypass -File .\start-dev.ps1
```

This will:
- Start backend on `http://localhost:5000`
- Start frontend on `http://localhost:5173`
- Configure CORS for local cross-origin requests

### Manual Start (if needed)

**Backend:**
```powershell
cd C:\Users\Administrator\HabitTracker\Backend
$env:FRONTEND_URL='http://localhost:5173'
node server.js
```

**Frontend:**
```powershell
cd C:\Users\Administrator\HabitTracker\frontend
$env:VITE_API_URL='http://localhost:5000/api'
npm run dev
```

---

## Testing the Application

### 1. Web UI Testing (http://localhost:5173)

#### Create a Habit
- Open the frontend at `http://localhost:5173`
- Fill in the form:
  - **Habit Name:** e.g., "Morning Run"
  - **Category:** e.g., "Exercise"
  - **Goal Type:** Choose "Daily" or "Times / Week"
  - **Goal Value:** e.g., 1 (for daily) or 3 (for 3x/week)
  - **Priority:** 1, 2, or 3
- Click "Add Habit"
- Expected: Habit appears in the list with streak info

#### Mark Habit as Done
- Click the "✓ Done" button on a habit card
- Expected: Button changes to "Done ✓" (disabled state)
- On page refresh, the habit should show `currentStreak = 1`

#### Edit a Habit
- Click the "Edit" button on a habit card
- Update name, category, priority, goal type/value
- Click "Save"
- Expected: Habit is updated in the list and database

#### Delete a Habit
- Click "Delete" on a habit card
- Confirm in the popup
- Expected: Habit is removed from the list

#### View Charts
- The first habit's progress chart appears below the habit list
- Use the "Chart:" dropdown to select a different habit
- Chart shows daily counts over the last 30 days
- Expected: Line chart displays correctly (Recharts integration)

#### Insights Dashboard
- Click "📊 Insights" tab
- Shows total habits and average current streak
- Lists all habits with their streaks
- Expected: Data is populated from the database

#### Reminders Page
- Click "⏰ Reminders" tab
- Select a habit and a time (e.g., 08:00)
- Click "Add" to create a reminder
- Expected: Reminder appears in the list
- Click "Delete" to remove a reminder

#### Challenges Page
- Click "🏁 Challenges" tab
- Create a new challenge:
  - Enter title (e.g., "30-Day Push Challenge")
  - Select goal type and value
  - Click "Create"
- Click "Join" on any challenge to participate
- Expected: Challenge is created and joinable

#### Rewards Page
- Click "🎁 Rewards" tab
- Shows user's current points (initially 0)
- Lists available rewards (should show 8 rewards if seeded)
- Expected: Can see rewards and claim them if user has enough points

---

### 2. API Testing (Backend)

Use PowerShell to test endpoints directly:

#### Get All Habits
```powershell
$demoUserId = "000000000000000000000000"
Invoke-WebRequest -Uri "http://localhost:5000/api/habits/$demoUserId" -Method GET | Select-Object -ExpandProperty Content
```

Expected response (array of habits):
```json
[
  {
    "_id": "...",
    "name": "Morning Run",
    "category": "Exercise",
    "userId": "000000000000000000000000",
    "currentStreak": 0,
    "longestStreak": 0,
    "goal": { "type": "daily", "value": 1 },
    "priority": 2,
    "startDate": "2025-11-18T...",
    "lastCheckinAt": null
  }
]
```

#### Create a Habit
```powershell
$body = @{
  userId = "000000000000000000000000"
  name = "Test Habit"
  category = "Test"
  priority = 1
  goal = @{ type = "daily"; value = 1 }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/habits" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body | Select-Object -ExpandProperty Content
```

#### Add a Check-in
```powershell
$body = @{
  habitId = "PASTE_HABIT_ID_HERE"
  date = "2025-11-18T00:00:00Z"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/checkins" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body | Select-Object -ExpandProperty Content
```

Expected response shows updated streak and user points.

#### Get Habit Stats
```powershell
$habitId = "PASTE_HABIT_ID_HERE"
Invoke-WebRequest -Uri "http://localhost:5000/api/habit-stats/$habitId/stats?range=30" `
  -Method GET | Select-Object -ExpandProperty Content
```

Expected: Array of daily check-in counts for the past 30 days.

#### Get Rewards
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/rewards" -Method GET | Select-Object -ExpandProperty Content
```

Expected: Array of 8 rewards (if seeded with `node Backend/scripts/seedRewards.js`).

---

## Data Setup

### Seed Rewards (Required)
Run once to populate the rewards catalog:
```powershell
cd C:\Users\Administrator\HabitTracker\Backend
node scripts/seedRewards.js
```

### Migrate Streaks (Optional)
If you have historical check-ins, compute streaks and points:
```powershell
cd C:\Users\Administrator\HabitTracker\Backend
node scripts/migrateStreaks.js
```

---

## Features Checklist

- [x] Create custom habits with frequency goals (daily / times-per-week)
- [x] Daily check-in system (mark habits as done)
- [x] Streak tracking (current and longest streaks)
- [x] Rewards system with points and badges
- [x] Visual progress charts (line chart via Recharts)
- [x] Habit categories and priority levels
- [x] Reminders UI (create/list/delete reminders)
- [x] Insights dashboard (habit overview, average streaks)
- [x] Challenge mode UI (create/join challenges)
- [x] Inline habit editing (edit name, category, priority, goals)
- [x] Backend endpoints for all features
- [x] Migration scripts for historical data

---

## Troubleshooting

### Backend won't start
- Ensure `MONGO_URI` is set in `Backend/.env`
- Verify MongoDB connection: `mongodb+srv://deepikaramigani:deepika@cluster0.dm4gaeq.mongodb.net/habits`
- Check if port 5000 is in use: `netstat -ano | findstr :5000`

### Frontend dev server won't start
- Ensure `npm install` has been run in `frontend/` folder
- Check that `node_modules/vite` exists
- Try deleting `frontend\.vite` cache and retry

### CORS errors in browser console
- Ensure `FRONTEND_URL` is set correctly on backend (default: `http://localhost:5173` for local dev)
- Backend logs should show `CORS allowed origins: [ 'http://localhost:5173' ]`

### API requests return 404
- Check backend logs for route registration
- Verify endpoint format: `/api/habits`, `/api/checkins`, `/api/rewards`, etc.

---

## Project Structure

```
HabitTracker/
├── Backend/
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Route handlers
│   ├── routes/          # API endpoints
│   ├── scripts/         # Migration, seeding, scheduler
│   ├── server.js        # Express app
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api.js      # Axios client
│   │   └── App.jsx     # Main app
│   └── package.json
│
├── start-dev.ps1         # Dev server launcher
└── README.md
```

---

## Next Steps

1. **Local Testing:** Run `start-dev.ps1` and test all UI features
2. **Deployment:** Deploy to Render (see README.md for steps)
3. **Production Checklist:**
   - Rotate MongoDB credentials
   - Set `FRONTEND_URL`, `VITE_API_URL`, `MONGO_URI` on Render
   - Optional: Configure SendGrid for email reminders (`SENDGRID_API_KEY`, `SENDGRID_FROM`)
   - Run `seedRewards.js` on production DB
   - Start reminder scheduler as a background service/worker

---

## Support

For issues:
1. Check the troubleshooting section
2. Review backend logs: `Terminal ID` in `start-dev.ps1`
3. Check browser console (F12) for frontend errors
4. Open a GitHub issue with logs and error details

Happy testing! 🎯
