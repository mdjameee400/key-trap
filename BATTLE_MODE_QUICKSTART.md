# Battle Mode - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Start the Servers

```bash
# Option A: Run both servers at once
pnpm run dev-full

# Option B: Run separately in two terminals
# Terminal 1:
pnpm run dev

# Terminal 2:
pnpm run server
```

You should see:
- Frontend: `http://localhost:8080`
- Backend: WebSocket server on port 3001

### Step 2: Test Battle Mode

1. **Open 2 Browser Windows**
   - Window 1: http://localhost:8080
   - Window 2: http://localhost:8080 (or incognito window)

2. **Sign In**
   - Both windows need to be logged in

3. **Access Battle Mode**
   - From home, click "Start Game"
   - Click "Battle Mode"

4. **Start a Battle**
   
   **Option A - Matchmaking (Easiest)**
   - Both players click "Matchmake"
   - System auto-matches them
   
   **Option B - Room Code**
   - Player 1 clicks "Create Room"
   - Copy the room code shown
   - Player 2 clicks "Join Room"
   - Player 2 enters Player 1's code
   
   **Option C - Manual**
   - Player 1 clicks "Create Room"
   - Player 2 clicks "Join Room" with code

5. **Play the Battle**
   - See opponent info with rating
   - Click "Start Battle!" (either player can)
   - Wait for 3-second countdown
   - Start typing answers to questions
   - Race to finish all questions
   - See results with stats comparison

## ⚙️ Key Features

### During Battle
- **Progress Bars**: Watch both players' progress in real-time
- **WPM Counter**: Live words-per-minute for both players
- **Emoji Reactions**: Send quick emoji responses
  - 😎 🔥 💪 🎯 ⚡ 🚀 🎉 💯

### After Battle
- Winner is determined by highest WPM
- See detailed stats:
  - WPM (Words Per Minute)
  - Accuracy
  - Questions answered
  - Time taken
- Rating changes displayed
- Play again or return to menu

## 📊 Rating System

- Start at: 1200 rating
- Win: +16 points
- Loss: -16 points (minimum 800)
- Matchmaking pairs similar ratings (±100)

## 🔧 Customization

### Change Questions
Edit `src/lib/gameData.js` to modify questions used in battles.

### Change Emoji Reactions
In `BattleGame.jsx`, modify the `EMOJI_REACTIONS` array:
```javascript
const EMOJI_REACTIONS = ["😎", "🔥", "💪", "🎯", "⚡", "🚀", "🎉", "💯"];
```

### Change Rating Points
In `server.js`, find:
```javascript
stats.rating += 16; // Win
stats.rating = Math.max(800, stats.rating - 16); // Loss
```

### Change Matchmaking Range
In `server.js`, find:
```javascript
if (ratingDiff <= 100) { // Change 100 to desired range
```

## 📱 Multi-Device Testing

1. **Same Network**: Use your computer's IP instead of localhost
   - Find IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
   - Update `.env.local`: `VITE_SOCKET_SERVER=http://YOUR_IP:3001`
   - Access from other devices: `http://YOUR_IP:8080`

2. **Different Users**
   - Use different Firebase accounts in each window
   - Or use incognito/private browsing for second account

## 🐛 Common Issues

**"Cannot find opponent"**
- Ensure both players are signed in
- Check both have same VITE_SOCKET_SERVER URL
- Verify server is running on port 3001

**"Connection refused"**
- Is server running? (`pnpm run server`)
- Is it on the correct port? (3001)

**"WebSocket connection failed"**
- Check firewall settings
- Verify CORS is enabled in server.js
- Check browser console for errors

**"Game doesn't start"**
- One player must click "Start Battle!"
- Both players must be in "waiting" state
- Check server console for errors

## 📚 Full Documentation

See `BATTLE_MODE_README.md` for:
- Detailed architecture
- How to deploy to production
- Database integration
- Advanced customization
- Security considerations

## 🎮 Example Battle Flow

```
Player 1                          Player 2
    ↓                                 ↓
Click "Battle Mode"         Click "Battle Mode"
    ↓                                 ↓
Click "Create Room"         Click "Matchmake"
    ↓                                 ↓
Get room code ABC123        Join queue
    ↓                                 ↓
Wait for opponent...        (Auto-matched after ~5 sec)
    ↓                                 ↓
                    ← Both see opponent →
                    
                    Both see "Start Battle!"
                            ↓
                    Click "Start Battle!"
                            ↓
                    3... 2... 1...
                            ↓
                        BATTLE START!
                            ↓
            Answer typing questions
                            ↓
            First to finish all questions
                            ↓
                    See results
                    Rating updated
                    Play again?
```

---

**Need Help?** Check the full docs in `BATTLE_MODE_README.md`
