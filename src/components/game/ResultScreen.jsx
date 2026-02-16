import React from "react";
import { motion } from "framer-motion";
import { useGame } from "../../context/GameContext";
import { Target, Gauge, AlertTriangle, Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";

export default function ResultScreen() {
    const { result, resetGame, setPhase, startTypingTest } = useGame();
    if (!result) return null;

    const stats = [
        { label: "Accuracy", value: `${result.accuracy}%`, icon: Target, color: "text-neon-cyan text-glow-cyan" },
        { label: "WPM", value: String(result.wpm), icon: Gauge, color: "text-neon-green text-glow-green" },
        { label: "Mistakes", value: String(result.mistakes), icon: AlertTriangle, color: "text-neon-orange text-glow-orange" },
        { label: "Final Score", value: String(result.score), icon: Trophy, color: "text-neon-yellow" },
    ];

    const isTypingTest = result.difficulty === "typing-test";

    const feedback = isTypingTest
        ? (result.wpm >= 80 ? "🔥 Typing Speed Demon!" : result.wpm >= 40 ? "💪 Solid Rhythm!" : "⌨️ Keep Practicing!")
        : (result.accuracy >= 80 ? "🔥 Outstanding Memory!" : result.accuracy >= 50 ? "💪 Good Effort!" : "🧠 Keep Practicing!");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen gap-6 px-4 py-8"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mb-2"
            >
                <img src="/icon.png" alt="Logo" className="w-16 h-16 object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]" />
            </motion.div>

            <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-3xl md:text-4xl font-display font-black text-glow-cyan text-primary tracking-wider px-4 text-center"
            >
                {feedback}
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-border"
                    >
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                        <span className={`text-2xl font-display font-black ${stat.color}`}>{stat.value}</span>
                    </motion.div>
                ))}
            </div>

            {!isTypingTest && (
                <div className="w-full max-w-2xl space-y-2">
                    <h3 className="text-sm font-display text-muted-foreground uppercase tracking-wider mb-3">Answer Breakdown</h3>
                    <div className="max-h-[30vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {result.answers.map((a, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.08 }}
                                className={`flex items-center gap-3 p-3 rounded-lg border ${a.isCorrect ? "border-neon-green/30 bg-neon-green/5" : "border-neon-red/30 bg-neon-red/5"
                                    }`}
                            >
                                {a.isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-neon-green shrink-0" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-neon-red shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-body text-foreground">{a.question}</p>
                                    <p className="text-xs font-body text-muted-foreground">
                                        Your answer: <span className={a.isCorrect ? "text-neon-green" : "text-neon-red"}>{a.userAnswer || "(empty)"}</span>
                                        {!a.isCorrect && <span className="text-neon-green ml-2">→ {a.correctAnswer}</span>}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex gap-4 mt-4"
            >
                <button
                    onClick={isTypingTest ? () => { resetGame(); startTypingTest(); } : resetGame}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider
            neon-border-cyan bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                </button>
                <button
                    onClick={() => { resetGame(); setPhase(isTypingTest ? "hero" : "mode-select"); }}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm uppercase tracking-wider
            border border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                    {isTypingTest ? "Exit to Menu" : "Change Mode"}
                </button>
            </motion.div>
        </motion.div>
    );
}
