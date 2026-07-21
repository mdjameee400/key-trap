import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { useAuth } from "../../context/AuthContext";
import io from "socket.io-client";
import { ArrowLeft, Copy, Send, Zap, Trophy, Users, Gauge } from "lucide-react";
import { toast } from "sonner";

const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER || "http://localhost:3001";

// Emoji quick reactions
const EMOJI_REACTIONS = ["😎", "🔥", "💪", "🎯", "⚡", "🚀", "🎉", "💯"];

export default function BattleGame() {
    const { setPhase, questions, startTime: initialStartTime } = useGame();
    const { user } = useAuth();
    const socketRef = useRef(null);
    const gameStartTimeRef = useRef(null);

    // Game state
    const [gameState, setGameState] = useState("menu"); // menu, room-setup, waiting, countdown, active, finished
    const [roomId, setRoomId] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [opponent, setOpponent] = useState(null);
    const [userStats, setUserStats] = useState(null);

    // Battle progress
    const [hostProgress, setHostProgress] = useState({ charsTyped: 0, wpm: 0, accuracy: 0, currentQuestion: 0 });
    const [opponentProgress, setOpponentProgress] = useState({ charsTyped: 0, wpm: 0, accuracy: 0, currentQuestion: 0 });

    // Game data
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [isAnswered, setIsAnswered] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [showCountdown, setShowCountdown] = useState(false);
    const [battleResult, setBattleResult] = useState(null);
    const [emojis, setEmojis] = useState([]);

    // Initialize WebSocket connection
    useEffect(() => {
        if (!user) return;

        socketRef.current = io(SOCKET_SERVER, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        socketRef.current.on("connect", () => {
            console.log("[Socket] Connected:", socketRef.current.id);
            socketRef.current.emit("register-user", {
                userId: user.uid,
                username: user.displayName || "Anonymous"
            });
        });

        socketRef.current.on("user-registered", (data) => {
            setUserStats(data.stats);
        });

        socketRef.current.on("battle-ready", (data) => {
            setOpponent({
                username: data.opponent.username,
                rating: data.opponent.rating
            });
            setGameState("waiting");
            toast.success("Opponent found! Get ready!");
        });

        socketRef.current.on("battle-started", (data) => {
            gameStartTimeRef.current = data.startTime;
            setShowCountdown(true);
            setGameState("countdown");
        });

        socketRef.current.on("opponent-progress-updated", (data) => {
            if (data.isHost) {
                setHostProgress(data.progress);
            } else {
                setOpponentProgress(data.progress);
            }
        });

        socketRef.current.on("emoji-received", (data) => {
            setEmojis(prev => [...prev.slice(-4), data]);
            setTimeout(() => {
                setEmojis(prev => prev.filter(e => e.timestamp > Date.now() - 3000));
            }, 3000);
        });

        socketRef.current.on("battle-completed", (data) => {
            setBattleResult(data);
            setGameState("finished");
        });

        socketRef.current.on("opponent-disconnected", () => {
            toast.error("Opponent disconnected!");
            setGameState("menu");
        });

        socketRef.current.on("match-found", (data) => {
            setRoomId(data.roomId);
            setOpponent({
                username: data.opponent.username,
                rating: data.opponent.rating
            });
            setGameState("waiting");
            toast.success(`Matched with ${data.opponent.username}!`);
        });

        socketRef.current.on("disconnect", () => {
            console.log("[Socket] Disconnected");
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [user]);

    // Countdown timer
    useEffect(() => {
        if (gameState !== "countdown" || !showCountdown) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowCountdown(false);
            setGameState("active");
            setCountdown(3);
        }
    }, [countdown, showCountdown, gameState]);

    // Send progress updates every 500ms
    useEffect(() => {
        if (gameState !== "active" || !roomId) return;

        const interval = setInterval(() => {
            const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
            const wpm = elapsed > 0 ? Math.round((userInput.length / 5) / (elapsed / 60)) : 0;

            // Calculate accuracy
            const currentQuestion = questions[currentQuestionIndex];
            const correctChars = currentQuestion
                ? [...userInput].filter((char, idx) => char === currentQuestion.answer[idx]).length
                : 0;
            const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;

            socketRef.current?.emit("update-progress", {
                roomId,
                charsTyped: userInput.length,
                wpm,
                accuracy,
                currentQuestion
            });
        }, 500);

        return () => clearInterval(interval);
    }, [gameState, roomId, userInput, currentQuestionIndex, questions]);

    // Handle answer submission
    const handleSubmitAnswer = useCallback(() => {
        if (!questions[currentQuestionIndex]) return;

        const isCorrect = userInput.toLowerCase().trim() ===
            questions[currentQuestionIndex].answer.toLowerCase().trim();

        if (isCorrect) {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setUserInput("");
                setIsAnswered(false);
            } else {
                // Finish battle
                finishBattle();
            }
        } else {
            toast.error("Incorrect answer!");
        }
    }, [userInput, currentQuestionIndex, questions]);

    const finishBattle = () => {
        const totalTime = (Date.now() - gameStartTimeRef.current) / 1000;
        const wpm = totalTime > 0 ? Math.round((userInput.length / 5) / (totalTime / 60)) : 0;

        socketRef.current?.emit("finish-battle", {
            roomId,
            stats: {
                wpm,
                accuracy: hostProgress.accuracy,
                questionsAnswered: currentQuestionIndex + 1,
                totalQuestions: questions.length,
                charsTyped: userInput.length
            }
        });

        setGameState("finished");
    };

    const createBattle = () => {
        socketRef.current?.emit("create-battle-room", (response) => {
            if (response.success) {
                setRoomId(response.roomId);
                setGameState("room-setup");
                toast.success(`Room created: ${response.roomId}`);
            }
        });
    };

    const joinBattle = () => {
        if (!joinCode.trim() || joinCode.length !== 6) {
            toast.error("Invalid room code");
            return;
        }

        socketRef.current?.emit("join-battle-room", joinCode, (response) => {
            if (response.success) {
                setRoomId(response.roomId);
                setGameState("waiting");
                toast.success(`Joined room: ${joinCode}`);
            } else {
                toast.error(response.error);
            }
        });
    };

    const startBattleGame = () => {
        socketRef.current?.emit("start-battle", {
            roomId,
            gameData: { questions, difficulty: "battle" }
        });
    };

    const joinMatchmaking = () => {
        socketRef.current?.emit("join-queue", (response) => {
            if (response.success) {
                setGameState("waiting");
                toast.success("Joined matchmaking queue!");
            }
        });
    };

    const sendEmoji = (emoji) => {
        socketRef.current?.emit("send-emoji", { roomId, emoji });
    };

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomId);
        toast.success("Room code copied!");
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-8"
        >
            {/* Header */}
            <div className="relative w-full max-w-5xl flex items-center justify-center mb-4">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPhase("game-mode-select")}
                    className="absolute left-0 p-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <h1 className="text-4xl md:text-5xl font-display font-black text-glow-cyan text-primary uppercase tracking-wider">
                    ⚡ Battle Mode
                </h1>
            </div>

            {/* User Stats */}
            {userStats && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-6 text-sm"
                >
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Trophy className="w-4 h-4" />
                        <span>{userStats.wins}W - {userStats.losses}L</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Gauge className="w-4 h-4" />
                        <span>Rating: {userStats.rating}</span>
                    </div>
                </motion.div>
            )}

            <div className="w-full max-w-5xl">
                <AnimatePresence mode="wait">
                    {/* Menu State */}
                    {gameState === "menu" && (
                        <motion.div
                            key="menu"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {/* Matchmaking */}
                            <motion.button
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={joinMatchmaking}
                                className="group relative flex flex-col items-center gap-4 p-8 rounded-xl neon-border-cyan bg-card/30 backdrop-blur-md overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 p-5 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-all duration-500">
                                    <Users className="w-12 h-12 text-glow-cyan" />
                                </div>
                                <div className="relative z-10 text-center space-y-2">
                                    <h3 className="text-2xl font-display font-black uppercase text-primary text-glow-cyan">
                                        Matchmake
                                    </h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Auto-match with<br />similar rating
                                    </p>
                                </div>
                            </motion.button>

                            {/* Create Room */}
                            <motion.button
                                initial={{ opacity: 0, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={createBattle}
                                className="group relative flex flex-col items-center gap-4 p-8 rounded-xl neon-border-orange bg-card/30 backdrop-blur-md overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 p-5 rounded-2xl bg-neon-orange/10 text-neon-orange border border-neon-orange/20 group-hover:scale-110 transition-all duration-500">
                                    <Zap className="w-12 h-12 text-glow-orange" />
                                </div>
                                <div className="relative z-10 text-center space-y-2">
                                    <h3 className="text-2xl font-display font-black uppercase text-neon-orange text-glow-orange">
                                        Create Room
                                    </h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Invite friends<br />with room code
                                    </p>
                                </div>
                            </motion.button>

                            {/* Join Room */}
                            <motion.button
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setGameState("join")}
                                className="group relative flex flex-col items-center gap-4 p-8 rounded-xl neon-border-cyan bg-card/30 backdrop-blur-md overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative z-10 p-5 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-all duration-500">
                                    <Copy className="w-12 h-12 text-glow-cyan" />
                                </div>
                                <div className="relative z-10 text-center space-y-2">
                                    <h3 className="text-2xl font-display font-black uppercase text-primary text-glow-cyan">
                                        Join Room
                                    </h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        Enter room code<br />from friend
                                    </p>
                                </div>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Join Room State */}
                    {gameState === "join" && (
                        <motion.div
                            key="join"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6 max-w-md mx-auto"
                        >
                            <h2 className="text-center text-2xl font-display font-bold text-neon-orange uppercase">
                                Enter Room Code
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="XXXXXX"
                                    maxLength="6"
                                    className="w-full px-4 py-4 text-center text-3xl font-display font-bold tracking-[0.3em] rounded-lg bg-black/50 border border-neon-orange/30 text-neon-orange placeholder-muted-foreground/30 focus:outline-none focus:border-neon-orange/60 uppercase"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={joinBattle}
                                    className="w-full px-4 py-3 rounded-lg bg-neon-orange/10 text-neon-orange border border-neon-orange/20 hover:bg-neon-orange/20 font-display font-bold uppercase"
                                >
                                    Join Battle
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setGameState("menu")}
                                    className="w-full px-4 py-3 rounded-lg bg-muted/10 text-muted-foreground border border-muted/20 hover:bg-muted/20 font-display font-bold uppercase"
                                >
                                    Back
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* Room Setup State */}
                    {gameState === "room-setup" && (
                        <motion.div
                            key="room-setup"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6 max-w-md mx-auto"
                        >
                            <h2 className="text-center text-2xl font-display font-bold text-primary uppercase">
                                Room Created!
                            </h2>
                            <div className="p-6 rounded-xl neon-border-cyan bg-primary/5 backdrop-blur-md space-y-4">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-5xl font-display font-black text-glow-cyan text-primary tracking-[0.3em] text-center"
                                >
                                    {roomId}
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={copyRoomCode}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-display font-bold uppercase"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Code
                                </motion.button>
                            </div>
                            <p className="text-center text-muted-foreground text-sm">
                                Waiting for opponent to join...
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setGameState("menu")}
                                className="w-full px-4 py-3 rounded-lg bg-muted/10 text-muted-foreground border border-muted/20 hover:bg-muted/20 font-display font-bold uppercase"
                            >
                                Cancel
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Waiting State */}
                    {gameState === "waiting" && opponent && (
                        <motion.div
                            key="waiting"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6 max-w-2xl mx-auto"
                        >
                            <h2 className="text-center text-2xl font-display font-bold text-primary uppercase">
                                Opponent Found!
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-xl neon-border-cyan bg-primary/5 backdrop-blur-md text-center space-y-2">
                                    <h3 className="text-lg font-display font-bold text-primary">You</h3>
                                    <p className="text-sm text-muted-foreground">{user?.displayName || "Anonymous"}</p>
                                    <p className="text-xs text-muted-foreground">Rating: {userStats?.rating}</p>
                                </div>
                                <div className="p-6 rounded-xl neon-border-orange bg-neon-orange/5 backdrop-blur-md text-center space-y-2">
                                    <h3 className="text-lg font-display font-bold text-neon-orange">Opponent</h3>
                                    <p className="text-sm text-muted-foreground">{opponent.username}</p>
                                    <p className="text-xs text-muted-foreground">Rating: {opponent.rating}</p>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startBattleGame}
                                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-primary to-neon-orange text-white font-display font-bold uppercase text-lg"
                            >
                                Start Battle!
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Countdown State */}
                    {gameState === "countdown" && (
                        <motion.div
                            key="countdown"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ scale: [0.5, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-8xl font-display font-black text-glow-cyan text-primary"
                            >
                                {countdown}
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Active Battle State */}
                    {gameState === "active" && questions[currentQuestionIndex] && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6 max-w-5xl"
                        >
                            {/* Progress Bars */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg neon-border-cyan bg-primary/5 backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-display font-bold text-primary">You</span>
                                        <span className="text-xs text-muted-foreground">{hostProgress.wpm} WPM</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                                            className="h-full bg-gradient-to-r from-primary to-cyan-400"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg neon-border-orange bg-neon-orange/5 backdrop-blur-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-display font-bold text-neon-orange">{opponent?.username}</span>
                                        <span className="text-xs text-muted-foreground">{opponentProgress.wpm} WPM</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${(opponentProgress.currentQuestion / questions.length) * 100}%` }}
                                            className="h-full bg-gradient-to-r from-neon-orange to-orange-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Question Display */}
                            <div className="p-6 rounded-xl neon-border-cyan bg-card/30 backdrop-blur-md text-center space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </div>
                                <h2 className="text-2xl font-display font-bold text-primary">
                                    {questions[currentQuestionIndex].question}
                                </h2>
                            </div>

                            {/* Input and Answer */}
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => {
                                        setUserInput(e.target.value);
                                        setIsAnswered(false);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                                            handleSubmitAnswer();
                                        }
                                    }}
                                    placeholder="Type your answer here..."
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-primary/30 text-primary placeholder-muted-foreground/30 focus:outline-none focus:border-primary/60 font-display"
                                    autoFocus
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSubmitAnswer}
                                    className="w-full px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-display font-bold uppercase"
                                >
                                    Submit
                                </motion.button>
                            </div>

                            {/* Emoji Reactions */}
                            <div className="flex justify-center gap-2">
                                {EMOJI_REACTIONS.map((emoji) => (
                                    <motion.button
                                        key={emoji}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => sendEmoji(emoji)}
                                        className="text-2xl hover:scale-125 transition-transform"
                                    >
                                        {emoji}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Floating Emojis */}
                            <AnimatePresence>
                                {emojis.map((emojiData, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 0 }}
                                        animate={{ opacity: 1, y: -50 }}
                                        exit={{ opacity: 0 }}
                                        className={`absolute text-3xl pointer-events-none ${
                                            emojiData.isHost ? "left-1/4" : "right-1/4"
                                        }`}
                                    >
                                        {emojiData.emoji}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Finished State */}
                    {gameState === "finished" && battleResult && (
                        <motion.div
                            key="finished"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6 max-w-3xl mx-auto"
                        >
                            <h2 className="text-center text-4xl font-display font-black uppercase">
                                {battleResult.winner === "draw" ? "It's a Draw!" : `${battleResult.winner === "host" ? "You" : opponent?.username} Won!`}
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-xl neon-border-cyan bg-primary/5 backdrop-blur-md space-y-3">
                                    <h3 className="font-display font-bold text-primary">Your Stats</h3>
                                    <div className="text-sm space-y-1">
                                        <p>WPM: <span className="text-primary font-bold">{battleResult.hostStats.wpm}</span></p>
                                        <p>Accuracy: <span className="text-primary font-bold">{battleResult.hostStats.accuracy}%</span></p>
                                        <p>Questions: <span className="text-primary font-bold">{battleResult.hostStats.questionsAnswered}/{battleResult.hostStats.totalQuestions}</span></p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-xl neon-border-orange bg-neon-orange/5 backdrop-blur-md space-y-3">
                                    <h3 className="font-display font-bold text-neon-orange">{opponent?.username}</h3>
                                    <div className="text-sm space-y-1">
                                        <p>WPM: <span className="text-neon-orange font-bold">{battleResult.opponentStats.wpm}</span></p>
                                        <p>Accuracy: <span className="text-neon-orange font-bold">{battleResult.opponentStats.accuracy}%</span></p>
                                        <p>Questions: <span className="text-neon-orange font-bold">{battleResult.opponentStats.questionsAnswered}/{battleResult.opponentStats.totalQuestions}</span></p>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setGameState("menu");
                                    setBattleResult(null);
                                    setUserInput("");
                                    setCurrentQuestionIndex(0);
                                }}
                                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-primary to-neon-orange text-white font-display font-bold uppercase text-lg"
                            >
                                Play Again
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
