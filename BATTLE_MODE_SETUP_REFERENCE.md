# Battle Mode - Setup & Reference Guide

## 🎯 Quick Navigation

| Need | Location | Time |
|------|----------|------|
| **Quick Start** | `BATTLE_MODE_QUICKSTART.md` | 2 min |
| **Full Docs** | `BATTLE_MODE_README.md` | 10 min |
| **API Docs** | `BATTLE_MODE_API.md` | 15 min |
| **Implementation** | `BATTLE_MODE_IMPLEMENTATION.md` | 5 min |

## ⚡ Get Started Now

```bash
# 1. Install (already done):
# pnpm install

# 2. Set env vars (already done in .env.local):
# VITE_SOCKET_SERVER=http://localhost:3001
# PORT=3001

# 3. Start servers:
pnpm run dev-full

# 4. Open browser:
# Window 1: http://localhost:8080
# Window 2: http://localhost:8080 (different user or incognito)

# 5. Sign in both
# 6. Navigate to: Start Game → Battle Mode
# 7. Play!
```

## 📦 What's Included

### Backend Server (`server.js`)
- **Port**: 3001
- **Framework**: Express + Socket.io
- **Features**:
  - User registration
  - Battle room management
  - Matchmaking algorithm
  - Rating system
  - Real-time sync
  - Player stats

### Frontend Component (`BattleGame.jsx`)
- **Location**: `src/components/game/BattleGame.jsx`
- **Size**: 680 lines
- **Features**:
  - Full game UI
  - Socket.io integration
  - Real-time updates
  - Emoji reactions
  - Multi-game states

### Documentation
| File | Purpose | Pages |
|------|---------|-------|
| BATTLE_MODE_QUICKSTART.md | Fast setup guide | 4 |
| BATTLE_MODE_README.md | Complete documentation | 7 |
| BATTLE_MODE_API.md | WebSocket API reference | 15 |
| BATTLE_MODE_IMPLEMENTATION.md | What was built | 8 |
| BATTLE_MODE_SETUP_REFERENCE.md | This file | 2 |

### Utilities
| File | Purpose |
|------|---------|
| test-battle-connection.js | Test socket connection |
| .env.local | Development config |
| .env.example | Config template |

## 🔧 Commands Reference

```bash
# Development
pnpm run dev           # Frontend only (port 8080)
pnpm run server        # Backend only (port 3001)
pnpm run dev-full      # Both at once

# Testing
node test-battle-connection.js  # Test socket connection

# Production
pnpm run build         # Build for production
pnpm run preview       # Preview production build
```

## 🎮 Game Modes

### 1. Matchmaking (Auto-Match)
```
Flow: Click "Matchmake" → Wait → Auto-matched → Battle
Time: ~5-10 seconds
Best for: Finding random opponents
```

### 2. Create Room (Invite Friends)
```
Flow: Click "Create Room" → Get code → Share code → Battle
Time: Manual wait for friend
Best for: Playing with friends
```

### 3. Join Room (Code)
```
Flow: Click "Join Room" → Enter code → Battle
Time: Instant if host ready
Best for: Accepting room invite
```

## 📊 Rating System

```
Starting Rating: 1200
Win Bonus: +16
Loss Penalty: -16
Minimum: 800
Maximum: Unlimited

Matchmaking Range: ±100 from your rating
Example: Rating 1200 matches 1100-1300
```

## 🎯 Key Features

### During Battle
```
┌─────────────────────────────────┐
│  Real-Time Progress Tracking    │
│  ┌─ You: ▓▓▓░░░ 85 WPM ┐        │
│  │ Opponent: ▓▓░░░░ 62 WPM │  │
│  └────────────────────────┘      │
│                                 │
│  Question: What is...?          │
│  [Your typing here...]          │
│                                 │
│  [😎 🔥 💪 🎯 ⚡ 🚀 🎉 💯]      │
└─────────────────────────────────┘
```

### After Battle
```
Winner: You!
Your Stats          vs      Opponent
WPM: 95                     WPM: 78
Accuracy: 98%               Accuracy: 94%
Questions: 5/5              Questions: 4/5
Rating: +16 → 1216          Rating: -16 → 1134
```

## 🔌 Architecture

```
┌──────────────────────────────────────────┐
│         Frontend (React)                  │
│  BattleGame.jsx (680 lines)              │
│  - Game UI                                │
│  - State management                       │
│  - Socket.io client                       │
└──────────────────────┬────────────────────┘
                       │
                 Socket.io (WS)
                       │
┌──────────────────────┴────────────────────┐
│      Backend (Node.js + Express)          │
│  server.js (428 lines)                   │
│  - Battle rooms                           │
│  - Matchmaking                            │
│  - Player stats                           │
│  - Rating system                          │
└──────────────────────────────────────────┘
```

## 🌐 Environment Variables

```bash
# Frontend
VITE_SOCKET_SERVER=http://localhost:3001

# Server
PORT=3001
CLIENT_URL=http://localhost:8080
```

## 🚨 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Can't connect | Check if server running on :3001 |
| Socket fails | Verify VITE_SOCKET_SERVER in .env.local |
| No opponent | Ensure both players signed in |
| Game won't start | One player must click "Start Battle!" |
| Stats not saving | Currently in-memory; check server running |
| Emojis not showing | Check console for errors |

## 📱 Testing Locally

### Same Computer
```bash
# Terminal 1:
pnpm run dev

# Terminal 2:
pnpm run server

# Browser:
# Tab 1: http://localhost:8080 (logged in as User A)
# Tab 2: http://localhost:8080 (logged in as User B, incognito)
```

### Different Computers
```bash
# Get your IP:
ipconfig getifaddr en0  # Mac
ipconfig               # Windows

# Update .env.local:
VITE_SOCKET_SERVER=http://YOUR_IP:3001

# Restart servers and navigate to:
# Computer 1: http://YOUR_IP:8080
# Computer 2: http://YOUR_IP:8080
```

## 🐛 Debug Mode

```javascript
// In browser console:
localStorage.debug = 'socket.io-client:*';
// Reload page to see socket.io debug logs
```

## 📊 Server Stats

```bash
# While server running, in another terminal:
curl http://localhost:3001/stats | jq

# Output:
# {
#   "activeUsers": 2,
#   "activeBattles": 1,
#   "queueSize": 0,
#   "totalUsers": 5,
#   "timestamp": "2024-01-15T..."
# }
```

## 🎓 Learning Path

1. **Read**: BATTLE_MODE_QUICKSTART.md (2 min)
2. **Run**: `pnpm run dev-full` (1 min)
3. **Test**: Play one battle (5 min)
4. **Explore**: BattleGame.jsx component (10 min)
5. **Review**: server.js backend (15 min)
6. **Deep Dive**: BATTLE_MODE_API.md (15 min)

Total time to understand: ~45 minutes

## 🔑 Key Files Reference

```
/
├── server.js                          # Backend
├── src/components/game/
│   └── BattleGame.jsx                # Frontend component
├── src/context/
│   ├── GameContext.jsx               # Game state (updated)
│   └── AuthContext.jsx               # Auth (unchanged)
├── .env.local                        # Dev config
├── .env.example                      # Config template
├── package.json                      # Scripts (updated)
└── BATTLE_MODE_*.md                 # Documentation
```

## ✅ Success Indicators

- ✅ Both servers start without errors
- ✅ Can navigate to Battle Mode
- ✅ Can create and join rooms
- ✅ Can start battle countdown
- ✅ See opponent in real-time
- ✅ Progress bars update live
- ✅ Can send emojis
- ✅ Battle completes with winner
- ✅ Rating changes displayed

## 🚀 Next Steps

1. **Now**: Play around and get familiar
2. **Soon**: Customize questions in gameData.js
3. **Later**: Add database integration (see README)
4. **Future**: Deploy to production (see README)

## 📞 Need Help?

1. **Quick Questions**: Check BATTLE_MODE_QUICKSTART.md
2. **Technical Details**: See BATTLE_MODE_API.md
3. **Architecture**: Read BATTLE_MODE_README.md
4. **Troubleshooting**: See BATTLE_MODE_README.md troubleshooting section
5. **Test Connection**: Run `node test-battle-connection.js`

---

**Ready to play?** Run `pnpm run dev-full` now! 🎮
