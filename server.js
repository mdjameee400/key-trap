import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Support multiple CLIENT_URL origins (comma-separated)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:8080")
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

const io = new Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                callback(null, true);
            } else {
                console.warn(`[CORS] Blocked origin: ${origin}`);
                callback(null, true); // Allow all for now — tighten in production
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true
}));
app.use(express.json());

// Store active battles and users
const battles = new Map(); // roomId -> battle state
const users = new Map(); // userId -> user info
const userBattles = new Map(); // userId -> roomId

// User stats (in production, use database)
const userStats = new Map();

// Battle queue for matchmaking
const matchQueue = [];

io.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Register user when they join
    socket.on('register-user', (userData) => {
        const { userId, username, rating = 1200 } = userData;
        
        users.set(socket.id, {
            socketId: socket.id,
            userId,
            username,
            rating: userStats.get(userId)?.rating || rating,
            typingSpeed: userStats.get(userId)?.wpm || 0
        });

        if (!userStats.has(userId)) {
            userStats.set(userId, {
                userId,
                username,
                rating,
                wpm: 0,
                wins: 0,
                losses: 0,
                battles: 0,
                accuracy: 0
            });
        }

        socket.emit('user-registered', {
            socketId: socket.id,
            stats: userStats.get(userId)
        });

        console.log(`[Socket] User registered: ${username} (Rating: ${users.get(socket.id).rating})`);
    });

    // Create a battle room
    socket.on('create-battle-room', (callback) => {
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const user = users.get(socket.id);

        if (!user) {
            callback({ success: false, error: 'User not registered' });
            return;
        }

        battles.set(roomId, {
            roomId,
            host: socket.id,
            hostUser: user,
            opponent: null,
            status: 'waiting',
            gameData: null,
            hostProgress: { charsTyped: 0, wpm: 0, accuracy: 0 },
            opponentProgress: { charsTyped: 0, wpm: 0, accuracy: 0 },
            startTime: null,
            endTime: null,
            emojis: []
        });

        userBattles.set(socket.id, roomId);
        socket.join(roomId);

        callback({ success: true, roomId });
        console.log(`[Battle] Room created: ${roomId} by ${user.username}`);
    });

    // Join a battle room
    socket.on('join-battle-room', (roomId, callback) => {
        const user = users.get(socket.id);

        if (!user) {
            callback({ success: false, error: 'User not registered' });
            return;
        }

        const battle = battles.get(roomId);
        if (!battle) {
            callback({ success: false, error: 'Room not found' });
            return;
        }

        if (battle.status !== 'waiting') {
            callback({ success: false, error: 'Battle already in progress or completed' });
            return;
        }

        if (battle.opponent) {
            callback({ success: false, error: 'Room is full' });
            return;
        }

        battle.opponent = socket.id;
        battle.opponentUser = user;
        battle.status = 'ready';

        userBattles.set(socket.id, roomId);
        socket.join(roomId);

        // Notify both players that battle is ready
        io.to(roomId).emit('battle-ready', {
            host: { username: battle.hostUser.username, rating: battle.hostUser.rating },
            opponent: { username: battle.opponentUser.username, rating: battle.opponentUser.rating }
        });

        callback({ success: true, roomId });
        console.log(`[Battle] ${user.username} joined room ${roomId}`);
    });

    // Start the battle
    socket.on('start-battle', (data, callback) => {
        const { roomId, gameData } = data;
        const battle = battles.get(roomId);

        if (!battle || battle.status !== 'ready') {
            callback({ success: false, error: 'Battle not ready' });
            return;
        }

        battle.status = 'active';
        battle.gameData = gameData;
        battle.startTime = Date.now();

        io.to(roomId).emit('battle-started', { gameData, startTime: battle.startTime });
        callback({ success: true });
        console.log(`[Battle] Battle started in room ${roomId}`);
    });

    // Update player progress during battle
    socket.on('update-progress', (data) => {
        const { roomId, charsTyped, wpm, accuracy, currentQuestion } = data;
        const battle = battles.get(roomId);

        if (!battle || battle.status !== 'active') return;

        if (battle.host === socket.id) {
            battle.hostProgress = { charsTyped, wpm, accuracy, currentQuestion };
        } else if (battle.opponent === socket.id) {
            battle.opponentProgress = { charsTyped, wpm, accuracy, currentQuestion };
        }

        // Broadcast progress to both players
        io.to(roomId).emit('opponent-progress-updated', {
            isHost: battle.host === socket.id,
            progress: battle.host === socket.id ? battle.hostProgress : battle.opponentProgress
        });
    });

    // Send emoji reaction
    socket.on('send-emoji', (data) => {
        const { roomId, emoji } = data;
        const user = users.get(socket.id);
        const battle = battles.get(roomId);

        if (!battle) return;

        const emojiData = {
            emoji,
            sender: user.username,
            timestamp: Date.now(),
            isHost: battle.host === socket.id
        };

        battle.emojis.push(emojiData);
        if (battle.emojis.length > 10) battle.emojis.shift();

        io.to(roomId).emit('emoji-received', emojiData);
        console.log(`[Emoji] ${user.username} sent ${emoji} in room ${roomId}`);
    });

    // Finish battle
    socket.on('finish-battle', (data, callback) => {
        const { roomId, stats } = data;
        const battle = battles.get(roomId);

        if (!battle) {
            callback({ success: false, error: 'Battle not found' });
            return;
        }

        const isHost = battle.host === socket.id;
        
        if (isHost) {
            battle.hostStats = stats;
        } else {
            battle.opponentStats = stats;
        }

        // If both players finished, determine winner
        if (battle.hostStats && battle.opponentStats) {
            battle.status = 'completed';
            battle.endTime = Date.now();

            // Calculate winner based on WPM
            const hostWPM = battle.hostStats.wpm;
            const opponentWPM = battle.opponentStats.wpm;
            let winner, loser;

            if (hostWPM > opponentWPM) {
                winner = battle.host;
                loser = battle.opponent;
                battle.winner = 'host';
            } else if (opponentWPM > hostWPM) {
                winner = battle.opponent;
                loser = battle.host;
                battle.winner = 'opponent';
            } else {
                battle.winner = 'draw';
            }

            // Update stats
            if (battle.winner !== 'draw') {
                const winnerUser = users.get(winner);
                const loserUser = users.get(loser);

                if (winnerUser && userStats.has(winnerUser.userId)) {
                    const stats = userStats.get(winnerUser.userId);
                    stats.wins++;
                    stats.battles++;
                    stats.wpm = battle.hostStats.wpm; // Last game WPM
                    stats.rating += 16; // ELO-like rating increase
                }

                if (loserUser && userStats.has(loserUser.userId)) {
                    const stats = userStats.get(loserUser.userId);
                    stats.losses++;
                    stats.battles++;
                    stats.rating = Math.max(800, stats.rating - 16); // ELO-like rating decrease
                }
            }

            // Send results to both players
            io.to(roomId).emit('battle-completed', {
                winner: battle.winner,
                hostStats: battle.hostStats,
                opponentStats: battle.opponentStats,
                hostUser: { username: battle.hostUser.username, rating: users.get(battle.host)?.rating },
                opponentUser: { username: battle.opponentUser.username, rating: users.get(battle.opponent)?.rating }
            });

            console.log(`[Battle] Room ${roomId} completed. Winner: ${battle.winner}`);
        }

        callback({ success: true });
    });

    // Join matchmaking queue
    socket.on('join-queue', (callback) => {
        const user = users.get(socket.id);

        if (!user) {
            callback({ success: false, error: 'User not registered' });
            return;
        }

        if (matchQueue.some(u => u.socketId === socket.id)) {
            callback({ success: false, error: 'Already in queue' });
            return;
        }

        matchQueue.push({
            socketId: socket.id,
            userId: user.userId,
            username: user.username,
            rating: user.rating,
            joinedAt: Date.now()
        });

        socket.emit('joined-queue', { position: matchQueue.length });
        console.log(`[Queue] ${user.username} joined matchmaking queue. Queue size: ${matchQueue.length}`);

        // Try to find matches
        tryMatchmaking();
        callback({ success: true });
    });

    // Leave matchmaking queue
    socket.on('leave-queue', () => {
        const index = matchQueue.findIndex(u => u.socketId === socket.id);
        if (index !== -1) {
            const user = matchQueue[index];
            matchQueue.splice(index, 1);
            socket.emit('left-queue');
            console.log(`[Queue] ${user.username} left matchmaking queue`);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        const roomId = userBattles.get(socket.id);

        if (roomId) {
            const battle = battles.get(roomId);
            if (battle && battle.status === 'active') {
                // Notify opponent
                const opponentSocketId = battle.host === socket.id ? battle.opponent : battle.host;
                io.to(opponentSocketId).emit('opponent-disconnected');
                console.log(`[Battle] Player disconnected from room ${roomId}`);
            }
            battles.delete(roomId);
            userBattles.delete(socket.id);
        }

        // Remove from matchmaking queue
        const queueIndex = matchQueue.findIndex(u => u.socketId === socket.id);
        if (queueIndex !== -1) {
            matchQueue.splice(queueIndex, 1);
        }

        users.delete(socket.id);
        console.log(`[Socket] User disconnected: ${user?.username || socket.id}`);
    });
});

// Matchmaking logic
function tryMatchmaking() {
    if (matchQueue.length < 2) return;

    // Find two players with similar rating (within 100 points)
    for (let i = 0; i < matchQueue.length - 1; i++) {
        for (let j = i + 1; j < matchQueue.length; j++) {
            const player1 = matchQueue[i];
            const player2 = matchQueue[j];
            const ratingDiff = Math.abs(player1.rating - player2.rating);

            if (ratingDiff <= 100) {
                // Match found!
                matchQueue.splice(j, 1);
                matchQueue.splice(i, 1);

                const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
                const battle = {
                    roomId,
                    host: player1.socketId,
                    hostUser: { username: player1.username, userId: player1.userId, rating: player1.rating },
                    opponent: player2.socketId,
                    opponentUser: { username: player2.username, userId: player2.userId, rating: player2.rating },
                    status: 'ready',
                    gameData: null,
                    hostProgress: { charsTyped: 0, wpm: 0, accuracy: 0 },
                    opponentProgress: { charsTyped: 0, wpm: 0, accuracy: 0 },
                    startTime: null,
                    endTime: null,
                    emojis: []
                };

                battles.set(roomId, battle);
                userBattles.set(player1.socketId, roomId);
                userBattles.set(player2.socketId, roomId);

                // Notify both players
                io.to(player1.socketId).emit('match-found', {
                    roomId,
                    opponent: { username: player2.username, rating: player2.rating }
                });

                io.to(player2.socketId).emit('match-found', {
                    roomId,
                    opponent: { username: player1.username, rating: player1.rating }
                });

                console.log(`[Matchmaking] Matched ${player1.username} vs ${player2.username} in room ${roomId}`);
                return; // Exit after one match
            }
        }
    }
}

// Root status page — confirms server is running
app.get('/', (req, res) => {
    res.json({
        name: 'Key Trap Battle Server',
        status: '🟢 Online',
        version: '1.0.0',
        websocket: 'Socket.IO ready',
        endpoints: {
            health: '/health',
            stats: '/stats'
        },
        activeConnections: io.engine.clientsCount,
        activeBattles: battles.size,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        activeConnections: io.engine.clientsCount,
        activeBattles: battles.size,
        queueSize: matchQueue.length
    });
});

// Get server stats
app.get('/stats', (req, res) => {
    res.json({
        activeUsers: users.size,
        activeBattles: battles.size,
        queueSize: matchQueue.length,
        totalUsers: userStats.size,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Battle server listening on port ${PORT}`);
    console.log(`WebSocket server ready for connections`);
});
