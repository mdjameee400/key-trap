import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Keyboard, LogOut, User as UserIcon, LogIn } from "lucide-react";
import { useGame } from "../../context/GameContext";
import { auth, isFirebaseConfigured } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

export default function HeroScreen() {
    const { setPhase, startTypingTest } = useGame();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.autoStart && user) {
            setPhase("game-mode-select");
            // Clear state to prevent loop on refresh
            navigate("/", { replace: true, state: {} });
        }
    }, [location.state, user, setPhase, navigate]);

    const handleLogout = async () => {
        if (!isFirebaseConfigured) {
            toast.error("Firebase is not configured");
            return;
        }
        try {
            await auth.signOut();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    const handleStartGame = () => {
        if (user) {
            setPhase("game-mode-select");
        } else {
            toast.info("Please login to play the full game");
            navigate("/auth", { state: { redirect: "game" } });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center min-h-screen gap-6 px-4"
        >
            <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-sm">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full" />
                            ) : (
                                <UserIcon className="w-4 h-4 text-primary" />
                            )}
                            <span className="text-sm font-display text-primary uppercase tracking-wider">
                                {user?.displayName || "Agent"}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-all duration-300"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/auth")}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-300 font-display text-sm tracking-widest uppercase"
                    >
                        <LogIn className="w-4 h-4" />
                        Login
                    </button>
                )}
            </div>

            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center -mb-10"
            >
                <img
                    src="/icon.png"
                    alt="Key Trap Logo"
                    className="w-[160px] h-[160px] md:w-[240px] md:h-[240px] object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.2)] z-10"
                />
                <div className="absolute w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full bg-primary/10 blur-[40px] animate-pulse-glow" />
            </motion.div>

            <div className="text-center space-y-4">
                <motion.h1
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-5xl md:text-7xl font-display font-black tracking-wider text-glow-cyan text-primary"
                >
                    KEY<span className="text-neon-orange">TRAP</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl font-display tracking-[0.3em] text-muted-foreground uppercase"
                >
                    Memory & Typing Challenge
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-6 text-muted-foreground text-sm font-body"
            >
                <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-neon-green" />
                    <span>Memorize</span>
                </div>
                <div className="flex items-center gap-2">
                    <Keyboard className="w-4 h-4 text-neon-orange" />
                    <span>Type</span>
                </div>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 mt-6">
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startTypingTest()}
                    className="px-10 py-4 font-display font-bold text-lg tracking-wider uppercase
                        bg-primary/10 text-primary neon-border-cyan rounded-lg
                        hover:bg-primary/20 transition-colors duration-300"
                >
                    Start Typing
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                    className="px-10 py-4 font-display font-bold text-lg tracking-wider uppercase
                        bg-neon-orange/10 text-neon-orange neon-border-orange rounded-lg
                        hover:bg-neon-orange/20 transition-colors duration-300"
                >
                    Start Game
                </motion.button>
            </div>
        </motion.div>
    );
}
