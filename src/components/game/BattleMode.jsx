import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { ArrowLeft, Copy, Zap } from "lucide-react";
import { toast } from "sonner";

export default function BattleMode() {
    const { setPhase } = useGame();
    const [gameState, setGameState] = useState("setup"); // setup, room-created, waiting, active
    const [roomCode, setRoomCode] = useState("");
    const [inputCode, setInputCode] = useState("");

    const generateRoomCode = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(code);
        setGameState("room-created");
        toast.success(`Room created: ${code}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode);
        toast.success("Room code copied!");
    };

    const joinRoom = () => {
        if (!inputCode.trim()) {
            toast.error("Please enter a room code");
            return;
        }
        if (inputCode.length !== 6) {
            toast.error("Room code must be 6 characters");
            return;
        }
        setGameState("waiting");
        toast.success(`Joining room: ${inputCode}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
        >
            <div className="relative w-full max-w-4xl flex items-center justify-center mb-4 text-center">
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
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-5xl font-display font-bold tracking-wider text-glow-cyan text-primary uppercase"
                >
                    Battle Mode
                </motion.h2>
            </div>

            <div className="w-full max-w-2xl">
                {gameState === "setup" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Create Room */}
                        <motion.button
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={generateRoomCode}
                            className="group relative flex flex-col items-center gap-4 p-8 rounded-xl neon-border-cyan bg-card/30 backdrop-blur-md transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 p-5 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:neon-border-cyan transition-all duration-500">
                                <Zap className="w-12 h-12 text-glow-cyan" />
                            </div>
                            <div className="relative z-10 text-center space-y-3">
                                <h3 className="text-2xl font-display font-black uppercase tracking-[0.2em] text-primary text-glow-cyan">
                                    Create Room
                                </h3>
                                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest leading-relaxed">
                                    Start a new battle<br />& invite a friend
                                </p>
                            </div>
                            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        </motion.button>

                        {/* Join Room */}
                        <motion.button
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setGameState("join")}
                            className="group relative flex flex-col items-center gap-4 p-8 rounded-xl neon-border-orange bg-card/30 backdrop-blur-md transition-all duration-500 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-neon-orange/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 p-5 rounded-2xl bg-neon-orange/10 text-neon-orange border border-neon-orange/20 group-hover:scale-110 group-hover:neon-border-orange transition-all duration-500">
                                <Zap className="w-12 h-12 text-glow-orange" />
                            </div>
                            <div className="relative z-10 text-center space-y-3">
                                <h3 className="text-2xl font-display font-black uppercase tracking-[0.2em] text-neon-orange text-glow-orange">
                                    Join Room
                                </h3>
                                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest leading-relaxed">
                                    Enter a room code<br />& join the battle
                                </p>
                            </div>
                            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        </motion.button>
                    </motion.div>
                )}

                {gameState === "room-created" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl font-display font-bold text-primary uppercase tracking-wider">
                                Room Created!
                            </h3>
                            <p className="text-muted-foreground text-sm">Share this code with your friend</p>
                        </div>

                        <div className="relative">
                            <div className="p-6 rounded-xl neon-border-cyan bg-primary/5 backdrop-blur-md text-center space-y-4">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-5xl font-display font-black text-glow-cyan text-primary tracking-[0.3em]"
                                >
                                    {roomCode}
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={copyToClipboard}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-display font-bold uppercase tracking-wider text-sm"
                                >
                                    <Copy className="w-4 h-4" />
                                    Copy Code
                                </motion.button>
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-muted-foreground text-xs uppercase tracking-widest">
                                Waiting for opponent...
                            </p>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex justify-center gap-2"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                            </motion.div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setGameState("setup")}
                            className="w-full px-4 py-3 rounded-lg bg-muted/10 text-muted-foreground border border-muted/20 hover:bg-muted/20 transition-colors font-display font-bold uppercase tracking-wider text-sm"
                        >
                            Cancel
                        </motion.button>
                    </motion.div>
                )}

                {gameState === "join" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl font-display font-bold text-neon-orange uppercase tracking-wider">
                                Join Battle
                            </h3>
                            <p className="text-muted-foreground text-sm">Enter the room code from your opponent</p>
                        </div>

                        <div className="p-6 rounded-xl neon-border-orange bg-neon-orange/5 backdrop-blur-md space-y-4">
                            <input
                                type="text"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                placeholder="ENTER CODE"
                                maxLength="6"
                                className="w-full px-4 py-3 text-center text-2xl font-display font-bold tracking-[0.2em] rounded-lg bg-black/50 border border-neon-orange/30 text-neon-orange placeholder-muted-foreground/30 focus:outline-none focus:border-neon-orange/60 focus:ring-1 focus:ring-neon-orange/30 transition-all uppercase"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={joinRoom}
                                className="w-full px-4 py-3 rounded-lg bg-neon-orange/10 text-neon-orange border border-neon-orange/20 hover:bg-neon-orange/20 transition-colors font-display font-bold uppercase tracking-wider text-sm"
                            >
                                Join Room
                            </motion.button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setGameState("setup")}
                            className="w-full px-4 py-3 rounded-lg bg-muted/10 text-muted-foreground border border-muted/20 hover:bg-muted/20 transition-colors font-display font-bold uppercase tracking-wider text-sm"
                        >
                            Back
                        </motion.button>
                    </motion.div>
                )}

                {gameState === "waiting" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="p-6 rounded-xl neon-border-cyan bg-primary/5 backdrop-blur-md space-y-4">
                            <p className="text-muted-foreground text-sm">Joined room: <span className="text-primary font-display font-bold">{inputCode}</span></p>
                            <p className="text-muted-foreground text-xs uppercase tracking-widest">
                                Waiting for battle to start...
                            </p>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="flex justify-center gap-2"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                            </motion.div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setGameState("setup")}
                            className="w-full px-4 py-3 rounded-lg bg-muted/10 text-muted-foreground border border-muted/20 hover:bg-muted/20 transition-colors font-display font-bold uppercase tracking-wider text-sm"
                        >
                            Cancel
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
