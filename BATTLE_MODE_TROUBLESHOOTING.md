# Battle Mode Troubleshooting Guide

## WebSocket Connection Errors

### Error 1: "ERR_CONNECTION_REFUSED" on port 3001

**Symptom:**
- Console shows: `Failed to load resource: net::ERR_CONNECTION_REFUSED`
- Multiple errors for socket.io endpoints

**Cause:**
Backend server is not running on port 3001

**Fix:**
1. Open new terminal
2. Run: `pnpm run server`
3. Wait for: "WebSocket server ready for connections"
4. Refresh browser

### Error 2: "Cannot connect to battle server"

**Symptom:**
- Toast message appears: "Cannot connect to battle server. Make sure backend is running on port 3001"
- Console shows: `[Socket] Connection error:`

**Cause:**
- Backend server crashed
- Port 3001 is blocked
- CORS configuration issue

**Fix:**
1. Check if server is running: `netstat -an | grep 3001`
2. If running, restart it:
   ```bash
   Ctrl+C (stop)
   pnpm run server (restart)
   ```
3. If port blocked, kill process:
   ```bash
   # macOS/Linux
   lsof -ti:3001 | xargs kill -9
   
   # Then restart
   pnpm run server
   ```

### Error 3: "Not connected to battle server!"

**Symptom:**
- Clicking Battle Mode buttons shows this error
- No room is created or joined

**Cause:**
Socket connection hasn't established yet

**Fix:**
1. Check console (F12) - look for: `[v0] Battle server connection established`
2. Wait 2-3 seconds after page load
3. If still fails, refresh page
4. Verify backend is running: `pnpm run server`

---

## Game State Issues

### Issue: Matchmaking stuck / no opponent found

**Symptom:**
- Click "Matchmake"
- Shows "waiting" state indefinitely
- No opponent appears

**Cause:**
- Only one player in queue
- Rating mismatch (need 2 players within 100 rating points)
- Socket connection issue

**Fix:**
1. Open second browser window (incognito mode)
2. Sign in with different account
3. Both click "Matchmake"
4. Should match within 5 seconds

### Issue: Room code invalid / can't join

**Symptom:**
- Enter room code, get error: "Room not found"
- Room code appears correct

**Cause:**
- Room code typo
- Room expired (creator disconnected)
- Wrong format (must be 6 uppercase letters)

**Fix:**
1. Creator should re-create room
2. Copy code exactly (use copy button)
3. Ensure code is uppercase and 6 characters
4. Join within 60 seconds of creation

### Issue: Battle starts but no questions appear

**Symptom:**
- "Start Battle!" button works
- Countdown appears
- But questions don't load

**Cause:**
- Questions array is empty
- Game data not synced
- Browser console error

**Fix:**
1. Check console (F12) for errors
2. Ensure you completed "Choose Mission" first
3. Restart by going back to menu
4. Select questions difficulty again

---

## Progress & Stats Issues

### Issue: Progress bars not updating

**Symptom:**
- Your WPM updates but opponent's doesn't
- Progress bars stuck

**Cause:**
- Socket connection dropped
- Browser tab not focused
- Server overloaded

**Fix:**
1. Refresh page
2. Start new battle
3. Check network connection
4. Restart backend server

### Issue: Ratings not updating after battle

**Symptom:**
- Battle completes
- Winner announced correctly
- But rating stays the same

**Cause:**
- User stats not saved to backend
- Database not configured
- Browser cache issue

**Fix:**
1. Clear browser cache
2. Refresh page
3. Stats are in-memory; restart will reset them
4. For production, configure database

---

## Emoji & Interaction Issues

### Issue: Emojis not showing

**Symptom:**
- Click emoji reaction button
- No emoji appears on screen
- No error in console

**Cause:**
- Socket connection issue
- Battle not active
- Emoji event not received

**Fix:**
1. Ensure you're in "active" battle state
2. Check socket connection: Look for connection message in console
3. Try refreshing and starting new battle
4. Check backend server is running

---

## Disconnect & Reconnection

### Issue: "Opponent disconnected!" message

**Symptom:**
- Battle is going fine
- Suddenly see: "Opponent disconnected!"
- Battle ends

**Cause:**
- Opponent closed browser
- Lost internet connection
- Server crashed

**Fix:**
This is expected behavior. Return to menu and start new battle.

### Issue: Reconnection attempts fail

**Symptom:**
- Disconnected from server
- Shows "Reconnecting..." multiple times
- Eventually gives up

**Cause:**
- Backend server is down
- Network issue
- Port 3001 blocked

**Fix:**
1. Check backend server status
2. Restart with: `pnpm run server`
3. Refresh browser after server restarts

---

## Console Error Messages

### [Socket] Connection error: Error during WebSocket handshake

**Fix:**
- Restart backend: `pnpm run server`
- Restart frontend: `pnpm run dev`
- Check backend is listening on port 3001

### connect_error: xhr poll error

**Fix:**
- This is normal during startup
- Should resolve within 2-3 seconds
- If persistent, restart backend

### TypeError: Cannot read property 'emit' of null

**Fix:**
- Socket not connected yet
- Wait 2-3 seconds before clicking buttons
- Refresh page if issue persists

---

## Network & Firewall Issues

### Issue: Works locally but not on mobile/different device

**Symptom:**
- Works on localhost
- Mobile can't connect
- Different device shows connection errors

**Cause:**
- Firewall blocking port 3001
- Mobile on different network
- Frontend pointing to localhost instead of machine IP

**Fix:**
1. Find your machine IP: 
   - macOS/Linux: `ifconfig | grep "inet "`
   - Windows: `ipconfig`
2. Update on mobile: Change socket server URL
3. Allow port 3001 in firewall

### Issue: CORS errors

**Symptom:**
- Console shows CORS errors
- Socket connects but no messages received

**Cause:**
- Frontend URL not in server's CORS whitelist
- Production domain not configured

**Fix:**
- Edit `server.js` CORS configuration:
  ```javascript
  cors: {
    origin: "your-actual-url.com",
    methods: ["GET", "POST"]
  }
  ```
- Restart backend server

---

## Performance Issues

### Issue: High latency / slow responses

**Symptom:**
- Progress updates lagging
- 2+ second delay between typing and seeing updates
- Emoji reactions delayed

**Cause:**
- Backend overloaded (too many players)
- Network latency
- Browser running too many tabs

**Fix:**
1. Close other browser tabs
2. Restart backend: `pnpm run server`
3. Test with fresh browser window
4. Check internet speed

### Issue: Memory leaks / page crashes

**Symptom:**
- Game runs for while then crashes
- Browser becomes unresponsive
- Console shows memory warnings

**Cause:**
- Socket listeners not cleaned up
- Too many emoji events stored
- Large questions array

**Fix:**
1. Refresh page
2. Start new battle
3. Check for browser extensions causing issues
4. Update browser to latest version

---

## Quick Diagnostic Steps

1. **Open DevTools** (F12)
2. **Go to Console tab**
3. **Look for messages starting with `[v0]` or `[Socket]`**
4. **Check Network tab** for failed socket.io requests
5. **Take screenshot** of errors
6. **Share console output** when reporting issues

### What to look for:

✓ Good:
- `[v0] Battle server connection established`
- `[Socket] Connected: socketId...`
- No red errors in console

✗ Bad:
- `Failed to load resource: net::ERR_CONNECTION_REFUSED`
- No connection messages
- Red errors about socket.io

---

## Still Having Issues?

1. **Check backend is running:**
   ```bash
   # In one terminal
   pnpm run server
   ```

2. **Check frontend is running:**
   ```bash
   # In another terminal
   pnpm run dev
   ```

3. **Verify ports:**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:3001/health

4. **Test backend directly:**
   ```bash
   node test-battle-connection.js
   ```

5. **Review logs:**
   - Frontend console (F12)
   - Backend terminal output

If issues persist, restart both servers completely and try again.
