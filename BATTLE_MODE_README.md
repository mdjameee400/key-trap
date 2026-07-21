# Battle Mode - Real-Time Multiplayer Typing Battles

Battle Mode is a real-time multiplayer typing battle system where two players compete simultaneously to answer typing questions faster and more accurately.

## Features

✨ **Real-Time Multiplayer**
- WebSocket-based live gameplay using Socket.io
- Real-time progress tracking for both players
- Live WPM and accuracy updates

⚡ **Smart Matchmaking**
- Rating-based matchmaking system (ELO-style)
- Queue system for finding opponents
- Manual room creation and code-based joining

🎯 **Rich Game Features**
- Head-to-head typing battles
- Live progress bars for both players
- Emoji reactions during gameplay
- Detailed post-game statistics
- Rating changes based on wins/losses

👥 **User Stats & Progression**
- Persistent player rating system
- Win/loss tracking
- WPM and accuracy statistics
- Battle history

## Setup

### Prerequisites
- Node.js 16+
- Firebase authentication (already configured)

### Installation

1. **Install dependencies** (already done):
```bash
pnpm install
```

2. **Configure environment variables**:

Create a `.env.local` file with:
```env
VITE_SOCKET_SERVER=http://localhost:3001
PORT=3001
CLIENT_URL=http://localhost:8080
```

For production, update to your actual server URL.

### Running Locally

**Option 1: Run both servers together**
```bash
pnpm run dev-full
```

This starts:
- Vite dev server on `http://localhost:8080`
- WebSocket server on `http://localhost:3001`

**Option 2: Run servers separately**

Terminal 1 - Frontend:
```bash
pnpm run dev
```

Terminal 2 - Backend:
```bash
pnpm run server
```

## How It Works

### Game Flow

1. **Menu**: Player chooses between matchmaking, creating a room, or joining a room
2. **Room Setup**: 
   - Host gets a unique room code to share
   - Guest enters the room code to join
   - OR: Join matchmaking queue for automatic matching
3. **Waiting**: Both players see opponent info and confirm ready
4. **Countdown**: 3-second countdown before battle starts
5. **Active Battle**: Players compete by answering questions
   - Real-time progress bars update
   - Can send emoji reactions
   - First to finish all questions wins
6. **Results**: Detailed statistics and rating changes displayed

### Rating System

The system uses an ELO-like rating calculation:
- **Win**: +16 rating points
- **Loss**: -16 rating points (minimum 800)
- **Draw**: No change

Matchmaking tries to pair players within 100 rating points of each other.

### Real-Time Updates

During active battles, progress is updated every 500ms:
- Characters typed
- Words per minute (WPM)
- Accuracy percentage
- Current question progress

### Emoji Reactions

Players can send quick emoji reactions during gameplay:
- 😎 Cool
- 🔥 Fire
- 💪 Strong
- 🎯 On target
- ⚡ Lightning fast
- 🚀 Rocket
- 🎉 Celebration
- 💯 Perfect

Emoji messages appear briefly on screen and are shared with the opponent.

## Architecture

### Frontend (`BattleGame.jsx`)

- React component managing game UI and state
- Socket.io client for real-time communication
- Multiple game states:
  - `menu`: Main options screen
  - `join`: Enter room code
  - `room-setup`: Wait for opponent after creating room
  - `waiting`: Both players ready
  - `countdown`: 3-second start countdown
  - `active`: Live battle gameplay
  - `finished`: Results screen

### Backend (`server.js`)

Express + Socket.io server handling:

**Key Features:**
- User registration and session management
- Battle room creation and joining
- Real-time progress synchronization
- Matchmaking queue logic
- Battle completion and winner determination
- Stats persistence (in-memory; use database for production)

**Main Events:**
- `register-user`: Register player when connecting
- `create-battle-room`: Host creates a new battle room
- `join-battle-room`: Guest joins existing room
- `start-battle`: Begin the battle
- `update-progress`: Send player progress updates
- `send-emoji`: Send emoji reaction
- `finish-battle`: Complete the battle and calculate results
- `join-queue`: Join matchmaking queue
- `leave-queue`: Leave matchmaking queue

## Game Data

Battle Mode uses the same question system as other game modes. Questions are fetched from `GameContext` and include:
- `question`: The typing prompt
- `answer`: The correct answer

## Production Considerations

For production deployment:

1. **Database Integration**:
   - Move user stats from in-memory storage to a database
   - Persist battle history
   - Store user ratings

2. **Server Deployment**:
   - Deploy Node.js server to a platform like Hercel, Railway, or AWS
   - Update `VITE_SOCKET_SERVER` to production URL
   - Enable CORS with appropriate domains

3. **Scaling**:
   - Use Redis for distributed matchmaking across multiple server instances
   - Implement clustering for horizontal scaling
   - Add rate limiting and abuse prevention

4. **Monitoring**:
   - Add logging for game events
   - Monitor active connections and matchmaking queue
   - Track battle completion rates and disconnects

5. **Security**:
   - Validate all game data server-side
   - Implement anti-cheat measures
   - Add rate limiting for API endpoints
   - Secure user authentication tokens

## Testing Battle Mode

1. Open the app in two browser windows/tabs
2. Authenticate in both (can be same or different users)
3. Player 1: Click "Matchmake" or "Create Room"
4. Player 2: "Matchmake" or enter Player 1's room code
5. Both see opponent info
6. One clicks "Start Battle!"
7. Both see 3-second countdown
8. Battle begins - race to finish!

## Troubleshooting

**Socket connection fails:**
- Ensure server is running on correct port (3001)
- Check VITE_SOCKET_SERVER env var matches server URL
- Verify firewall isn't blocking WebSocket connections

**Can't find opponent:**
- Ensure both players are registered
- Check matchmaking queue has at least 2 players
- Try creating/joining a room manually instead

**Game feels slow:**
- Check network latency
- Verify server is running locally (not remote in development)
- Check browser console for errors

**Battle doesn't start:**
- Ensure both players reached "waiting" state
- One player must click "Start Battle!"
- Check WebSocket console for connection issues

## Files

- `src/components/game/BattleGame.jsx` - Main battle mode UI component
- `server.js` - WebSocket server (run with `pnpm run server`)
- `.env.local` - Local environment configuration

## Future Enhancements

- Ranked seasons and leaderboards
- Tournament brackets
- Power-ups during battles
- Spectator mode
- Replay system
- Different battle modes (team battles, time trials)
- Voice/video chat integration
