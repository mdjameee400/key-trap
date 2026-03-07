import React from "react";
import { motion } from "framer-motion";
import { useGame } from "../../../context/GameContext";
import { GAME_MODES } from "../../../lib/gameData";
import { ArrowLeft } from "lucide-react";

const modeStyles = {
    easy: { border: "neon-border-green", text: "text-neon-green text-glow-green", glow: "bg-neon-green/10", bg: "hover:bg-neon-green/10" },
    medium: { border: "neon-border-orange", text: "text-neon-orange text-glow-orange", glow: "bg-neon-orange/10", bg: "hover:bg-neon-orange/10" },
    hard: { border: "neon-border-red", text: "text-neon-red text-glow-red", glow: "bg-neon-red/10", bg: "hover:bg-neon-red/10" },
};

export default function ModeSelect() {
    const { selectMode, setPhase } = useGame();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
        >
            <div className="relative w-full max-w-3xl flex items-center justify-center mb-4">
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPhase("hero")}
                    className="absolute left-0 p-2 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </motion.button>
                <motion.h2
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-4xl font-display font-bold tracking-wider text-glow-cyan text-primary uppercase"
                >
                    Select Mode
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
                {["easy", "medium", "hard"].map((diff, i) => {
                    const mode = GAME_MODES[diff];
                    const style = modeStyles[diff];
                    return (
                        <motion.button
                            key={diff}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.15 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => selectMode(diff)}
                            className={`flex flex-col items-center gap-3 p-6 rounded-lg ${style.border} ${style.bg} bg-card/50 backdrop-blur-sm transition-colors cursor-pointer`}
                        >
                            <span className={`text-2xl font-display font-black uppercase tracking-wider ${style.text}`}>
                                {mode.label}
                            </span>
                            <span className={`text-3xl font-display font-bold ${style.text}`}>
                                {mode.memoryTime}s
                            </span>
                            <span className="text-sm font-body text-muted-foreground uppercase tracking-wider">
                                {mode.description}
                            </span>
                            <span className="text-xs font-body text-muted-foreground">
                                {mode.questionCount} Questions · {mode.multiplier}x Score
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
