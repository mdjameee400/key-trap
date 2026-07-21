# Battle Mode Backend Server Setup

## Quick Start - Run Backend Server

The Battle Mode requires a WebSocket server running in the background to handle real-time multiplayer battles.

### Step 1: Start the Backend Server

Open a **new terminal window** and run:

```bash
# Navigate to project directory
cd /vercel/share/v0-project

# Start the backend server
pnpm run server
```

You should see output like:
```
Battle server listening on port 3001
WebSocket server ready for connections
```

**Important:** Keep this terminal open while testing. The server must stay running.

### Step 2: Start the Frontend (In Another Terminal)

Open a **second terminal window** and run:

```bash
cd /vercel/share/v0-project
pnpm run dev
```

Frontend will run on `http://localhost:8080`

### Step 3: Test Connection

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for message: `[v0] Battle server connection established`
4. If you see: `Cannot connect to battle server` - backend is not running

---

## Full Commands Reference

### Option 1: Run Both Servers Together (Recommended)

```bash
pnpm run dev-full
```

This runs both backend (port 3001) and frontend (port 8080) in one terminal.

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
pnpm run server
# Runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
pnpm run dev
# Runs on http://localhost:8080
```

### Option 3: Check Environment

Before starting servers, verify setup:
```bash
pnpm run check-env
```

---

## Backend Server Details

### Port Configuration
- Default Port: `3001`
- Set custom port: `PORT=3002 pnpm run server`

### Environment Variables (Optional)

Edit `.env.local` to customize:

```env
# Server configuration
PORT=3001
CLIENT_URL=http://localhost:8080

# CORS origin (what frontend URLs can connect)
VITE_SOCKET_SERVER=http://localhost:3001
```

### Health Check Endpoint

Once server is running, test it:

```bash
# Check server status
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "ok",
#   "activeConnections": 0,
#   "activeBattles": 0,
#   "queueSize": 0
# }
```

### Server Statistics

```bash
# Get real-time stats
curl http://localhost:3001/stats

# Response shows:
# - activeUsers: Number of connected players
# - activeBattles: Number of ongoing battles
# - queueSize: Players waiting for matchmaking
```

---

## What Backend Server Does

The backend manages:
- Real-time WebSocket connections (Socket.io)
- Battle room creation and management
- Player matchmaking
- Progress synchronization during battles
- Win/loss tracking and rating updates
- Emoji reactions between players
- Graceful disconnection handling

---

## Troubleshooting

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Problem:** Frontend can't connect to backend server

**Solutions:**
1. Is backend server running?
   - Check terminal where you ran `pnpm run server`
   - You should see: "WebSocket server ready for connections"

2. Is it on correct port?
   - Backend should be on port 3001
   - Check: `netstat -an | grep 3001` (macOS/Linux)

3. Restart servers:
   ```bash
   # Stop current servers (Ctrl+C)
   # Start fresh
   pnpm run dev-full
   ```

### Error: "Not connected to battle server!"

**Problem:** Frontend doesn't see backend as connected

**Solutions:**
1. Check console (F12) for connection messages
2. Wait 2-3 seconds for connection to establish
3. Refresh page if connection fails
4. Check browser firewall isn't blocking port 3001

### Backend crashes or hangs

**Problem:** Server process stopped

**Solutions:**
1. Stop the process: `Ctrl+C`
2. Kill any process on port 3001:
   ```bash
   # macOS/Linux
   lsof -ti:3001 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```
3. Start fresh: `pnpm run server`

---

## Testing Backend Directly

Use the test utility to verify backend:

```bash
node test-battle-connection.js
```

This simulates a connection and shows:
- Connection status
- Socket events
- Real-time updates
- Emoji delivery

---

## Production Deployment

For Vercel deployment:

1. Backend must be a separate service (Node.js)
2. Add to `vercel.json`:
   ```json
   {
     "functions": {
       "server.js": {
         "runtime": "nodejs18.x"
       }
     }
   }
   ```

3. Set environment variable in Vercel:
   - `VITE_SOCKET_SERVER`: Your production backend URL

4. Update CORS in `server.js` to accept production domain

---

## Server Architecture

```
┌─────────────────────────────────────┐
│    Frontend (React)                 │
│    http://localhost:8080            │
│    Socket.io Client                 │
└────────────────────┬────────────────┘
                     │ WebSocket
                     ├─ Connection
                     ├─ Battles
                     ├─ Progress
                     └─ Events
┌────────────────────┴────────────────┐
│    Backend (Node.js + Express)      │
│    http://localhost:3001            │
│    Socket.io Server                 │
│                                     │
│  - Room Management                  │
│  - Matchmaking                      │
│  - Stats Tracking                   │
│  - Real-time Sync                   │
└─────────────────────────────────────┘
```

---

## Next Steps

1. Start backend: `pnpm run server`
2. Start frontend: `pnpm run dev`
3. Open http://localhost:8080
4. Click "Battle Mode"
5. Create or join a room
6. Play with a friend!

For issues, check console logs or see TROUBLESHOOTING section above.
