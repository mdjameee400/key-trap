# Battle Mode - Quick Fix Reference

## The Problem
Frontend was throwing `ERR_CONNECTION_REFUSED` errors because the **WebSocket backend server wasn't running**.

## The Solution
Run the backend server on port 3001:

```bash
pnpm run dev-full
```

That's it! Both servers run together.

---

## What's Running

| Component | Port | Command | Status |
|-----------|------|---------|--------|
| Frontend (React) | 8080 | `pnpm run dev` | http://localhost:8080 |
| Backend (WebSocket) | 3001 | `pnpm run server` | http://localhost:3001/health |

## Verify Connection

Open browser DevTools (F12) → Console

**✓ Good:** See `[v0] Battle server connection established`

**✗ Bad:** See `ERR_CONNECTION_REFUSED` or no connection message

## If Connection Fails

1. Check backend is running: Look for terminal window with "WebSocket server ready"
2. If not running: Start it with `pnpm run server`
3. Wait 2-3 seconds
4. Refresh browser

## Test Backend Directly

```bash
# Should return success
curl http://localhost:3001/health

# Show live stats
curl http://localhost:3001/stats
```

## Two-Player Testing

Window 1:
- http://localhost:8080 (normal)
- Sign in as User A

Window 2:
- http://localhost:8080 (incognito/private)
- Sign in as User B

Both click Matchmake → Should match!

## Files Changed

- `src/components/game/BattleGame.jsx` - Better error handling
- `src/context/AuthContext.jsx` - Always render children
- `src/pages/Auth.jsx` - Fixed imports

## New Guides

- `BACKEND_SERVER_SETUP.md` - Complete backend setup
- `BATTLE_MODE_TROUBLESHOOTING.md` - Common issues & fixes
- `BATTLE_MODE_BACKEND_FIXED.md` - Full explanation

## Troubleshooting

| Error | Fix |
|-------|-----|
| "ERR_CONNECTION_REFUSED" | Backend not running. Run: `pnpm run server` |
| "Cannot connect to battle server" | Restart backend: `pnpm run server` |
| "Not connected to battle server!" | Wait 2 seconds and try again |
| No messages received | Refresh browser and restart servers |

## Normal Console Messages

These are expected and harmless:

```
[warning] [v0] Firebase configuration incomplete
```

This appears if Firebase credentials aren't set (optional for battle mode).

## Ready to Go!

```bash
# Start everything
pnpm run dev-full

# Open browser
http://localhost:8080

# Play!
Battle Mode → Create/Join Room or Matchmake
```

---

✓ Socket connection errors fixed
✓ Better error messages
✓ Full documentation
✓ Ready for multiplayer battles!
