import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "../../../context/GameContext";
import { GAME_MODES } from "../../../lib/gameData";

export default function MemoryPhase() {
    const { difficulty, questions, startTyping } = useGame();
    const mode = GAME_MODES[difficulty];
    const [timeLeft, setTimeLeft] = useState(mode ? mode.memoryTime : 10);

    useEffect(() => {
        if (timeLeft <= 0) {
            startTyping();
            return;
        }
        const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, startTyping]);

    const progress = mode ? timeLeft / mode.memoryTime : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-8 px-4"
        >
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-3xl font-display font-bold text-glow-cyan text-primary tracking-wider uppercase"
            >
                Memorize!
            </motion.h2>

            <div className="w-full max-w-2xl space-y-4">
                <AnimatePresence>
                    {questions.map((q, i) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border"
                        >
                            <span className="text-xl font-display font-medium text-muted-foreground shrink-0 w-full md:w-64">
                                {q.question}
                            </span>
                            <span className="text-2xl font-display font-bold text-neon-green text-glow-green">
                                {q.answer}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-col items-center gap-3 mt-4">
                <div className="w-64 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        animate={{ width: `${progress * 100}%` }}
                        style={{
                            background: `linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-green)))`,
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>
                <motion.span
                    key={timeLeft}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className={`text-4xl font-display font-black ${timeLeft <= 3 ? "text-neon-red text-glow-red" : "text-primary text-glow-cyan"}`}
                >
                    {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                </motion.span>
            </div>
        </motion.div>
    );
}
