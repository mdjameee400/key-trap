# Battle Mode - WebSocket API Documentation

## Overview

Battle Mode uses Socket.io for real-time communication between clients and the server. This document details all events and their payloads.

## Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
```

## Client Events (Emit)

### 1. `register-user`
Register a player when they connect.

**Emit:**
```javascript
socket.emit('register-user', {
    userId: string,      // User's unique ID
    username: string,    // Display name
    rating?: number      // Optional: Initial rating (default: 1200)
});
```

**Callback:**
```javascript
(response) => {
    success: boolean,
    socketId: string,
    stats: {
        userId: string,
        username: string,
        rating: number,
        wpm: number,
        wins: number,
        losses: number,
        battles: number,
        accuracy: number
    }
}
```

---

### 2. `create-battle-room`
Create a new battle room that other players can join.

**Emit:**
```javascript
socket.emit('create-battle-room', (response) => {
    success: boolean,
    roomId: string,      // 6-character room code
    error?: string
});
```

---

### 3. `join-battle-room`
Join an existing battle room using its code.

**Emit:**
```javascript
socket.emit('join-battle-room', 'ABC123', (response) => {
    success: boolean,
    roomId?: string,
    error?: string
});
```

---

### 4. `start-battle`
Start the battle (countdown begins).

**Emit:**
```javascript
socket.emit('start-battle', {
    roomId: string,
    gameData: {
        questions: Array,
        difficulty: string
    }
}, (response) => {
    success: boolean,
    error?: string
});
```

---

### 5. `update-progress`
Send player progress during active battle (sent every 500ms).

**Emit:**
```javascript
socket.emit('update-progress', {
    roomId: string,
    charsTyped: number,       // Characters typed so far
    wpm: number,              // Words per minute
    accuracy: number,         // Accuracy percentage (0-100)
    currentQuestion: number   // Current question index
});
```

**No callback - this is a fire-and-forget event**

---

### 6. `send-emoji`
Send an emoji reaction to the opponent.

**Emit:**
```javascript
socket.emit('send-emoji', {
    roomId: string,
    emoji: string              // Single emoji character
});
```

**Available emoji reactions:**
- 😎 Cool
- 🔥 Fire
- 💪 Strong
- 🎯 Target
- ⚡ Lightning
- 🚀 Rocket
- 🎉 Celebration
- 💯 Perfect

---

### 7. `finish-battle`
Mark the player as finished with the battle.

**Emit:**
```javascript
socket.emit('finish-battle', {
    roomId: string,
    stats: {
        wpm: number,
        accuracy: number,
        questionsAnswered: number,
        totalQuestions: number,
        charsTyped: number
    }
}, (response) => {
    success: boolean,
    error?: string
});
```

---

### 8. `join-queue`
Join the matchmaking queue for automatic opponent matching.

**Emit:**
```javascript
socket.emit('join-queue', (response) => {
    success: boolean,
    position?: number,         // Position in queue
    error?: string
});
```

---

### 9. `leave-queue`
Leave the matchmaking queue.

**Emit:**
```javascript
socket.emit('leave-queue');
```

---

## Server Events (Listen)

### 1. `user-registered`
Fired after successful user registration.

**Payload:**
```javascript
{
    socketId: string,
    stats: {
        userId: string,
        username: string,
        rating: number,
        wpm: number,
        wins: number,
        losses: number,
        battles: number,
        accuracy: number
    }
}
```

---

### 2. `battle-ready`
Fired when opponent joins the room.

**Payload:**
```javascript
{
    host: {
        username: string,
        rating: number
    },
    opponent: {
        username: string,
        rating: number
    }
}
```

---

### 3. `battle-started`
Fired when battle begins (countdown phase).

**Payload:**
```javascript
{
    gameData: {
        questions: Array,
        difficulty: string
    },
    startTime: number          // Timestamp in milliseconds
}
```

---

### 4. `opponent-progress-updated`
Fired when opponent's progress changes.

**Payload:**
```javascript
{
    isHost: boolean,           // Is the updater the host?
    progress: {
        charsTyped: number,
        wpm: number,
        accuracy: number,
        currentQuestion: number
    }
}
```

---

### 5. `emoji-received`
Fired when opponent sends an emoji reaction.

**Payload:**
```javascript
{
    emoji: string,
    sender: string,            // Opponent's username
    timestamp: number,
    isHost: boolean
}
```

---

### 6. `match-found`
Fired when matchmaking finds an opponent.

**Payload:**
```javascript
{
    roomId: string,
    opponent: {
        username: string,
        rating: number
    }
}
```

---

### 7. `battle-completed`
Fired when both players finish the battle.

**Payload:**
```javascript
{
    winner: 'host' | 'opponent' | 'draw',
    hostStats: {
        wpm: number,
        accuracy: number,
        questionsAnswered: number,
        totalQuestions: number,
        charsTyped: number
    },
    opponentStats: {
        wpm: number,
        accuracy: number,
        questionsAnswered: number,
        totalQuestions: number,
        charsTyped: number
    },
    hostUser: {
        username: string,
        rating: number
    },
    opponentUser: {
        username: string,
        rating: number
    }
}
```

---

### 8. `opponent-disconnected`
Fired when opponent disconnects during active battle.

**Payload:**
```javascript
{}  // Empty - just notifies disconnection
```

---

### 9. `joined-queue`
Fired after successfully joining matchmaking queue.

**Payload:**
```javascript
{
    position: number           // Position in queue
}
```

---

### 10. `left-queue`
Fired after leaving the matchmaking queue.

**Payload:**
```javascript
{}  // Empty - just confirms left queue
```

---

## HTTP Endpoints

### Health Check
```
GET /health
```

**Response:**
```javascript
{
    status: 'ok',
    timestamp: '2024-01-15T10:30:00.000Z',
    activeConnections: 5,
    activeBattles: 2,
    queueSize: 1
}
```

---

### Server Statistics
```
GET /stats
```

**Response:**
```javascript
{
    activeUsers: 10,
    activeBattles: 3,
    queueSize: 2,
    totalUsers: 150,
    timestamp: '2024-01-15T10:30:00.000Z'
}
```

---

## Error Handling

All events that have callbacks will return errors in this format:

```javascript
{
    success: false,
    error: 'Description of what went wrong'
}
```

**Common errors:**
- `User not registered` - Must call `register-user` first
- `Room not found` - Invalid room ID
- `Battle already in progress` - Can't join active battles
- `Room is full` - Opponent already joined
- `Already in queue` - Already joined matchmaking

---

## Event Flow Examples

### Example 1: Direct Room Battle
```javascript
// Player 1
socket.on('connect', () => {
    socket.emit('register-user', { userId: 'user1', username: 'Player1' });
});

socket.on('user-registered', () => {
    socket.emit('create-battle-room', (res) => {
        roomCode = res.roomId;
    });
});

socket.on('battle-ready', () => {
    // Opponent joined, ready to start
    socket.emit('start-battle', { roomId, gameData });
});

socket.on('battle-started', () => {
    // Start the game!
    startCountdown();
});

// ... during game ...
socket.emit('update-progress', { roomId, charsTyped, wpm, accuracy });

// ... when finished ...
socket.emit('finish-battle', { roomId, stats }, (res) => {
    console.log('Battle completed!');
});

socket.on('battle-completed', (result) => {
    showResults(result);
});
```

### Example 2: Matchmaking
```javascript
socket.on('connect', () => {
    socket.emit('register-user', { userId: 'user2', username: 'Player2' });
});

socket.on('user-registered', () => {
    socket.emit('join-queue', (res) => {
        console.log(`In queue at position ${res.position}`);
    });
});

socket.on('match-found', (data) => {
    roomId = data.roomId;
    opponent = data.opponent;
    // Wait for start or click start button
});

// ... rest is same as above ...
```

---

## Rate Limiting

Recommendations for production:

- **Progress updates**: Max 1 per 250ms (client-side throttled)
- **Emoji reactions**: Max 1 per 500ms
- **Room creation**: Max 5 per minute per user
- **Queue joins**: Max 1 per minute

---

## Security Considerations

1. **Validate all game data server-side** - Never trust client WPM/accuracy
2. **Rate limit all events** - Prevent spam/abuse
3. **Authenticate users** - Only registered Firebase users allowed
4. **Sanitize usernames** - Prevent XSS attacks
5. **Track suspicious patterns** - Multiple disconnects, impossible stats
6. **Use SSL/TLS** - Encrypt all data in transit

---

## Debugging

### Enable Socket.io Debug Logging
```javascript
const socket = io('http://localhost:3001', {
    debug: true
});

// Or in browser console:
localStorage.debug = 'socket.io-client:*';
```

### Test Connection
```bash
node test-battle-connection.js
```

### Monitor Server
```bash
# In another terminal while server running
curl http://localhost:3001/stats | jq
```

---

## Version History

- **v1.0** (Current): Initial release with core battle features
- Future: Tournaments, team battles, spectator mode
